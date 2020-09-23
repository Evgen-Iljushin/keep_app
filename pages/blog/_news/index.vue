<template>
    <div class="newsArea">
        <div class="loadHtml">
            <h1>{{thisNews.data[0].title}}</h1>
            <img :src="thisNews.data[0].backgroundImage"/>
            <div v-html="thisNews.data != undefined ? JSON.parse(thisNews.data[0].html) : ''"></div>
            <div v-if="thisNews.data == undefined">News not find</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        async asyncData ({ $http, route }) {
            let urlNews = route.path.split('/')
            var thisNews = await $http.$post('https://topcryptoevents.com/api/getNews/getOneNews', { url: urlNews[urlNews.length - 1]})
            //var thisNews = await $http.$post('http://34.121.103.5/api/getNews/getOneNews', { url: urlNews[urlNews.length - 1]})
            //var thisNews = await $http.$post('/api/getNews/getOneNews', { url: urlNews[urlNews.length - 1]})
            //const thisNews = await res.text()
            return { thisNews }

        },
        beforeMount() {
            console.log("this.thisNews: ", this.thisNews.data[0])
            if(this.thisNews.type != 'success'){
                if(this.$route.path.indexOf("/en/") != -1) this.$router.push("/en/blog")
                else this.$router.push("/blog")
            }
        }
    }
</script>

<style scoped>
    .newsArea{
        display: block;
        height: auto;
    }
    .loadHtml{
        display: block;
        width: 100vw;
        padding: 3%;
        height: 93vh;
        overflow: scroll;
    }
    .newsDescription>p{
        font-style: italic;
    }
    .loadHtml>img{
        max-width: 100% !important;
    }
    img{
        max-width: 100%;
        height: auto !important;
    }

    .loadHtml>h1{
        font-size: 24px;
        text-align: center;
        padding: 5%;
    }
</style>
