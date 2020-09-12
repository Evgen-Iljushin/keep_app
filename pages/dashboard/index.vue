<template>
    <section class="container">
        <div class="content_dashboard">
            <div class="banner_dashboard">
                <img src="/img/banner_dashboard.png">
            </div>
            <div class="header_dashboard">
                <div class="price">
                    <h1>$ {{main_info.price}}</h1>
                </div>
                <div class="percent plus">
                    <span>{{main_info.percent}}% <v-icon>mdi-menu-up</v-icon></span>
                </div>
            </div>
            <div class="body_dashboard">
                <v-tabs
                    v-model="tab"
                    background-color="#eeeeee"
                    color="black"
                    class="elevation-2"
                    :centered="centered"
                    :prev-icon="prevIcon ? 'mdi-arrow-left-bold-box-outline' : undefined"
                    :next-icon="nextIcon ? 'mdi-arrow-right-bold-box-outline' : undefined"
                    :icons-and-text="icons"
                >
                    <v-tabs-slider></v-tabs-slider>

                    <v-tab
                        v-for="i in tabs"
                        :key="i"
                        :href="`#tab-${i}`"
                        background-color="#eeeeee"
                    >
                        {{ $t('dashboard.body.tabs.tab'+ i +'_name') }}
                        <v-icon v-if="icons">mdi-phone</v-icon>
                    </v-tab>
                    <v-tab-item :key="1" :value="'tab-1'">
                        <v-card>
                            <div class="small">
                                <line-chart :chart-data="datacollection"></line-chart>
                            </div>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item :key="2" :value="'tab-2'">

                    </v-tab-item>
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
                    </v-tab-item>-->
                </v-tabs>
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
                datacollection: null

            }
        },
        mounted () {
            this.fillData()
        },
        methods: {
            fillData () {
                this.datacollection = {
                    labels: ['18:00', '21:00', '9.Sep', 'Апрель', '03:00', '06:00', '09:00', '12:00', '15:00'],
                    datasets: [
                        {
                            backgroundColor: '#8cc540',
                            data: [0.800000, 0.900000, 1.00, 1.10, 1.20]
                        }
                    ]
                }, {responsive: true, maintainAspectRatio: true}
            },
            getRandomInt () {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
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
        max-height: 30vh;
    }
</style>
