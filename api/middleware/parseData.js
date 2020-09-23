const needle = require('needle')
const cheerio = require('cheerio')
var ontime = require('ontime')
const puppeteer = require('puppeteer');
var jQuery = require('puppeteer-jquery');
//const {Builder, By, Key, until} = require('selenium-webdriver');//работа с браузером

var tableUrl = 'https://www.coingecko.com/en/coins/keep-network#markets'

const {
    CreateCrypto,
    GetAllCrypto,
    GetCrypto,
    UpdateCrypto
} = require('../models/Crypto.js')

const {
    CreateNews,
    GetAllNews,
    GetNews,
    UpdateNews
} = require('../models/News.js')

//parseTableCrypto()

function parseTableCrypto() {
    try{

        (async () => {
            try {
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    headless: false
                });
                const page = await browser.newPage();
                await page.setViewport({ width: 1920, height: 1080});
                await page.goto(tableUrl, {waitUntil: 'load'});

                setTimeout(async() => {
                    // Get the "viewport" of the page, as reported by the page.
                    const dimensions = await page.evaluate(() => {
                        return {
                            width: document.documentElement.clientWidth,
                            height: document.documentElement.clientHeight,
                            deviceScaleFactor: window.devicePixelRatio
                        };
                    });

                    console.log('Dimensions:', dimensions);


                    setTimeout(async() => {
                        //подключение jquery
                        //await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

                        var result = await page.evaluate(async () => {
                            //парсинг
                            var arrResult = []

                            $('.table.table-scrollable').children('tbody')
                            var tabTr = $('.table.table-scrollable').children('tbody').find('tr')
                            for(let x = 0; x < tabTr.length; x++){
                                let thisTb = $(tabTr[x]).find('td')

                                let trustScore = ''
                                let parseTrust = $(thisTb[10]).find('span').attr('data-original-title')
                                if (parseTrust.indexOf('Good') != -1) trustScore = 'good'
                                else if (parseTrust.indexOf('Fair') != -1) trustScore = 'fair'
                                else if (parseTrust.indexOf('Low') != -1) trustScore = 'low'
                                else if (parseTrust.indexOf('Unknown') != -1) trustScore = 'unknown'
                                else trustScore = 'unknown'

                                arrResult.push({
                                    name: $(thisTb[1]).find('a').text(),
                                    url: `https://www.coingecko.com/${$(thisTb[1]).find('a').attr('href')}`,
                                    pair: $(thisTb[2]).find('a').text().replace(/\n/g, ''),
                                    addressPair: $(thisTb[2]).find('small').text(),
                                    price: $(thisTb[3]).find('div').text(),
                                    priceETH: $(thisTb[3]).find('small').text(),
                                    _24hVolume: $(thisTb[7]).find('div').text(),
                                    trust: trustScore
                                })
                                let name
                            }



                            return arrResult;
                        });

                        console.log('arrResult: ', result)
                        writeDataToDb(result)

                        await browser.close();
                    }, 10000);

                    //await browser.close();

                }, 5000);

            } catch (error) {
                console.log('err puppeteer: ', error);
            }
        })();

    } catch (err) {
        console.log('ERR parseTableCrypto: ', err)
    }
}


function writeDataToDb(arrData){
    try{
        let iteration = 0

        addOne(iteration, arrData)

        async function addOne(itrt, arrData){
            let data = arrData[itrt]

            let check = await GetCrypto(data)
            if(check.type == 'success'){

                console.log(`crypto ${data} already write in db`)

                let resultUpdate = await UpdateCrypto(data)
                if(resultUpdate.type == 'success'){
                    console.log('success update ', resultUpdate.data.name)
                } else {
                    console.log('error update ', resultUpdate.data)
                }

            } else {
                console.log(`not find ${data.name}`)

                let resultWrite = await CreateCrypto(data)
                if(resultWrite.type == 'success'){
                    console.log('success resultWrite ', resultWrite.data.name)
                } else {
                    console.log('error write ', resultWrite.data)
                }

            }

            if(itrt < arrData.length - 1){
                itrt++
                addOne(itrt, arrData)
            }
        }

    } catch (err) {
        console.log('err writeDataToDb: ', err)
    }
}

var newsUrl = 'https://blog.keep.network/'

parseNews()

