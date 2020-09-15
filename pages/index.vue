<template>
    <div class="container">
        <div>
            <Logo />
            <div class="tagline">
                <p>
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
                if(this.$route.path == "/") this.$router.push("/active")
                else if ( this.$route.path == "/en") this.$router.push("/en/active")
            }, 2000)
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
