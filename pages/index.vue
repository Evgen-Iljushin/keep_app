<template>
    <div class="container">
        <div>
            <Logo />
            <div class="tagline">
                <p style="color: #293330 !important;">
                    The future of
                    blockchain
                    privacy.
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        layout: 'main',
        async asyncData ({ $http }) {
            const test = await $http.$get('/api/test')
            return {
                test
            }
        },
        mounted() {
            setTimeout(()=>{
                var redirectPage = 'active'
                switch(this.$store.state.localStorage.defaultStartScreen){
                    case ('Active' || 'Активность'):
                        redirectPage = 'active'
                        break
                    case ('Dashboard' || 'Панель управления'):
                        redirectPage = 'dashboard'
                        break
                    case ('News' || 'Новости'):
                        redirectPage = 'blog'
                        break
                }

                var lang = 'en'
                switch(this.$store.state.localStorage.defaultLang){
                    case ('English'):
                        lang = '/'
                        break
                    case ('Русский'):
                        lang = '/ru/'
                        break
                    default:
                        lang = '/'
                }

                console.log('path: ', this.$route.path)
                this.$router.push(`${lang}${redirectPage}`)
                //if(this.$route.path == "/" || this.$route.path == "") this.$router.push(`${lang}${redirectPage}`)
                //else if ( this.$route.path == "/en" || this.$route.path == "/en/") this.$router.push(`${redirectPage}`)
                //else if ( this.$route.path == "/ru" || this.$route.path == "/ru/") this.$router.push(`/ru/${redirectPage}`)
            }, 2000)
        },
        beforeCreate() {
            this.$vuetify.theme.dark = this.$store.state.localStorage.darkMode
        }
    }
</script>

<style scoped>
    .container {
        margin: 0 auto;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0px !important;
        background-color: #8ACB32;
    }

    .tagline{
        display: flex;
        position: fixed;
        bottom: 5%;
        max-width: 50%;
        right: 5vw;
    }

    .tagline>p{
        font-family: Verdana;
        font-weight: bolder;
        font-size: 24px;
        line-height: 29px;
        text-align: left;
    }
</style>
