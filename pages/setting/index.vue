<template>
    <section class="container">
        <div class="content_setting">
            <h1>{{$t('setting.title')}}</h1>
            <div class="settingInputs">
                <div class="settingsRow">
                    <span>{{$t('setting.darkMode')}}</span>
                    <v-switch v-model="darkMode" class="ma-2" color="green" @click="switchDarkMode()" />
                </div>
                <div class="settingsRow">
                    <span>{{$t('setting.notification')}}</span>
                    <v-switch v-model="notification" class="ma-2" color="green" @click="switchNotifications()" />
                </div>
                <div class="settingsRow">
                    <span>{{$t('setting.defaultCurrency')}}</span>
                    <span class="spanValue">
                        <v-select
                            v-model="currentCurrency"
                            :items="currency"
                            @change="switchCurrency()"
                        ></v-select>
                    </span>
                </div>
                <div class="settingsRow">
                    <span>{{$t('setting.language')}}</span>
                    <span class="spanValue">
                        <v-select
                            v-model="currentLang"
                            :items="lang"
                            @change="switchLang()"
                        ></v-select>
                    </span>
                </div>
                <div class="settingsRow">
                    <span>{{$t('setting.defaultStartScreen')}}</span>
                    <span class="spanValue">
                        <v-select
                            v-model="currentScreen[`${$i18n.loadedLanguages[0]}`]"
                            :items="startScreen[`${$i18n.loadedLanguages[0]}`]"
                            @change="switchScreen()"
                        ></v-select>
                    </span>
                </div>
            </div>
            <h1>{{$t('setting.title2')}}</h1>
            <div class="settingInputs">
                <div class="settingsRow">
                    <span><a href="/">{{$t('setting.discordText')}}</a></span>
                    <span class="spanValue"></span>
                </div>
                <div class="settingsRow">
                    <span><a href="/">{{$t('setting.mediumText')}}</a></span>
                    <span class="spanValue"></span>
                </div>
                <div class="settingsRow">
                    <span><a href="/">{{$t('setting.contactText')}}</a></span>
                    <span class="spanValue"></span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "setting",
        data: () => {
            return {
                darkMode: false,
                notification: true,
                lang: ['English', 'Русский', 'Deutsch', 'Greek', 'Spanish', 'French',
                'Italian', 'Korean', 'Polish', 'Japanese', 'Chinese', 'Portuguese',
                'Vietnamese', 'Dutch'],
                currentLang: 'English',
                currency: ['USD', 'EUR', 'BTC', 'ETH'],
                currentCurrency: 'USD',
                startScreen: {
                    en: ['Dashboard', 'Active', 'News'],
                    ru: ['Панель управления', 'Активность', 'Новости']
                } ,
                currentScreen: {
                    en: 'Active',
                    ru: 'Активность'
                }
            }
        },
        methods:{
            switchDarkMode(){
                this.$store.commit('localStorage/switchDarkMode', !this.$store.state.localStorage.darkMode)
                this.darkMode = this.$store.state.localStorage.darkMode
                this.$vuetify.theme.dark = this.$store.state.localStorage.darkMode
            },
            switchNotifications(){
                this.$store.commit('localStorage/switchNotifications', !this.$store.state.localStorage.notifications)
                this.notification =  this.$store.state.localStorage.notification
            },
            switchCurrency(){
                console.log('this.currentCurrency: ', this.currentCurrency)
                this.$store.commit('localStorage/switchCurrency', this.currentCurrency)
            },
            switchScreen(){
                console.log('this.currentScreen[`${this.$i18n.loadedLanguages[0]}`]: ', this.currentScreen[`${this.$i18n.loadedLanguages[0]}`])
                this.$store.commit('localStorage/switchScreen', this.currentScreen[`${this.$i18n.loadedLanguages[0]}`])
                console.log('this.$store.state.localStorage.defaultStartScreen: ', this.$store.state.localStorage.defaultStartScreen)

            },
            switchLang(){
                console.log('change lang: ', this.currentLang)
                switch (this.currentLang) {
                    case 'English':
                        this.$router.push("/setting")
                        this.$store.commit('localStorage/switchLang', this.currentLang)
                        break
                    case 'Русский':
                        this.$router.push("/ru/setting")
                        this.$store.commit('localStorage/switchLang', this.currentLang)
                        break
                    default:

                }
            }
        },
        computed:{

        },
        watch:{
            value(){
                this.updateValue(this.findOptionFromReducedValue(this.value) || {})
            }
        },
        mounted() {
            this.darkMode =  this.$store.state.localStorage.darkMode
            this.notification =  this.$store.state.localStorage.notifications
            console.log('this.notification: ', this.notification)
            this.currentLang =  this.$store.state.localStorage.defaultLang
            this.currentCurrency =  this.$store.state.localStorage.defaultCurrency
            //this.currentScreen =  this.$store.state.localStorage.defaultStartScreen
            console.log('this.$store.state.localStorage.defaultStartScreen: ', this.$store.state.localStorage.defaultStartScreen)
            switch (this.$store.state.localStorage.defaultStartScreen) {
                case ('Активность' || 'Active'):
                    this.currentScreen = {
                        en: 'Active',
                        ru: 'Активность'
                    }
                    break
                case ('Панель управления' || 'Dashboard'):
                    this.currentScreen = {
                        en: 'Dashboard',
                        ru: 'Панель управления'
                    }
                    break
                case ('Новости' || 'News'):
                    this.currentScreen = {
                        en: 'News',
                        ru: 'Новости'
                    }
                    break
                default:
                    this.currentScreen = {
                        en: 'Active',
                        ru: 'Активность'
                    }

            }
            console.log(`currentScreen ${this.$i18n.loadedLanguages[0]}`, this.currentScreen[`${this.$i18n.loadedLanguages[0]}`])

        }
    }
</script>

<style scoped>
    .content_setting{
        display: block;
        width: 100%;
        padding: 3%;
    }
    .content_setting>h1{
        font-size: 35px;
        font-weight: 500;
        margin-bottom: 15px;
    }
    .settingsRow{
        display: flex;
        width: 100%;
        align-items: baseline;
        justify-content: space-between;
        min-height: 50px;
    }
    .settingsRow>div{
        margin: 0px !important;
    }
    .settingsRow>span{
        font-size: 18px;
        font-weight: 500;

    }
    .spanValue{
        opacity: 0.5;
        padding-right: 6px;
        max-width: 38%;
    }
    .spanValue>div{
        width: 38% !important;
        right: 0px !important;;
        margin: 0px !important;;
        display: contents !important;;
    }
</style>
