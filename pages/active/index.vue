<template>
    <section class="container">
        <div class="content_dashboard">
            <div class="header_dashboard">
                <div class="price">
                    <h2>Active</h2>
                </div>
                <div class="price">
                    <h1>$ {{main_info.price}}</h1>
                </div>
                <div class="percent plus">
                    <span>{{main_info.percent}}% <v-icon>mdi-menu-up</v-icon></span>
                </div>
            </div>
            <div class="body_dashboard">
                <v-card class="dayCheck">
                    <button :class="activeData[0] ? 'active' : ''" @click="setActiveData(0)">
                        24H
                    </button>
                    <button :class="activeData[1] ? 'active' : ''" @click="setActiveData(1)">
                        7D
                    </button>
                    <button :class="activeData[2] ? 'active' : ''" @click="setActiveData(2)">
                        14D
                    </button>
                    <button :class="activeData[3] ? 'active' : ''" @click="setActiveData(3)">
                        30D
                    </button>
                    <button :class="activeData[4] ? 'active' : ''" @click="setActiveData(4)">
                        90D
                    </button>
                    <button :class="activeData[5] ? 'active' : ''" @click="setActiveData(5)">
                        1Y
                    </button>
                    <button :class="activeData[6] ? 'active' : ''" @click="setActiveData(6)">
                        MAX
                    </button>
                </v-card>
                <v-card>
                    <div class="small" >
                        <line-chart :chart-data="datacollection" :options="optons" style="position: relative; height:35vh; width:96vw"></line-chart>
                    </div>
                </v-card>
                <v-card class="tableActive">
                    <v-data-table
                        :headers="table.headers"
                        :items="table.values"
                        :items-per-page="5"
                        class="elevation-1 overflow-y-auto"
                        :mobile-breakpoint="0"
                        fixed-header
                        height="26vh"
                    ></v-data-table>
                </v-card>
                    <!--<v-tab-item
                        v-for="i in tabs"
                        :key="i"
                        :value="'tab-' + i"
                    >
                        <v-card
                            flat
                            tile
                        >
                            <v-card-text>{{ text }}</v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>-->
            </div>
        </div>
    </section>
</template>

