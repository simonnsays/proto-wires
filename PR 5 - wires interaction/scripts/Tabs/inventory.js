import portRef from "../Data/portReference.js"
import cableRef from "../Data/cableReference.js"

class Inventory {
    constructor(elementHandler, utilityTool, displayArea) {
        // Utility
        this.utilityTool = utilityTool
        this.elements = elementHandler.getInventoryElements()
        if(!this.elements) throw new Error('Missing Inventory Elements')

        // Display Area
        this.displayArea = displayArea

        // Elements
        this.openBtn = this.elements.openBtn
        this.closeBtn = this.elements.closeBtn
        this.modal = this.elements.modal
        this.itemsContainer = this.elements.itemsContainer
        this.isActive = false

        // Items
        this.items = []

        // Events
        this.openBtn.addEventListener('click', () => this.openTab(this.modal))
        this.closeBtn.addEventListener('click', () => this.closeTab(this.modal))
        window.addEventListener('mousedown', (e) => this.handleOutofBounds(e, this.modal))
    }

    openTab(modal) {
        modal.showModal()
        modal.isOpen = true

        // for canvas monitoring 
        this.isActive = true
    }

    closeTab(modal) {
        modal.close()
        modal.isOpen = false

        // for canvas monitoring 
        this.isActive = false
    }

    // Handle User Click Out of Bounds
    handleOutofBounds(e, modal) {
        const rawMouse = {x: e.clientX, y: e.clientY}
        const rect = modal.getBoundingClientRect()

        if(!this.utilityTool.isInsideBox(rawMouse, rect) && modal.isOpen) {
            
            this.closeTab(modal)
        }
    }

    // Create HTML Element for Each Item in Inventory
    createItemElements(items, container) {
        items.forEach(item => {
            const imageSource = item.images.find(image => image.side == item.defaultSource).imageSrc
            const element = this.utilityTool.makeItemElement(item, imageSource) 

            // associate item with the html element 
            element.component = item

            container.appendChild(element)
        })
    }

    // Add Component to Shelf
    addToShelf(newComponent, shelf) {
        let added = false 
        for(let i = 0; i < shelf.length; i++) {
            const element = shelf[i]
    
            // if the component property is null, add the new component
            if(element.component === null) {
                element.component = newComponent
                added = true
                break;
            }
        }
    
        // if all component properties are occupied, shift components to the next object
        if(!added) {
            const lastElement = shelf[shelf.length - 1]
            const removedComponent = lastElement.component
    
            for(let i = shelf.length - 1; i > 0; i--) {
                const prevElement = shelf[i - 1]
                shelf[i].component = prevElement.component
            }
    
            // Add the new component to the first object
            shelf[0].component = newComponent

            // Return removed item to inventory
            this.items.push(removedComponent)
        }
    }

    // Create Port Attributes
    createPortAttr(port, ref) {
        // create a copy of the reference to avoid ports pointing on the same attributes
        const refClone = JSON.parse(JSON.stringify(ref))

        // find the reference for the specific port type
        const currentRef = refClone.find(refPort => refPort.type === port.type)

        /*
        *   Separate handling for cpu
        */
        if(port.type === '8-pin-power') {
            port.image = currentRef.image
            port.offset = currentRef.offset
            return
        }

        // copy reference attributes to the copy of the port
        port.image = currentRef.image
        port.offset = currentRef.offset

        // additional attributes
        port.cableAttached = null
    }

    // Create Cable Attributes
    createCableAttr(cable, ref) {
        // create a copy of the reference to avoid cables pointing on the same attributes
        const refClone = JSON.parse(JSON.stringify(ref))

        // find the reference for the specific port type
        const currentRef = refClone.find(refcable => refcable.type === cable.type)

        // copy ref attributes to the copy of the cable
        cable.ends = currentRef.ends
        cable.images = currentRef.images
        // cable.scale = currentRef.scale

    }

    // Placing of Components to Display Area
    placeComponent(component) {
        const table = this.displayArea.table
        const shelf = this.displayArea.shelf
        const componentType = component.type
        
        const currentPortRef = portRef[componentType]
        const currentCableRef = cableRef[componentType]

        // create(fill) port attributes
        component.ports.forEach(port => {
            this.createPortAttr(port, currentPortRef)
        })

        // create(fill) cable attributes
        component.cables.forEach(cable => {
            this.createCableAttr(cable, currentCableRef)
        })
    
        // add to Table
        if(!table.component) {
            this.displayArea.table.component = component
            return
        }

        // add to Shelf
        this.addToShelf(component, shelf)
    }

    // Main Inventory Update Method
    update() {
        // clear Item Elements
        while (this.itemsContainer.firstChild) {
            this.itemsContainer.removeChild(this.itemsContainer.firstChild);
        }

        // recreate Item Elements
        this.createItemElements(this.items, this.itemsContainer)

        // placing event
        let containerChildren = Array.from(this.itemsContainer.children) 

        containerChildren.forEach((child, index) => {
            child.addEventListener('click', () => {
                // remove component from inventory
                const removedComponent = this.items.splice(index, 1)

                // place removed component to display area
                this.placeComponent(removedComponent[0])
                // console.log(removedComponent)

                // update display area information
                this.displayArea.update()
                
                // update inventory information
                this.update()
            })
        })
    }
}

export default Inventory