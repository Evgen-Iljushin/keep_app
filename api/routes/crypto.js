const { Router } = require('express')
var  bodyParser = require('body-parser')

const router = Router()
var jsonParser = bodyParser.json()


const {
    CreateCrypto,
    GetAllCrypto,
    GetCrypto,
    UpdateCrypto
} = require('../models/Crypto.js')

const {
    GetInfo
} = require('../models/Info.js')

const {
    GetChart
} = require('../models/Charts.js')

router.post('/getCrypto/getAllCrypto', jsonParser, async function (req, res, next) {
    try{
        console.log('getAllCrypto')
        var reqBody = req.body;
        console.log('reqBody: ', reqBody)

        let allCrypto = await GetAllCrypto()
        let priceAndPercent = await GetInfo({name: 'priceAndPercent' })
        let chartData = await GetChart({name: 'mainChart' })

        if(allCrypto.type == 'success' && priceAndPercent.type == 'success' && chartData.type == 'success'){
            res.json({ type: 'success', data: { crypto: allCrypto.data, info: priceAndPercent.data[0],
                chart: chartData.data[0]} })
        } else {
            res.json({ type: 'error', message: 'crypto not find' })
        }

    } catch (err) {
        console.log('err getAllCrypto: ', err)
        res.json({ type: 'error', message: err })
    }
})

module.exports = router
