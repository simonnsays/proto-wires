class DisplayArea {
    constructor(elementHandler, utilityTool, portsTab) {
        // Utility
        this.elementHandler = elementHandler
        this.utilityTool = utilityTool

        // Table
        this.table = {area: {x: 10, y: 10, width: 650, height: 660}, component: null}

        // Shelf
        this.shelf = [
            {area: {x: 670, y: 10, width: 300, height: 210}, component: null},
            {area: {x: 980, y: 10, width: 310, height: 210}, component: null},
        
            {area: {x: 670, y: 230, width: 300, height: 220}, component: null},
            {area: {x: 980, y: 230, width: 310, height: 220}, component: null},
        
            {area: {x: 670, y: 460, width: 300, height: 210}, component: null},
            {area: {x: 980, y: 460, width: 310, height: 210}, component: null}
        ]

        // Wires Tab
        this.portsTab = portsTab

        // Elements
        this.elements = this.elementHandler.getDisplayAreaElements()
        if(!this.elements) {
            throw new Error ('Missing Display Area Elements')
        }

        this.leftBtn = this.elements.leftBtn
        this.rightBtn = this.elements.rightBtn
        this.compLabel = this.elements.compLabel
        this.compName = this.elements.compName
        this.panelIndicator = this.elements.panelIndicator

        // Display Sides
        this.displaySides = ['left', 'front', 'right', 'rear']
        this.curr = 0
        this.currentSide = this.displaySides[this.curr]

        // Events
        this.leftBtn.addEventListener('click', () => this.rotateLeft())
        this.rightBtn.addEventListener('click', () => this.rotateRight())
    }

    // Rotate Left
    rotateLeft() {
        this.curr = (this.curr + 1) % this.displaySides.length
        this.currentSide = this.displaySides[this.curr]

        this.update()
    }
    
    // Rotate Right
    rotateRight() {
        this.curr = (this.curr - 1 + this.displaySides.length) % this.displaySides.length;
        this.currentSide = this.displaySides[this.curr]

        this.update()
    }

    // Attach Component
    attachComponent(componentSelected, slot) {
        slot.component = componentSelected
        slot.component.isAttached = true
        slot.component.box = slot.box
        
        // remove selected component from shelf
        const i = this.shelf.findIndex(spot => spot.component && 
            spot.component.id === componentSelected.id)
        this.shelf[i].component = null

        // update display area information
        this.update()
    }


    // Swap Components
    swapComponents(componentSelected) {
        const tempComponent = this.table.component
        const index = this.shelf.findIndex(spot => spot.component && 
            spot.component.id === componentSelected.id)

        // swap
        this.table.component = componentSelected
        this.shelf[index].component = tempComponent

        // removed any attached cables

        // update display area information
        this.update()
    }

    // Create Bounding Box
    createBox(component, display, givenSide) {
        // get access to the components default side
        let componentSide = this.utilityTool.getSide(component, givenSide)
        let scale = this.utilityTool.determineScale(componentSide.height, display.area.height - 20)
        display.scale = scale

        // Offset to adjust the image drawing to center
        let toCenter = {
            x: display.area.x + (display.area.width / 2),
            y: display.area.y + (display.area.height / 2) 
        }
        
        // creation of box with added
        component.box = {
            x: toCenter.x - ((componentSide.width * scale) / 2),
            y: toCenter.y - ((componentSide.height * scale) / 2),
            width: componentSide.width * scale,
            height: componentSide.height * scale 
        }
    }

    // Update Stylesheet Depending if The Component is Rotatable or Not
    updateRotatableStyles(rotatable) {
        if(rotatable) {
            this.rightBtn.style.visibility = 'visible'
            this.leftBtn.style.visibility = 'visible'
            this.panelIndicator.style.visibility = 'visible'
            this.panelIndicator.innerHTML = this.currentSide + ' side'
        } else {
            this.rightBtn.style.visibility = 'hidden'
            this.leftBtn.style.visibility = 'hidden'
            this.panelIndicator.style.visibility = 'hidden'
        }
    }

    // Update Labels
    updateComponentLabels(component) {
        this.compLabel.innerHTML = component.type.toUpperCase()
        this.compName.innerHTML = component.name
    }

    // Update Slot Box
    updateSlotBox(baseComponent, slot) {    
        /*
        /
        /
        /       CHANGE YOU SLOT CREATION LOGIC SOMEBODY PLEASE HELP
        /
        /
        */
        const side = slot.sides[this.currentSide]

        if(!side) {
            slot.box = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
            return
        }

        if(baseComponent.isAttached) {

            // get the original dimensions of the base component
            const imageSide = this.utilityTool.getSide(baseComponent, this.currentSide)

            
            // find the scale by getting the change happened in the component's width and height
            const scale = {
                width: baseComponent.box.width / imageSide.width,
                height: baseComponent.box.height / imageSide.height,
            }
          
            const offset = side.offsets['default']

            slot.box = {
                x: baseComponent.box.x + (offset.x * scale.width),
                y: baseComponent.box.y + (offset.y * scale.height),
                width: offset.width * scale.width,
                height: offset.height * scale.width,
            }
        } else {
            const base = baseComponent.box
            const offset = side.offsets['default']

            slot.box = {
                x: base.x + offset.x,
                y: base.y + offset.y,
                width: offset.width,
                height: offset.height
            }
        }

        if(slot.component) {
            slot.component.slots.forEach(childSlot => {
                this.updateSlotBox(slot.component, childSlot)
            })
        }
    }

    updateAttachedComponentBox(baseComponent, slot) {
        // only update when a side for slot is available
        const side = slot.sides[this.currentSide]
        if(!side) {
            slot.component.box = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }
            return
        }

        /*
        *   Might Change and have a better connection logic  
        */

        if(baseComponent.isAttached) {

            // get the original dimensions of the base component
            const imageSide = this.utilityTool.getSide(baseComponent, this.currentSide)

            
            // find the scale by getting the change happened in the component's width and height
            const scale = {
                width: baseComponent.box.width / imageSide.width,
                height: baseComponent.box.height / imageSide.height,
            }
          
            const offset = side.offsets['default']

            slot.component.box = {
                x: baseComponent.box.x + (offset.x * scale.width),
                y: baseComponent.box.y + (offset.y * scale.height),
                width: offset.width * scale.width,
                height: offset.height * scale.width,
            }
        } else {
            const offset = side.offsets['default']

            const base = baseComponent.box

            slot.component.box = {
                x: base.x + offset.x,
                y: base.y + offset.y,
                width: offset.width,
                height: offset.height
            }
        }

        // do the same for components attached to this attached component (if there are)
        slot.component.slots.forEach(childSlot => {
            if(childSlot.component) {
                this.updateAttachedComponentBox(slot.component, childSlot)
            }
        })
    }

    // Main Dispay Area Update Method 
    update() {
        if(this.table.component) {
            const tableComponent = this.table.component
            // create bounding box for table component adjusted to the current side
            this.createBox(tableComponent, this.table, this.currentSide)

            // update labels and rotate buttons visibility
            this.updateRotatableStyles(tableComponent.isRotatable)
            this.updateComponentLabels(tableComponent)

            //update table component slot information
            tableComponent.slots.forEach(slot => {
                // update component boxes attached to slots
                if(slot.component) {
                    this.updateAttachedComponentBox(tableComponent, slot)
                }

                // update slot boxes
                this.updateSlotBox(tableComponent, slot)
            })
        }

        // create bounding boxes for components inside shelf
        this.shelf.forEach(spot => {
            const shelfComponent = spot.component

            if(shelfComponent) {
                this.createBox(shelfComponent, spot, shelfComponent.defaultSource)
            }
        })

        // update WIRES TAB
        this.portsTab.update(this.table, this.shelf)
    }
}

export default DisplayArea