function parseNews() {
    try{

        (async () => {
            try {
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    headless: false
                });
                const page = await browser.newPage();
                await page.setViewport({ width: 1920, height: 1080});
                await page.goto(newsUrl, {waitUntil: 'load'});

                setTimeout(async() => {
                    // Get the "viewport" of the page, as reported by the page.
                    const dimensions = await page.evaluate(() => {
                        return {
                            width: document.documentElement.clientWidth,
                            height: document.documentElement.clientHeight,
                            deviceScaleFactor: window.devicePixelRatio
                        };
                    });

                    console.log('Dimensions:', dimensions);


                    setTimeout(async() => {
                        //подключение jquery
                        await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

                        var result = await page.evaluate(async () => {
                            //парсинг
                            var arrResult = []

                            var blocks = $('body').find('.u-block')
                            for(let x = 0; x < blocks.length; x++){
                                let urlFull = $(blocks[x]).attr('href')

                                urlFull = urlFull.split('?')
                                urlFull = urlFull[0]

                                let url = $(blocks[x]).attr('href')
                                url = url.split('/')
                                url = url[url.length - 1]
                                url = url.split('?')
                                url = url[0]

                                let imgNotParse = $(blocks[x]).attr('style')
                                imgNotParse = imgNotParse.split('("')
                                imgNotParse = imgNotParse[1].split('")')
                                imgNotParse = imgNotParse[0]

                                let parent = $(blocks[x]).parent().parent()

                                let title = $(parent).find('h3').children('div').text()
                                let description = $(parent).find('.u-contentSansThin').children().text()
                                let author = $(parent).find('.postMetaInline-authorLockup').children('a').text()
                                let data =  $(parent).find('time').text()
                                let timeRead =  $(parent).find('.readingTime').attr('title')

                                arrResult.push({
                                    title: title,
                                    description: description,
                                    url: url,
                                    urlFull: urlFull,
                                    backgroundImage: imgNotParse,
                                    author: author,
                                    data: data,
                                    timeRead: timeRead,
                                    html: ''
                                })
                            }
                            //var tabTr = $('.table.table-scrollable').children('tbody').find('tr')
                            //for(let x = 0; x < tabTr.length; x++){
                            //    let thisTb = $(tabTr[x]).find('td')
//
                            //    let trustScore = ''
                            //    let parseTrust = $(thisTb[10]).find('span').attr('data-original-title')
                            //    if (parseTrust.indexOf('Good') != -1) trustScore = 'good'
                            //    else if (parseTrust.indexOf('Fair') != -1) trustScore = 'fair'
                            //    else if (parseTrust.indexOf('Low') != -1) trustScore = 'low'
                            //    else if (parseTrust.indexOf('Unknown') != -1) trustScore = 'unknown'
                            //    else trustScore = 'unknown'
//
                            //    arrResult.push({
                            //        name: $(thisTb[1]).find('a').text(),
                            //        url: `https://www.coingecko.com/${$(thisTb[1]).find('a').attr('href')}`,
                            //        pair: $(thisTb[2]).find('a').text().replace(/\n/g, ''),
                            //        addressPair: $(thisTb[2]).find('small').text(),
                            //        price: $(thisTb[3]).find('div').text(),
                            //        priceETH: $(thisTb[3]).find('small').text(),
                            //        _24hVolume: $(thisTb[7]).find('div').text(),
                            //        trust: trustScore
                            //    })
                            //    let name
                            //}
//
                            console.log('arrResult: ', blocks)

                            return arrResult;
                        });

                        console.log('arrResult: ', result)
                        parsePages(result)
                        //writeDataToDb(result)

                        await browser.close();
                    }, 1000);

                    //await browser.close();

                }, 5000);

            } catch (error) {
                console.log('err puppeteer: ', error);
            }
        })();

    } catch (err) {
        console.log('ERR parseNews: ', err)
    }
}

function parsePages(allNews){
    try{
        let iteration = 0

        parse(allNews[iteration])

        async function parse (dataPage){
            try{
                let htmlNews = await loadNewsData(dataPage.urlFull)
                if(htmlNews.type == 'success'){
                    console.log('success parse html on ', dataPage.urlFull)
                    dataPage.html = JSON.stringify(htmlNews.data)
                    let checkPage = await GetNews(dataPage)
                    if (checkPage.type != 'success') {
                        let resultAddNews = await CreateNews(dataPage)
                        if(resultAddNews.type == 'success'){
                            console.log('success ADD News')
                        } else {
                            console.log('ERR add News')
                        }
                    } else {
                        console.log('news already add')
                    }

                } else {
                    console.log('err parse html: ', dataPage.urlFull)
                }

                if(iteration < allNews.length - 1){
                    iteration++
                    parse(allNews[iteration])
                }
            } catch (err) {
                console.log('err parse: ', err)
                if(iteration < allNews.length - 1){
                    iteration++
                    parse(allNews[iteration])
                }
            }
        }

    } catch (err) {
        console.log('err parsePages: ', err)
    }
}

async function loadNewsData(url){
    try{
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: false
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080});
        await page.goto(url, {waitUntil: 'load'});

        const dimensions = await page.evaluate(() => {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                deviceScaleFactor: window.devicePixelRatio
            };
        });

        console.log('Dimensions:', dimensions);

        await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

        var result = await page.evaluate(async () => {
            //парсинг

            var thisHtml = $('body').find('.ab.ac.ae.af.ag')
            console.log('thisHtml')
            if(thisHtml.length == 9){
                thisHtml = $(thisHtml[3]).html()
            } else if (thisHtml.length == 8) {
                thisHtml = $(thisHtml[2]).html()
            } else {
                thisHtml = $(thisHtml[3]).html()
            }

            return thisHtml;
        });

        console.log('arrResult: ', result)
        await browser.close();
        if(result != undefined){
            return { type: 'success', data: result }
        } else {
            return { type: 'err', data: result }
        }

    } catch (err) {
        console.log('ERR parseNews: ', err)
        try{
            await browser.close();
        } catch (e) {

        }
        return { type: 'err', data: err }
    }
}


ontime({
    cycle: [ '00:00', '10:00', '20:00', '30:00', '40:00', '50:00']
}, function (ot) {
    parseTableCrypto()
    ot.done()
    return
})

ontime({
    cycle: [ '05:00', '35:00']
}, function (ot) {
    parseNews()
    ot.done()
    return
})

/*
var url = 'https://www.coingecko.com/en/coins/keep-network#markets'

const parseNodePage = async (url) => {
    try {
        console.log('Start parseNodePage, url: ', url)
        let resultParsing = await needle("get", url);

        if (!resultParsing.err && resultParsing.statusCode == 200) {
            let $ = cheerio.load(resultParsing.body)



        } else {

        }
    } catch (err) {

    }
}

parseNodePage(url)
*/