<script>
    import LineChart from '@/components/Chart.vue'

    export default {
        name: "dashboard",
        components: {
            LineChart
        },
        data: () => {
            return {
                main_info: {
                    price: '1.15',
                    percent: '40.9'
                },
                tab: null,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                icons: false,
                centered: true,
                grow: false,
                vertical: false,
                prevIcon: false,
                nextIcon: false,
                right: false,
                tabs: 2,
                datacollection: null,
                optons: null,
                activeData: [true, false, false, false, false, false, false],
                table: {
                    headers: [
                        {
                            text: 'EXCH',
                            align: 'start',
                            value: 'exch',
                        },
                        { text: 'PAIR', value: 'pair' },
                        { text: 'PRICE', value: 'price' },
                        { text: '24H VOLUME', value: 'volume' },
                        { text: 'TRUST', value: 'trust' }
                    ],
                    values: [
                        {
                            exch: 'Balancer',
                            pair: '0X85... ETH',
                            price: '$ 1.12',
                            volume: '$597,114',
                            trust: 'yes'
                        }, {
                            exch: 'Uniswap (v2)',
                            pair: '0X85... ETH',
                            price: '$ 1.12',
                            volume: '$1,475,189',
                            trust: 'yes'
                        }, {
                            exch: 'MXC',
                            pair: 'KEEP USDT',
                            price: '$ 1.20',
                            volume: '$698,381',
                            trust: 'yes'
                        }, {
                            exch: 'Horbit',
                            pair: 'KEEP USDT',
                            price: '$ 1.30',
                            volume: '$16,920.00',
                            trust: 'yes'
                        }, {
                            exch: 'Horbit-test',
                            pair: 'KEEP USDT',
                            price: '$ 1.40',
                            volume: '$187,920',
                            trust: 'no'
                        },
                    ],
                }

            }
        },
        mounted () {
            this.fillData()
        },
        methods: {
            fillData () {
                this.datacollection = {

                    labels: ['18:00', "", '21:00', "", '9.Sep', "", '03:00', "", '06:00', "", '09:00', "", '12:00', "", '15:00', ""],
                    datasets: [
                        {
                            //backgroundColor: '#8cc540',
                            borderColor: '#8cc540',
                            borderWidth: 1,
                            data: [0.99, 1.03, 1.00, 1.10, 1.22, 1.05, 1.22, 1.12, 1.23, 1.33, 1.30, 1.30, 1.32, 1.35, 1.22, 1.34, 1.37, 1.33]
                        }
                    ]
                }
                this.optons = {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        mode: 'point'
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:false,
                                autoSkip: true,
                                maxTicksLimit: 7,
                                callback: function(value, index, values) {
                                    return '$' + value;
                                },
                                scaleLabel: {
                                    display: false
                                }
                            }
                        }],
                        xAxes:[{
                            scaleLabel: {
                                display: false
                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, 0)",
                            }
                        }]
                    },
                    legend: {
                        display: false,
                        labels: {
                            display: false,
                            boxWidth: 1
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    },
                    plugins: {
                        datalabels: {
                            display: false,
                        },
                    },
                    plugins: {
                        zoom: {
                            // Container for pan options
                            // Container for zoom options
                            zoom: {
                                // Boolean to enable zooming
                                enabled: true,

                                // Enable drag-to-zoom behavior
                                drag: true,

                                // Drag-to-zoom effect can be customized
                                // drag: {
                                // 	 borderColor: 'rgba(225,225,225,0.3)'
                                // 	 borderWidth: 5,
                                // 	 backgroundColor: 'rgb(225,225,225)',
                                // 	 animationDuration: 0
                                // },

                                // Zooming directions. Remove the appropriate direction to disable
                                // Eg. 'y' would only allow zooming in the y direction
                                // A function that is called as the user is zooming and returns the
                                // available directions can also be used:
                                //   mode: function({ chart }) {
                                //     return 'xy';
                                //   },
                                mode: 'x',

                                rangeMin: {
                                    // Format of min zoom range depends on scale type
                                    x: 1,
                                    y: 1
                                },
                                rangeMax: {
                                    // Format of max zoom range depends on scale type
                                    x: 2,
                                    y: 2
                                },

                                // Speed of zoom via mouse wheel
                                // (percentage of zoom on a wheel event)
                                speed: 0.01,

                                // Minimal zoom distance required before actually applying zoom
                                threshold: 1,

                                // On category scale, minimal zoom level before actually applying zoom
                                sensitivity: 1,

                                // Function called while the user is zooming
                                onZoom: function({chart}) { console.log(`I'm zooming!!!`); },
                                // Function called once zooming is completed
                                onZoomComplete: function({chart}) { console.log(`I was zoomed!!!`); }
                            }
                        }
                    }
                }
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            },
            setActiveData(number){
                this.activeData = [false, false, false, false, false, false, false]
                this.activeData[number] = true
            }
        }
    }
</script>

<style scoped>
    .banner_dashboard{
        display: flex;
        width: 100%;
        overflow: hidden;
        float: none;
        justify-content: center;
    }
    .body_dashboard{
        padding: 2%;
    }
    .content_dashboard{
        display: block;
        width: 100%;
        max-height: 90vh;
    }
    .banner_dashboard>img{
        display: flex;
        max-width: 100%;
        max-height: 32vh;
        width: auto;
        height: auto;
    }
    .header_dashboard{
        display: block;
        width: 100%;
        text-align: center;
        padding: 1%;
    }
    .percent.plus span, .percent.plus span i{
        color: #8cc540 !important;
    }
    .percent span{
        display: flex;
        align-self: center;
        width: 60px;
        margin: auto;
        align-items: center;
        justify-content: space-around;
    }
    .percent span i{
        width: 10px;
        height: 10px;
        font-size: 32px;
        margin-top: -6px;
        margin-left: 4px;
    }
    .v-card{
        background-color: #eeeeee !important;
    }
    .v-application .elevation-2{
        box-shadow: none !important;
    }
    .v-tab--active, .v-tab--active:focus, .v-tab--active:before, .v-tab--active:after{
        background-color: #eeeeee !important;
    }
    .v-tab{
        text-transform: none !important;
        font-weight: normal !important;
        font-size: 16px !important;
    }
    .v-slide-group__content{
        height: 30px !important;
    }
    .small {
        max-width: 100%;
        max-height: 35vh;
    }
    .dayCheck{
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 2vh;
    }
    .dayCheck>button{
        display: block;
        width: 15%;
        text-align: center;
        height: 50px;
        border: 1px solid rgba(128,128,128,0.12941);
        border-radius: 0px;
        font-size: 13px;
        font-weight: 600;
    }
    .dayCheck>button.active{
        background-color: #8ACB32;
    }
    .dayCheck>button.active:focus{
        border: none !important;
    }
    .tableActive{
        height: 32vh;
        width: 100vw;
    }
    .price>h1{
        font-size: 35px;
    }
</style>
