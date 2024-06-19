const cableRef = {
    psu: [
        {       // 24-pin-power
            name: 'ATX power',
            type: '24-pin-power',
            ends: {
                motherboard: {
                    connected: false

                },
                psu: {
                    connected: false
                }
            },
            images: [
                {
                    attachedTo: 'motherboard', 
                    imageSrc: './assets/wires/24pin-attached(mobo).png',
                    scale: {width: 1, height: 1.47}, // will be used in matching cable to port
                    offset: {top: 26, left: 145}
                },
                {
                    attachedTo: 'psu', 
                    imageSrc: './assets/wires/(10+18)24pin-attached(psu).png',
                    scale: {width: .45, height: .45}, // will be used in matching cable to port 
                    offset: {top: 84, left: 23}
                },
                {
                    attachedTo: 'none', 
                    imageSrc: './assets/wires/24pin-power-default.png' 
                },
            ],
        },
        {       // 8-pin-power
            name: 'CPU Power',
            type: '8-pin-power',
            ends: {
                motherboard: {
                    connected: false

                },
                psu: {
                    connected: false
                }
            },
            images: [
                {
                    attachedTo: 'motherboard', 
                    imageSrc: './assets/wires/8pin-attached(mobo).png',
                    scale: {width: .92, height: .9}, // will be used in matching cable to port
                    offset: {       // for cable components that share ports on the same image 
                        first: {top: -25, left: 12},
                        second: {top: -25, left: 112}
                    }
                },
                {
                    attachedTo: 'psu', 
                    imageSrc: './assets/wires/8pin-attached(mobo).png',
                    scale: {width: 1.27, height: 1.1}, // will be used in matching cable to port 
                    offset: {top: -13, left: 30}
                },
                {
                    attachedTo: 'none', 
                    imageSrc: './assets/wires/8pin-power-default.png' 
                },
            ],
        }
    ]
}

export default cableRef