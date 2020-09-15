<template>
    <section class="container">
        <div class="content_new">
            <v-card>
                <div class="headNews">
                    <h1>{{$t('blog.news.title')}}</h1>
                </div>
                <div id="newsArea">
                    <div v-for="value in news" class="newsArea" :style="`background-image: url(${value.backgroundImage});`">
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
                news: [
                    {
                        title: "Introducing tBTC: The Safest Way to Earn with Your Bitcoin",
                        description: "Sign up for updates on tBTC’s launch in the coming weeks," +
                            " and opportunities to participate.",
                        author: "Keep Network",
                        data: "Apr 15",
                        timeRead: "4 min read",
                        backgroundImage: '/img/news-1.jpeg'
                    },
                    {
                        title: "How the KEEP Token Works",
                        author: "Keep Network",
                        data: "Apr 15",
                        timeRead: "4 min read",
                        backgroundImage: '/img/news-2.jpeg'
                    },
                    {
                        title: "How to Play for Keeps",
                        author: "Keep Network",
                        data: "Apr 15",
                        timeRead: "4 min read",
                        backgroundImage: '/img/news-3.jpeg'
                    },
                ]
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
        min-height: 37vh;
    }
    .titleNews{
        max-width: 50%;
        color: white;
        padding: 4%;
        padding-bottom: 0%;
        line-height: 23px;
    }
    .descriptionNews{

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
