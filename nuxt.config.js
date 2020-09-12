import colors from 'vuetify/es5/util/colors'
import TerserPlugin from 'terser-webpack-plugin'
import path from 'path'

export default {
    /*
    ** Nuxt rendering mode
    ** See https://nuxtjs.org/api/configuration-mode
    */
    mode: 'universal',
    /*
    ** Nuxt target
    ** See https://nuxtjs.org/api/configuration-target
    */
    target: 'server',
    /*
    ** Headers of the page
    ** See https://nuxtjs.org/api/configuration-head
    */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
    ** Global CSS
    */
    css: [
        '@/theme/index.scss'
    ],
    /*
    ** Plugins to load before mounting the App
    ** https://nuxtjs.org/guide/plugins
    */
    plugins: [
    ],
    /*
    ** Auto import components
    ** See https://nuxtjs.org/api/configuration-components
    */
    components: true,
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/vuetify'
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        '@nuxt/http',
        'nuxt-i18n',
        ['nuxt-twa-module', {
            /* module options */
            defaultUrl: 'http://35.242.225.38/',
            hostName: '35.242.225.38',
            applicationId: 'com.example.example',
            launcherName: 'keep_app',
            versionCode: 1,
            versionName: '0.0.1',
            statusBarColor: '#8cc540'/* color */,
            // The sha256Fingerprints by is an array with one SHA-256 key string.
            // But if you have multiple you can add them to the array. More information about the website asociation:
            // https://developer.android.com/training/app-links/verify-site-associations#web-assoc
            sha256Fingerprints: ['/* your SHA-256 keys */'],
            /* optional */
            /* overwrite default location for icon */
            iconPath: '/static/icon.png',
            /* Overwrite folder where to put .wellknown */
            distFolder: '.nuxt/dist/client',
        }],
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    i18n: {
        strategy: 'prefix_except_default',
        defaultLocale: 'ru',
        locales: [
            {
                code: 'en',
                file: 'en-US.js',
                name: 'English'
            },
            {
                code: 'ru',
                file: 'ru-RU.js',
                name: 'Русский'
            }
        ],
        lazy: true,
        langDir: 'lang/',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected'
        }
    },
    axios: {},
    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                },
                light: {
                    primary: colors.red.darken1, // #E53935
                    secondary: colors.red.lighten4, // #FFCDD2
                    accent: colors.indigo.base, // #3F51B5
                },
            }
        }
    },
    /*
    ** Build configuration
    ** See https://nuxtjs.org/api/configuration-build/
    */
    serverMiddleware: {
        '/api': '~/api'
    },
    cache: true,
    render: {
        bundleRenderer: {
            cache: require('lru-cache')({
                max: 500,
                maxAge: 1000 * 60 * 60
            }),
            runInNewContext: false
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                include: /\/includes/,
            }),
        ],
        splitChunks: {
            chunks: 'all'
        }
    },
    build: {
        analyze: true,
        followSymlinks: true,
        vendor: ['@nuxtjs/axios',
            '@nuxtjs/pwa',
            '@nuxtjs/vuetify',
            '@nuxtjs/device',
            'nuxt-user-agent'],
        extend(config, { isClient }) {
            if (isClient) {
                config.optimization.splitChunks.maxSize = 200000
            }
        }
    }
}
