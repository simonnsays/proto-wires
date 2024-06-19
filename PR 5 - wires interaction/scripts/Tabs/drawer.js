import cableRef from "../Data/cableReference.js";

class Drawer {
    constructor(elementHandler, utilityool) {
        // Utility
        this.elementHandler = elementHandler
        this.elements = this.elementHandler.getDrawerElements()
        if(!this.elements) throw new Error('Missing Drawer Elements');
       
        // Elements
        this.modal = this.elements.modal
        this.pullBtn = this.elements.pullBtn
        this.cableContainer = this.elements.cableContainer
        this.isActive = false

        this.cables = []
        this.cableSelected = null

        // Events
        this.pullBtn.addEventListener('click', () => this.toggleDrawer())
    }

    // Open Drawer
    openDrawer(image) {
        // pull up drawer
        this.modal.classList.remove('return')
        this.modal.classList.add('pull')

        image.style.transform = 'rotate(180deg)'

        // toggle state
        this.isActive = true
    }

    // Close Drawer
    closeDrawer(image) {
        // return drawer
        this.modal.classList.remove('pull')
        this.modal.classList.add('return')  

        image.style.transform = 'rotate(0)'

        // toggle state
        this.isActive = false
    }

    // Toggle Drawer State
    toggleDrawer() {
        // get the arrow image to manipulate
        const image = this.pullBtn.querySelector('img')

        // toggle
        if(this.isActive) {
            this.closeDrawer(image)
        } else {
            this.openDrawer(image)
        }
    }

    // Remind User to Pull Drawer Down
    remindUser() {
        const image = document.querySelector('#pulleyImage')
        // wiggle pulley button a couple times
        setTimeout(() => {
            this.pullBtn.classList.add('remind')
        }, 200)
        this.pullBtn.classList.remove('remind')
    }

    // Clear Selected Cable
    clearSelectedCable() {
        if(this.cableSelected) {
            this.cableSelected.div.classList.remove('active')
            this.cableSelected = null
        }
    }

    // Select Cable
    selectCable(cable) {
        this.cableSelected = cable
        cable.div.classList.add('active')
    }

    // Create Cable Attributes
    createCableAttr(cable, ref) {
        // create clone of the port
        const clone = {...cable}

        // find the reference for the specific port type
        const currentRef = ref.find(refcable => refcable.type === cable.type)

        // copy ref attributes to the copy of the cable
        clone.images = currentRef.images
        clone.scale = currentRef.scale

        return clone
    }

    // Get Cable Information
    getCables(component) {
        // const ref = cableRef[component.type] // reference for cables (see imports) 

        // fill drawer
        component.cables.forEach(cable => {
            // const cableCopy = this.createCableAttr(cable, ref)

            this.cables.push(cable)
        })

        // do the same for attached components (recursive)
        component.slots.forEach(slot => {
            if(slot.component) {
                this.getCables(slot.component)
            }
        })
    }

    adjustCableStateStyle(cable, cell) {
        let endsConnected = 0

        for(let end in cable.ends) {
            if(cable.ends[end].connected) endsConnected++
        }

        switch(endsConnected) {
            case 1:
                cell.classList.add('semi-used')
                break
            case 2:
                cell.classList.add('used')
                break
            default:
                cell.classList.add('unused')
        }
    }

    // Create Cable Cells
    createCableCells() {
        // iterate through this.cables
        this.cables.forEach(cable => {
            // create cells 
            const cableCell = document.createElement('div')
            cableCell.className = 'cableCell'

            // adjust cable background to indicate what state it is in
            this.adjustCableStateStyle(cable, cableCell)

            // create image
            const cableImage = document.createElement('img')
            cableImage.src = cable.images.find(image => image.attachedTo === 'none').imageSrc

            // create slider
            const cableSlider = document.createElement('div')
            cableSlider.className = 'cable-slider'
            cableSlider.innerHTML = cable.type + ' Cable'

            // append elements
            cableCell.appendChild(cableImage)
            cableCell.appendChild(cableSlider)
            this.cableContainer.appendChild(cableCell)

            // create div property
            cable.div = cableCell 
            
            // create bounding box of div for matching
            cable.div.rect = cable.div.getBoundingClientRect()
        })
        
    }

    // Main Update Function
    update(table, shelf) {
        // delete cable cells
        while(this.cableContainer.firstChild) {
            this.cableContainer.removeChild(this.cableContainer.firstChild)
        }
        this.cables = []

        // get cable information from [ TABLE ]
        if(table.component) {
            this.getCables(table.component)
        }

        // get cable information from [ SHELF ]
        shelf.forEach(spot => {
            if(spot.component) {
                this.getCables(spot.component) 
            }
        })

        // create cells
        this.createCableCells()
    }
}

export default Drawer