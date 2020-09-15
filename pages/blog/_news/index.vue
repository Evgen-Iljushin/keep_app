<template>
    <div class="newsArea">
        <div class="loadHtml" v-html="thisNews.data != undefined ? thisNews.data.html : ''"></div>
        <div v-if="thisNews.data == undefined">News not find</div>
    </div>
</template>

<script>
    export default {
        name: "index",
        async asyncData ({ $http, route }) {
            let urlNews = route.path.split('/')
            var thisNews = await $http.$post('/api/getNews/getOneNews', { url: urlNews[urlNews.length - 1]})
            //const thisNews = await res.text()
            return { thisNews }

        },
        beforeMount() {
            console.log("this.thisNews: ", this.thisNews)
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
        padding: 5%;
    }
    .newsDescription>p{
        font-style: italic;
    }
</style>
