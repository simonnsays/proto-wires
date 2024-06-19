class Canvas {
    constructor(elementHandler, utilityTool, displayArea, user) {
        // Utility
        this.elementHandler = elementHandler
        this.utilityTool = utilityTool
        
        // Canvas Area
        this.element = elementHandler.getSimCanvas()
        if(!this.element) {
            throw new Error('no canvas element found')
        }
        this.element.width = 1300
        this.element.height = 680
        this.c = this.element.getContext('2d')
        this.isActive = true

        // Display Area
        this.displayArea = displayArea
        this.table = displayArea.table
        this.shelf = displayArea.shelf

        // User
        this.user = user

        // Mouse Move Events
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e))
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e))
        window.addEventListener('mouseup', () => this.handleMouseUp())
    }

    // Mouse Down Event
    handleMouseDown(e) {
        // only accept left click
        if(e.button !== 0 || !this.isActive) return

        // try to select one of the components in shelf
        this.user.componentSelected = this.user.selectComponent(this.shelf)

        // do nothing if no selected component
        if(!this.user.componentSelected) return

        // if a component is selected
        this.user.createTempProperties()

        // match slots 
        this.displaySlots(this.table.component, this.user.componentSelected)
    }

    // Mouse Move Event
    handleMouseMove(e) {
        // adjust mouse point relative to the canvas
        const canvasRect = this.element.getBoundingClientRect()
        const rawMouse = {x: e.clientX, y: e.clientY}

        this.user.mousePoint = {
            x: rawMouse.x - canvasRect.left,
            y: rawMouse.y - canvasRect.top
        }

        // dragging event
        if(this.user.componentSelected && this.user.isDragging) {
            this.user.dragComponent()

            // return component if out of bounds
            if(!this.utilityTool.isInsideBox(rawMouse, canvasRect)) {
                this.user.returnComponentToShelf()

                this.user.resetTempProperties()
            }
        }
    }

    // Mouse Up Event 
    handleMouseUp() {
        // return if no selected component
        if(!this.user.componentSelected) return

        // check for interaction
        let isInteracting = false

        this.user.availableSlots.forEach(slot => {
            if(!slot.box) throw new Error('Slot has no Box property')

            if(this.utilityTool.isInsideBox(this.user.mousePoint, slot.box) 
            && slot.sides[this.displayArea.currentSide].accessible) {
                isInteracting = true

                // attach component
                this.displayArea.attachComponent(this.user.componentSelected, slot)
            }
        })

        // swap components if component dragged is in table display area
        if(!isInteracting && this.utilityTool.isInsideBox(this.user.mousePoint, this.table.area)) {
            isInteracting = true

            // reset user orientation
            this.displayArea.curr = 0
            this.displayArea.currentSide = this.displayArea.displaySides[this.displayArea.curr]

            // swap components
            this.displayArea.swapComponents(this.user.componentSelected)
        }

        // return to shelf if no interaction
        if(!isInteracting) {
            this.user.returnComponentToShelf()
        }

        // clear temporary properties
        this.user.resetTempProperties()
    }

    // Display Slots (get Available slots)
    displaySlots(baseComponent,  componentSelected) {
        // match slot type to selected component type
        baseComponent.slots.forEach(slot => {
            if(slot.type === componentSelected.type && slot.component === null) {
                this.user.availableSlots.push(slot)
            }

            // get available slots from attached components
            if(slot.component) {
                this.displaySlots(slot.component, componentSelected)
            }
        })
    }

    // Rects With Border Radius(bent corners)
    fillRoundRect(left, top, width, height, radius, color) {
        this.c.beginPath();
        this.c.moveTo(left + radius, top);
        this.c.lineTo(left + width - radius, top);
        this.c.arcTo(left + width, top, left + width, top + radius, radius);
        this.c.lineTo(left + width, top + height - radius);
        this.c.arcTo(left + width, top + height, left + width - radius, top + height, radius);
        this.c.lineTo(left + radius, top + height);
        this.c.arcTo(left, top + height, left, top + height - radius, radius);
        this.c.lineTo(left, top + radius);
        this.c.arcTo(left, top, left + radius, top, radius);

        // any color you want
        // this.c.fillStyle = '#527e71'; // dark 
        // this.c.fillStyle = '#c7ddcc'; // light 
        this.c.fillStyle = color;  
        this.c.fill();
    }

    // Draw Component Image
    drawComponent(box, image) {
        this.c.drawImage(
            image,
            box.x,
            box.y,
            box.width,
            box.height
        )
    }

    // Draw Componnent in Table Area
    drawTableComponent(component, currentSide) {
        // some components can't be rotated so we use default source for that case
        let componentSide = component.isRotatable 
        ? this.utilityTool.getSide(component, currentSide) 
        : this.utilityTool.getSide(component, component.defaultSource)

        this.drawComponent(component.box, componentSide.image)
    }

    // Draw Available Slots
    drawAvailableSlots() {
        // do nothing if no available slots
        if(this.user.availableSlots.length === 0) return

        // highlight default slot box (not necessarily compatible yet)
        this.user.availableSlots.forEach(slot => {
            // draw slot if a boudning box for slot is created
            if(slot.box) {
                this.c.fillStyle = 'rgba(0, 255, 0, 0.4)'
                this.c.fillRect(
                    slot.box.x,
                    slot.box.y,
                    slot.box.width,
                    slot.box.height
                )
            }
        })
    }

    // Recursively Draw Attached Components
    drawAttachedComponents(slots, currentSide) {
        // do nothing if component has no slots
        if(slots.length < 1) return

        slots.forEach(slot => {
            if(slot.component) {
                const side = this.utilityTool.getSide(slot.component, currentSide)

                // draw slots according to the current side
                if(side) {
                    this.drawComponent(slot.component.box, side.image)
                }
                
                // draw attached components for components attached to the slot components
                this.drawAttachedComponents(slot.component.slots, currentSide)
            }
            
        })
    }

    // Main Animate Function
    animate() {
        const table = this.table
        const shelf = this.shelf

        // clear
        this.c.clearRect(0, 0, this.element.width, this.element.height)
        this.c.imageSmoothEnabed = true

        // fill Background
        this.c.fillStyle = '#fef9db'
        this.c.fillRect(0, 0, this.element.width, this.element.height)

        // fill display area
        this.fillRoundRect(table.area.x, table.area.y, table.area.width, table.area.height, 30, '#c7ddcc')

        // fill shelf areas
        shelf.forEach(spot => {
            this.fillRoundRect(spot.area.x, spot.area.y, spot.area.width, spot.area.height, 20, '#c7ddcc')
        })

        // draw Display area component
        if(table.component) {
            // draw component
            this.drawTableComponent(table.component, this.displayArea.currentSide)

            // draw attached components
            this.drawAttachedComponents(table.component.slots, this.displayArea.currentSide)

            // draw available slots
            this.drawAvailableSlots()
        }

        // draw shelf components
        shelf.forEach(spot => {
            if(spot.component) {
                // check if component as attached components
                const occupiedSlots = spot.component.slots.filter(slot => slot.component)

                //  highlight a bit for indication that the component is attached
                if(occupiedSlots.length !== 0) {
                    const scale = .7
                    const highlight = {
                        left: spot.area.x + (spot.area.width - (spot.area.width * scale)) / 2,
                        top: spot.area.y + ((spot.area.height - (spot.area.height * scale)) / 2) -20,
                        width: spot.area.width * scale,
                        height: spot.area.height * scale + 40,
                        radius: 20,
                        color: 'rgba(255,170,0, 0.3)'
                    }
                    this.fillRoundRect(
                        highlight.left, 
                        highlight.top, 
                        highlight.width, 
                        highlight.height, 
                        highlight.radius, 
                        highlight.color
                    )
                }

                // all shelf components will use default source
                const component = spot.component
                const componentSide = this.utilityTool.getSide(component, component.defaultSource) 
                this.drawComponent(component.box, componentSide.image)
            }
        })

        // Loop Canvas
        requestAnimationFrame(() => this.animate())
    }
}

export default Canvas