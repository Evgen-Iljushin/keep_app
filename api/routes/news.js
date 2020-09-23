const { Router } = require('express')
var  bodyParser = require('body-parser')

const router = Router()
var jsonParser = bodyParser.json()

// Mock Users
const news = [
    {
        url: 'test',
        html: `<div class="newsHead">
                    <h1>Introducing tBTC: The Safe Way to Earn with Your Bitcoin</h1>
                </div>
                <div class="newsDescription">
                    <p>Sign up for updates on tBTC’s launch in the coming weeks, and opportunities to participate.</p>
                </div>
                <div class="newsImg">
                    <img src="https://miro.medium.com/max/1350/1*ME_LP4EQt1g6C8hyPp36RA.jpeg" />
                </div>
                <div class="newsText">
                    <p>Decentralized finance (DeFi) is one of the most exciting sectors to watch in 2020. Over the past year the amount of ETH locked in DeFi applications has grown from roughly $300 million to over $1 billion. Major names including Facebook, Walmart and JPMorgan are beginning to enter the market, and opportunities to earn returns on cryptoassets continue to multiply.</p>
                    <br>
                    <p>But many Bitcoiners are reluctant to get involved in the various DeFi projects being built on chains such as Ethereum. Some are put off by the complex and sometimes alienating technical language and concepts that surround them, which can make altcoins and DeFi seem like a black box. Others conjure up images of shadowy frauds and thefts on a massive scale, like the infamous collapse of Mt. Gox in 2014. But the crypto space beyond Bitcoin has too much transformative potential to be overlooked. It’s time to move forward, and now we can.</p>
                </div>`
    }
]

const {
    CreateNews,
    GetAllNews,
    GetNews,
    UpdateNews
} = require('../models/News.js')

/* GET user by ID. */
router.post('/getNews/allNews', jsonParser, async function (req, res, next) {
    try{
        console.log('getAllNews')
        let allNews = await GetAllNews()
        if(allNews.type == 'success'){
            res.json({ type: 'success', data: allNews.data })
        } else {
            res.json({ type: 'error', message: 'news not find' })
        }
    } catch (err) {
        console.log('err getOneNews: ', err)
        res.json({ type: 'error', message: err })
    }
})

router.post('/getNews/getOneNews', jsonParser, async function (req, res, next) {
    try{
        console.log('getOneNews')
        var reqBody = req.body;
        console.log('reqBody: ', reqBody)
        let getNews = await GetNews(reqBody)
        console.log('getNews: ', getNews)
        if(getNews.type == 'success'){
            res.json({ type: 'success', data: getNews.data })
        } else {
            res.json({ type: 'error', message: 'news not find' })
        }
    } catch (err) {
        console.log('err getOneNews: ', err)
        res.json({ type: 'error', message: err })
    }
})

module.exports = router
