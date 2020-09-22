<template>
    <v-app :dark="true">
        <!--<v-navigation-drawer
            v-models="drawer"
            :mini-variant="miniVariant"
            :clipped="clipped"
            fixed
            app
        >
            <v-list>
                <v-list-item :to="localePath('dashboard')" router exact>
                    <v-list-item-action>
                        <v-icon>{{ 'mdi-chart-areaspline' }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="$t('menu.dashboardName')" />
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="localePath('blog')" router exact>
                    <v-list-item-action>
                        <v-icon>{{ 'mdi-newspaper-variant-multiple-outline' }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="$t('menu.blogName')" />
                    </v-list-item-content>
                </v-list-item>
                <v-list-item :to="localePath('setting')" router exact>
                    <v-list-item-action>
                        <v-icon>{{ 'mdi-cog' }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="$t('menu.settingName')" />
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <nuxt-link
                        v-for="locale in availableLocales"
                        :key="locale.code"
                        :to="switchLocalePath(locale.code)">{{ $t('setting.swithLang') + locale.name }}
                    </nuxt-link>
                </v-list-item>
            </v-list>

        </v-navigation-drawer>
        <v-app-bar
            :clipped-left="clipped"
            fixed
            app
            :style="`visibility: ${apperRow ? 'visible' : 'hidden'}`"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-spacer />
            <v-btn
              icon
              @click.stop="rightDrawer = !rightDrawer"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
        </v-app-bar>-->
        <v-main>
            <v-container>
                <nuxt />
            </v-container>
        </v-main>
        <!--<v-navigation-drawer
            v-models="rightDrawer"
            :right="right"
            temporary
            fixed
        >
            <v-list>
                <v-list-item @click.native="right = !right">
                    <v-list-item-action>
                        <v-icon light>
                            mdi-repeat
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-title>Switch drawer (click me)</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>-->
        <div class="static_footer">
            <client-only>
                <div class="navButtons">
                    <n-link :to="localePath('dashboard')" :class="$store.state.localStorage.darkMode ? 'link themeDark' : 'link'">
                        <v-btn>
                            <img :src="$route.path.indexOf('dashboard') != -1 ? '/icon/Dashbordicon2.png' :
                         (this.$vuetify.theme.dark ? '/icon/Dashbordicon1_white.png' : '/icon/Dashbordicon1.png')">
                        </v-btn>
                    </n-link>
                    <n-link :to="localePath('active')" :class="$store.state.localStorage.darkMode ? 'link themeDark' : 'link'">
                        <v-btn>
                            <img :src="$route.path.indexOf('active') != -1 ? '/icon/Activityicon2.png' :
                        (this.$vuetify.theme.dark ? '/icon/Activityicon1_white.png' : '/icon/Activityicon1.png')">
                        </v-btn>
                    </n-link>
                    <n-link :to="localePath('blog')" :class="$store.state.localStorage.darkMode ? 'link themeDark' : 'link'">
                        <v-btn>
                            <img :src="$route.path.indexOf('blog') != -1 ? '/icon/News_active.png' :
                        (this.$vuetify.theme.dark ? '/icon/News_white.png' : '/icon/News.png')">
                        </v-btn>
                    </n-link>
                    <n-link :to="localePath('info')" :class="$store.state.localStorage.darkMode ? 'link themeDark' : 'link'">
                        <v-btn>
                            <img :src="$route.path.indexOf('info') != -1 ? '/icon/Info_active.png' :
                        (this.$vuetify.theme.dark ? '/icon/Info_white.png' : '/icon/Info.png')">
                        </v-btn>
                    </n-link>
                    <n-link :to="localePath('setting')" :class="$store.state.localStorage.darkMode ? 'link themeDark' : 'link'">
                        <v-btn>
                            <img :src="$route.path.indexOf('setting') != -1 ? '/icon/Settings_active.png' :
                        (this.$vuetify.theme.dark ? '/icon/Settings_white.png' : '/icon/Settings.png')">
                        </v-btn>
                    </n-link>
                </div>

            </client-only>
        </div>
        <!--<v-footer
            :absolute="fixed"
            app
        >

        </v-footer>-->
        <script src="/js/main.js"></script>
    </v-app>
</template>

<script>
    export default {
        data () {
            return {
                clipped: false,
                drawer: false,
                fixed: false,
                apperRow: false,
                items: [
                    {
                        icon: 'mdi-chart-areaspline',
                        title: 'Dashboard',
                        to: '/dashboard'
                    },
                    {
                        icon: 'mdi-newspaper-variant-multiple-outline',
                        title: 'Blog',
                        to: '/blog'
                    },
                    {
                        icon: 'mdi-cog',
                        title: 'Setting',
                        to: '/setting'
                    }
                ],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Vuetify.js'
            }
        },
        computed: {
            availableLocales () {
                return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
            }
        },
        watch:{

        },
        mounted(){
            this.$OneSignal.push(() => {
                this.$OneSignal.isPushNotificationsEnabled((isEnabled) => {
                    if (isEnabled) {
                        console.log('Push notifications are enabled!')
                    } else {
                        console.log('Push notifications are not enabled yet.')
                    }
                })
            })

            window.$OneSignal.push(['addListenerForNotificationOpened', (data) => {
                console.log('Received NotificationOpened:', data )}
            ]);


        },
        beforeCreate() {
            this.$vuetify.theme.dark = this.$store.state.localStorage.darkMode
        }
    }
</script>

<style scoped>
    .navButtons{
        width: 100%;
        display: flex;
        justify-content: space-around;
        border-top: 2px solid #a6a6a6;
    }
    .navButtons>a{
        display: flex;
        justify-content: center;
        width: 25%;
    }
    .navButtons button,.navButtons button:active,.navButtons button:focus,.navButtons button:before,
    .navButtons button:after{
        width: auto;
        height: 40px !important;
        border: none;
        background-color: #121212 !important;
        box-shadow: none;
        display: flex;
        align-self: center;
    }
    .navButtons button.theme--light,.navButtons button.theme--light:active,.navButtons button.theme--light:focus,
    .navButtons button.theme--light:before, .navButtons button.theme--light:after{
        background-color: #FFFFFF !important;
    }
    .navButtons .link{
        background-color: #FFFFFF !important;
    }
    .navButtons .link.themeDark{
        background-color: #121212 !important;
    }
   img{
        max-height: 27px;
        width: auto;
    }
    footer{
        position: fixed !important;
    }
    .static_footer{
        display: flex;
        bottom: 0px;
        vertical-align: center;

        position: fixed;
        width: 100%;
        height: 60px;

    }
    .navButtons img{
        user-select: none;
    }
</style>
