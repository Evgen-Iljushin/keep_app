<template>
    <section class="container">
        <div class="content_new">
            <v-card style="min-width: 100vw; display: block;">
                <div class="headNews"  style="min-width: 100%;">
                    <h1>{{$t('blog.news.title')}}</h1>
                </div>
                <div id="newsArea">
                    <div v-for="value in news" class="newsArea" v-if="value.title != undefined" :style="`background-image: url(${value.backgroundImage});`">
                        <nuxt-link :to="`${$i18n.locale != 'en' ? '/'+$i18n.locale : ''}/blog/${value.url}`">
                            <div class="titleNews">
                                <h1>{{value.title}}</h1>
                            </div>
                            <div class="descriptionNews">
                                <div class="desription">
                                <span>
                                    {{value.description != undefined ? value.description : ''}}
                                </span>
                                </div>
                                <div class="icon">
                                    <img src="/img/keep-mini.jpeg">
                                </div>
                                <div class="authorNews">
                                    <span>{{value.author}}</span>
                                </div>
                                <div class="timeReading">
                                    <span>{{value.data}}</span>
                                    <span class="middotDivider"></span>
                                    <span>{{value.timeRead}}</span>
                                </div>
                            </div>
                        </nuxt-link>
                    </div>
                </div>
            </v-card>
        </div>
    </section>
</template>

<script>
    export default {
        name: "news",
        data: () => {
            return {
                news: []
            }
        },
        async asyncData ({ $http, route }) {
            //var thisNews = await $http.$post('https://topcryptoevents.com/api/getNews/allNews')
            //var thisNews = await $http.$post('http://34.121.103.5/api/getNews/allNews')
            var thisNews = await $http.$post('http://localhost:3030/api/getNews/allNews')
            let result = thisNews['data']
            return { result }

        },
        beforeMount() {
            console.log('this.$i18n.locale: ', this.$i18n.locale)
            let langNews = []
            for(let x = 0; x < this.result.length; x++){
                if(this.result[x].lang == this.$i18n.locale){
                    langNews.push(this.result[x])
                }
            }
            this.news = langNews
            console.log(langNews)
            if(this.result.length < 1){
                if(this.$route.path.indexOf("/ru/") != -1) this.$router.push("/ru/active")
                else this.$router.push("/active")
            }
        }
    }
</script>

<style scoped>
    #newsArea{
        height: 91vh;
        overflow-y: overlay;
    }
    .newsArea{
        background-position: 50% 50% !important;
        background-size: cover;
        margin-bottom: 5%;
        min-height: 40vh;
        box-shadow: 0px 0px 14px 1px #80808054;
    }
    .titleNews{
        max-width: 50%;
        color: white;
        padding: 4%;
        padding-bottom: 0%;
        line-height: 23px;
        text-shadow: 1px 1px 2px black, 0 0 1em #959595;
    }
    .descriptionNews{
        text-shadow: 1px 1px 2px black, 0 0 1em #959595;
    }
    .desription{
        width: 50%;
        padding: 4%;
        color: white;
        font-size: 17px;
        font-weight: 300;
        padding-top: 0%;
        min-height: 80px;
    }
    .icon{
        margin: 4%;
        border-radius: 40px;
        width: 38px;
        overflow: hidden;
        height: 37px;
        border: 1px solid #24332e;
        float: left;
        margin-top: 0%;
    }
    .icon>img{

    }
    .authorNews{
        color: white;
        font-weight: 200;
        font-size: 15px;
        margin-top: -4px;
    }
    .authorNews>span{

    }
    .timeReading{
        color: white;
        font-weight: 200;
        font-size: 15px;
        padding-bottom: 10px;

    }
    .middotDivider:after {
        content: '\00B7';
    }

    .headNews{
        text-align: center;
    }
</style>
