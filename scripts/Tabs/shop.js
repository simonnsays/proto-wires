import components from "../Data/data.js"

class Shop{
    constructor(elementHandler, utilityTool, inventory) {
        // Utility
        this.utilityTool = utilityTool
        this.elements = elementHandler.getShopElements()
        if(!this.elements) throw new Error('Missing Shop Elements')

        // Elements
        this.openBtn = this.elements.openBtn
        this.closeBtn = this.elements.closeBtn
        this.modal = this.elements.modal
        this.itemsContainer = this.elements.itemsContainer
        this.drawer =''

        // Items
        this.items =  []

        // Inventory (class module)
        this.inventory = inventory

        // Events
        this.openBtn.addEventListener('click', () => this.openTab(this.modal))
        this.closeBtn.addEventListener('click', () => this.closeTab(this.modal))
        window.addEventListener('mousedown', (e) => this.handleOutofBounds(e, this.modal))

        this.isActive = false
    }

    // Open Shop Tab
    openTab(modal) {
        modal.showModal()
        modal.isOpen = true
        this.isActive = true
    }

    // Close Shop Tab
    closeTab(modal) {
        modal.close()
        modal.isOpen = false
        this.isActive = false
    }

    // Handle Mouse Point Out of Shop Tab Bounds
    handleOutofBounds(e, modal) {
        const rawMouse = {x: e.clientX, y: e.clientY}
        const rect = modal.getBoundingClientRect()

        if(!this.utilityTool.isInsideBox(rawMouse, rect) && modal.isOpen) {
            
            this.closeTab(modal)
        }
    }

    // Fill Shop Items from Data Imported from data.js
    fillShopItems(items, carrier) {
        items.forEach(item => {
            carrier.push(item)
        })
    }

    // Create Interactive Elements to Show in Shop Tab
    createItemElements(items, container) {
        items.forEach(item => {
            const imageSource = item.images.find(image => image.side == item.defaultSource).imageSrc
            const element = this.utilityTool.makeItemElement(item, imageSource) 

            // associate item with the html element 
            element.component = item

            container.appendChild(element)
        })
    }

    // Buy Component
    buyComponent(component) {
        // create clone of the component
        const componentClone = JSON.parse(JSON.stringify(component))

        // render component images
        this.utilityTool.createImages(componentClone.images)

        // create unique ID 
        this.utilityTool.createID(componentClone)
        this.inventory.items.push(componentClone)
    }

    // Main Shop Initialization Method
    init() {
        // Fill Shop Items
        this.fillShopItems(components, this.items)

        // Create Element For Each Item
        this.createItemElements(this.items, this.itemsContainer)
         
        // Purchase event
        Array.from(this.itemsContainer.children).forEach(child => {
            child.addEventListener('click', () => {
                // buy component
                this.buyComponent(child.component)
                
                // update inventory container
                this.inventory.update()
            })
        })
    }

}

export default Shop