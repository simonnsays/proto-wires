    const portRef = {
        motherboard: [
            {       // 24 pin Power
                type: '24-pin-power',
                image: {
                    // port image will be used in the div with the class of 'port('.port')'
                    imageSrc: './assets/motherboard/ports/mobo-24pin-power.png',
                },
                
                // will be used in highlights
                offset: {
                    top: 26, // will also be used in attached cable offset
                    left: 145,
                    width: 34, // used in highlight sizes
                    height: 180
                },
                cableAttached: null
            },
            {
                name: 'CPU EPS Connector',
                type: '8-pin-power',
                image: {
                    imageSrc: './assets/motherboard/ports/mobo_port-cpu.png',
                },
                offset: {  // for ports that share the same image
                    first: {
                        top: 87, 
                        left: 43,
                        width: 100, 
                        height: 58,
                        
                        cableAttached: null
                    },
                    
                    second: {
                        top: 87, 
                        left: 143,
                        width: 100, 
                        height: 58,
    
                        cableAttached: null
                    }
                }    
            }
        ],
        psu: [
            {
                type: '24-pin-power',
                image: {
                    imageSrc: './assets/psu/ports/psu-port-10+18.png',
                },
                
                offset: {
                    top: 84,
                    left: 23,
                    width: 235,
                    height: 58
                },
                cableAttached: null
            },
            {
                type: '8-pin-power',
                image: {
                    imageSrc: './assets/psu/ports/psu_port-power.png',
                },
                
                offset: {
                    top: 77,
                    left: 69,
                    width: 147,
                    height: 116
                },
                cableAttached: null
            }
        ]
    }



    export default portRef