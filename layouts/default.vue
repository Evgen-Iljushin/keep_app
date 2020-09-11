<template>
    <v-app dark>
        <v-navigation-drawer
            v-model="drawer"
            :mini-variant="miniVariant"
            :clipped="clipped"
            fixed
            app
        >
            <v-list>
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :to="item.to"
                    router
                    exact
                >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title" />
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
            <!--<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-spacer />
            <v-btn
              icon
              @click.stop="rightDrawer = !rightDrawer"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>-->
        </v-app-bar>
        <v-main>
            <v-container>
                <nuxt />
            </v-container>
        </v-main>
        <v-navigation-drawer
            v-model="rightDrawer"
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
        </v-navigation-drawer>
        <v-footer
            :absolute="!fixed"
            app
        >
            <div class="navButtons">
                <n-link to="/dashboard">
                    <v-btn small>
                        <img src="icon/dashboard-icon.png">
                    </v-btn>
                </n-link>
                <n-link to="/blog">
                    <v-btn small>
                        <img src="icon/blog-icon.png">
                    </v-btn>
                </n-link>
                <n-link to="/setting">
                    <v-btn small>
                        <img src="icon/setting-icon.png">
                    </v-btn>
                </n-link>
            </div>
        </v-footer>
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
        }
    }
</script>

<style scoped>
    .navButtons{
        width: 100%;
        display: flex;
        justify-content: space-around;
    }
    .navButtons button{
        width: 100px;
        height: 40px !important;
        background-color: #BDBDBD !important;
    }
    .navButtons .nuxt-link-active>button{
        background-color: #8ACB32 !important;
    }
</style>
