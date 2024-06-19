import Component from "./component.js"

const components = [
    new Component ({        // CASE
        name: 'NZXT H5 Flow',
        type: 'chassis',
        size: 'mid-tower',
        dimensions: {
            depth: 446,
            width: 227,
            height: 464,
        },
        isRotatable: true,
        isAttached: false,
        defaultSource: 'left',
        images: [
            {side: 'left', imageSrc: './assets/chassis/NZXT-H5-Flow-left.png'}, 
            {side: 'front', imageSrc: './assets/chassis/NZXT-H5-Flow-front.png'}, 
            {side: 'right', imageSrc: './assets/chassis/NZXT-H5-Flow-right.png'}, 
            {side: 'rear', imageSrc: './assets/chassis/NZXT-H5-Flow-rear.png'}, 
        ],
        slots: [
            {
                type: 'motherboard', 
                supports: ['ATX', 'microATX', 'miniATX'],
                component: null,
                sides: {
                    left: {
                        offsets: {
                            default: {x: 50, y: 61, width:204, height: 265},
                            ATX: {x: 50, y: 61, width:204, height: 265},
                            microATX: {x: 50, y: 63, width:204, height: 204},
                            miniATX: {x: 50, y: 63, width:150, height: 150}
                        },
                        accessible: true // if able to attach to this side
                    },
                    rear: {
                        offsets: {
                            default: {x: 38, y: 35, width: 44, height: 165} 
                        },
                        accessible: false 
                    }
                }
            },
            {
                type: 'psu',
                supports: ['ATX', 'microATX', 'miniATX'],
                component: null,
                sides: {
                    rear: {
                        offsets: {
                            default: {x: 42, y: 363, width: 140, height: 86}
                        },
                        accessible: true
                    },
                    right: {
                        offsets: {
                            default: {x: 253, y: 345, width: 180, height: 86}
                        },
                        accessible: true
                    }
                    
                }
            }
        ],
        ports: [],
        cables: []
    }),
    new Component ({        // MOBO
        name: 'MSI MPG Z790 Carbon Max WiFi',
        type: 'motherboard',
        size: 'ATX',
        dimensions: {
            depth: 244,
            width: 244,
            height: 305
        },
        isRotatable: false,
        isAttached: false,
        defaultSource: 'left',
        images: [
            {side: 'left', imageSrc: './assets/motherboard/msi-mobo.png'}, 
            {side: 'rear', imageSrc: './assets/motherboard/msi-IO.png'} 
        ],
        slots: [
            {
                type: 'cpu', 
                supports: ['LGA 1700'],
                component: null,
                sides: {
                    left: {
                        offsets: {
                            default: {x: 113, y: 73, width: 45, height: 45},
                        },
                        accessible: true // if able to attach to this side
                    }
                }
            },
            {
                type: 'gpu', 
                supports: ['pcie4'],
                component: null,
                sides: {
                    left: {
                        offsets: {
                            default: {x: 10, y: 173, width: 150, height: 50},
                        },
                        accessible: true // if able to attach to this side
                    }
                }
            }
        ],
        ports: [
            {
                type: '24-pin-power'
            },
            {
                type: '8-pin-power'
            }
        ],
        cables: []
    }),
    new Component ({        // CPU
        name: 'Intel Core i7-13700K',
        type: 'cpu',
        size: 'LGA 1700',
        dimensions: {
            depth: 125,
            width: 125,
            height: 125,
        },
        isRotatable: false,
        isAttached: false,
        defaultSource: 'left',
        images: [
            {side: 'left', imageSrc: './assets/cpu/Intel Core i7-13700K.png'},  
        ],
        slots: [],
        ports: []
    }),
    new Component ({        // PSU
        name: 'EVGA Supernova 1300 P+, 80+ Platinum 1300W',
        type: 'psu',
        size: 'ATX',
        dimensions: {
            depth: 200,
            width: 150,
            height: 86,
        },
        isRotatable: true,
        isAttached: false,
        defaultSource: 'left',
        images: [
            {side: 'left', imageSrc: './assets/psu/EVGA SuperNOVA 1300 P+ - left.png'}, 
            {side: 'front', imageSrc: './assets/psu/EVGA SuperNOVA 1300 P+ - front.png'}, 
            {side: 'right', imageSrc: './assets/psu/EVGA SuperNOVA 1300 P+ - right.png'}, 
            {side: 'rear', imageSrc: './assets/psu/EVGA SuperNOVA 1300 P+ - rear.png'}
        ],
        slots: [],
        ports: [
            {
                type: '24-pin-power',
            },
            {
                type: '8-pin-power'
            },
            {
                type: '8-pin-power'
            },
            
        ],
        cables: [
            {
                type: '24-pin-power'
            },
            {
                type: '8-pin-power'
            },
            {
                type: '8-pin-power'
            }
        ]
    })
]

components.forEach(component => {
    Component.handleComponent(component)
})

export default components