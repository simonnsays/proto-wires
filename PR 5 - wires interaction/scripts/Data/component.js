class Component {
    constructor({
        name, 
        type, 
        specs, 
        dimensions, 
        isRotatable, 
        isAttached = false, 
        defaultSource, 
        images, slots = [], 
        ports = [],
        cables = []
    }) {

        // Description
        this.name = name
        this.type = type
        this.specs = specs
        this.dimensions = dimensions
        
        // Image
        this.images = images
        this.defaultSource = defaultSource

        // States
        this.isRotatable = isRotatable
        this.isAttached = isAttached

        // Slots
        this.slots = slots

        // Ports
        this.ports = ports

        // Cables
        this.cables = cables
    }

    static handleComponent(component) {
        // Handle Image dimensions
        component.images.forEach(element => { 
            // adjust width and height depending on side
            switch(element.side) {
                case 'left':
                case 'right':
                    element.width = component.dimensions.depth
                    element.height = component.dimensions.height
                    break
                case 'front':
                case 'rear':
                    element.width = component.dimensions.width
                    element.height = component.dimensions.height
                    break
                default:
                    element.width = component.dimensions.width
                    element.height = component.dimensions.height
            }
        })
    }
}

export default Component