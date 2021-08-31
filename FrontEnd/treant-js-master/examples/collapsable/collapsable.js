//use carName cookie to extract the details of that particular car
    var chart_config = {
        chart: {
            container: "#collapsable-example",

            animateOnInit: true,

            node: {
                collapsable: true
            },
            animation: {
                nodeAnimation: "easeOutBounce",
                nodeSpeed: 700,
                connectorsAnimation: "bounce",
                connectorsSpeed: 700
            }
        },
        nodeStructure: {
            image: "img/viperacr.jpg",
            children: [
                {
                   
                    children: [
                        {
                            image: "img/huayrabc.jpg"
                        },
                        {
                            image: "img/oneto1.jpg"
                        }
                    ]
                },
                {
                    children: [
                        {
                            image: "img/lexuslfa.jpg"
                        },
                        {
                            image: "img/ferrarif40.jpg"
                        }
                    ]
                }
            ]
        }
    };
