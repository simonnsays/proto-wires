class UtilityTool {
    constructor() {
        this.idCount = 1
    }
    // Check for The Relation of Point And Plane
    isInsideBox(point, box) {
        return point.x > box.x &&
            point.x < box.x + box.width &&
            point.y > box.y &&
            point.y < box.y + box.height
    }    

    // Creation of HTML Elements for Items
    makeItemElement(item, imageSource){
        // create the div
        const element = document.createElement('div')
        element.classList = 'content'
        element.id = item.name

        // create image for the div
        const image = new Image()
        image.src = imageSource
        image.style.width = '150px'
        image.style.height = 'auto'
        image.alt = item.name
        element.appendChild(image)

        // create slider div for the label
        const slider = document.createElement('div')
        slider.classList = 'slider'
        slider.textContent = item.name + ' (' + item.type + ')'
        element.appendChild(slider)
        return element  
    }

    // Create of Unique ID
    createID(component) {
        // prefixes to separate component types
        const types = {
            chassis: 'ch',
            motherboard: 'mo',
            cpu: 'cp',
            gpu: 'gp',
            psu: 'ps'
        }

        // check if valid component type 
        if (!types.hasOwnProperty(component.type)) {
            throw new Error('Not Supported Component, Failed to Create an ID')
        }

        const count = this.idCount.toString()
        const typePrefix = types[component.type]
        let id = null

        // concatenate to create ID
        switch(count.length) {
            case 1:
                id  = typePrefix + ('0' + '0' + count)
                break
            case 2:
                id  = typePrefix + ('0' + count)
                break
            default:
                id  = typePrefix + count
                break
        }
        
        component.id = id

        // change id count number
        this.idCount++
    }

    // Determine Scaling Factor Based on Display Area Height
    determineScale(componentHeight, baseHeight) {
        // start with 1 as scale and lower if it still doesnt fit
        let scale = 1
        while (componentHeight * scale > baseHeight && scale > 0 ) {
            scale -= .1
        }
    
        return scale
    }

    // Get Image Side
    getSide(component, side) {
        // images associated with a side also has their width and height declared
        return component.images.find(element => element.side == side) || null
    }

    // Create Image Rendering
    createImages(imageArr) {
        imageArr.forEach(imageSide => {
            imageSide.image = new Image()
            imageSide.image.src = imageSide.imageSrc
        }) 
    }
}

export default UtilityTool