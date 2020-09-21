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


router.post('/getCrypto/getAllCrypto', jsonParser, async function (req, res, next) {
    try{
        console.log('getAllCrypto')
        var reqBody = req.body;
        console.log('reqBody: ', reqBody)

        let allCrypto = await GetAllCrypto()

        if(allCrypto.type == 'success'){
            res.json({ type: 'success', data: allCrypto.data })
        } else {
            res.json({ type: 'error', message: 'crypto not find' })
        }

    } catch (err) {
        console.log('err getAllCrypto: ', err)
        res.json({ type: 'error', message: err })
    }
})

module.exports = router
