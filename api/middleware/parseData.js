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

const {
    CreateChart,
    GetAllChart,
    GetChart,
    UpdateChart
} = require('../models/Charts.js')

const {
    CreateInfo,
    GetAllInfo,
    GetInfo,
    UpdateInfo
} = require('../models/Info.js')

//parseTableCrypto()

function parseTableCrypto() {
    try{

        (async () => {
            try {
                const browser = await puppeteer.launch({args: ['--no-sandbox']});
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

//parseNews()

function parseNews() {
    try{

        (async () => {
            try {
                const browser = await puppeteer.launch({args: ['--no-sandbox']});
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
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
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

//getMainInfo('https://www.coingecko.com/en/coins/keep-network')

async function getMainInfo(url){
    try{
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
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

        var result = await page.evaluate(async () => {
            //парсинг
            let priceBlocks = $('body').find('span[data-coin-symbol="keep"][data-target="price.price"]')
            price = $(priceBlocks[0]).text()
            let percent = $(priceBlocks[0]).parent().children('.live-percent-change.ml-1').children('span').text()

            let result = {
                price: price,
                percent: percent
            }

            return result;
        });

        console.log('arrResult: ', result)
        await browser.close();
        writeMainData(result)
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


async function writeMainData(data){
    try{
        let infoData = {
            name: 'priceAndPercent',
            data: JSON.stringify(data)
        }
        let check = await GetInfo(infoData)
        if(check.type =='success' ){
            let update = await UpdateInfo(infoData)
            if(update.type =='success' ){
                console.log('success update price and percent info')

            } else {
                console.log('err update price and percent info: ', update.data)
            }
        } else {
            let writeNew = await CreateInfo(infoData)
            if(writeNew.type =='success' ){
                console.log('success write new price and percent info')

            } else {
                console.log('err write price and percent info: ', writeNew.data)
            }
        }
    } catch (err) {
        console.log('ERR writeMainData: ', err)
    }
}


//getChartData('https://www.coingecko.com/en/coins/keep-network')

async function getChartData(url){
    try{
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080});
        //await page.goto(url, {waitUntil: 'load'});
        await page.setDefaultNavigationTimeout(100000);
        await page.goto(url, {waitUntil: 'load', timeout: 0});

        const dimensions = await page.evaluate(() => {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                deviceScaleFactor: window.devicePixelRatio
            };
        });

        console.log('Dimensions:', dimensions);

        var element = await page.$('.graph-stats-btn-24h');
        await element.click();
        await page.waitForTimeout(3000)

        var listDate_24h = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_24h = await getJson('https://www.coingecko.com/price_charts/3373/usd/24_hours.json')

        console.log('json_24h length: ', json_24h.stats.length)
        console.log('listDate_24h: ', listDate_24h)

        var element = await page.$('.graph-stats-btn-7d');
        await element.click();
        await page.waitForTimeout(3000)

        var listDate_7d = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_7d = await getJson('https://www.coingecko.com/price_charts/3373/usd/7_days.json')

        console.log('json_7d length: ', json_7d.stats.length)
        console.log('listDate_7d: ', listDate_7d)


        var element = await page.$('.graph-stats-btn-14d');
        await element.click();
        await page.waitForTimeout(3000)

        var listDate_14d = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_14d = await getJson('https://www.coingecko.com/price_charts/3373/usd/14_days.json')

        console.log('json_14d    length: ', json_14d.stats.length)
        console.log('listDate_14d: ', listDate_14d)


        var element = await page.$('.graph-stats-btn-30d');
        await element.click();
        await page.waitForTimeout(3000)

        var listDate_30d = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_30d = await getJson('https://www.coingecko.com/price_charts/3373/usd/30_days.json')

        console.log('json_30d length: ', json_30d.stats.length)
        console.log('listDate_30d: ', listDate_30d)



        var element = await page.$('.graph-stats-btn-90d');
        await element.click();
        await page.waitForTimeout(3000)

        var listDate_90d = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_90d = await getJson('https://www.coingecko.com/price_charts/3373/usd/90_days.json')

        console.log('json_90d length: ', json_90d.stats.length)
        console.log('listDate_90d: ', listDate_90d)



        var element = await page.$('.graph-stats-btn-180d');
        await element.click();
        await page.waitForTimeout(6000)

        var listDate_180d = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_180d = await getJson('https://www.coingecko.com/price_charts/3373/usd/180_days.json')

        console.log('json_180d length: ', json_180d.stats.length)
        console.log('listDate_180d: ', listDate_180d)




        var element = await page.$('.graph-stats-btn-1y');
        await element.click();
        await page.waitForTimeout(6000)

        var listDate_1y = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_1y = await getJson('https://www.coingecko.com/price_charts/3373/usd/365_days.json')

        console.log('json_1y length: ', json_1y.stats.length)
        console.log('listDate_1y: ', listDate_1y)




        var element = await page.$('.graph-stats-btn-max');
        await element.click();
        await page.waitForTimeout(6000)

        var listDate_max = await page.evaluate(async () => {
            //парсинг
            let allDate = $('.highcharts-axis-labels')[0]
            allDate = $(allDate).children()

            let arrowDate = []

            for(let x = 0; x < allDate.length; x++){
                arrowDate.push($(allDate[x]).text())
            }

            return arrowDate;
        });

        let json_max = await getJson('https://www.coingecko.com/price_charts/3373/usd/max.json')

        console.log('json_max length: ', json_max.stats.length)
        console.log('listDate_max: ', listDate_max)



        await browser.close();
        //writeMainData(result)
        calcChartDate([
            {
                date: listDate_24h,
                json: json_24h.stats
            },
            {
                date: listDate_7d,
                json: json_7d.stats
            },
            {
                date: listDate_14d,
                json: json_14d.stats
            },
            {
                date: listDate_30d,
                json: json_30d.stats
            },
            {
                date: listDate_90d,
                json: json_90d.stats
            },
            {
                date: listDate_180d,
                json: json_180d.stats
            },
            {
                date: listDate_1y,
                json: json_1y.stats
            },
            {
                date: listDate_max,
                json: json_max.stats
            }
        ])

    } catch (err) {
        console.log('ERR parseNews: ', err)
        try{
            await browser.close();
        } catch (e) {

        }
        return { type: 'err', data: err }
    }
}

async function getJson(url){
    try {
        const browser = await puppeteer.launch( {args: ['--no-sandbox']});

        const page = await browser.newPage();

        await page.goto(url);

        var content = await page.content();

        var innerText = await page.evaluate(() =>  {
            return JSON.parse(document.querySelector("body").innerText);
        });

        console.log("innerText now contains the JSON");
        //console.log(innerText);

        //I will leave this as an excercise for you to
        //  write out to FS...

        await browser.close();
        return innerText
    } catch (err) {
        console.error(err);
    }
}

async function calcChartDate(dataParse){
    try{
        console.log('start write to db')
        console.log('dataParse: ', dataParse)

        //parse only price
        for(let x = 0; x < dataParse.length; x++){
            console.log('json numb: ', x)
            let thisJson = dataParse[x].json
            for(let y = 0; y < thisJson.length; y++){
                dataParse[x].json[y] = thisJson[y][1]
            }
        }

        console.log('check result parse only price: ', dataParse[3].json[20])

        for(let x = 0; x < dataParse.length; x++){
            let thisJsonLength = dataParse[x].json.length
            let thisDateLength = dataParse[x].date.length

            let numbAdd = Math.round((thisJsonLength - thisDateLength) / thisDateLength)
            //console.log('numbAdd: ', numbAdd)
            //console.log("thisDateLength: ", thisDateLength)
            //console.log("thisJsonLength: ", thisJsonLength)
            let iteration = 0

            for(let y = 0; y < thisDateLength; y++){
                iteration++
                for(let z = 0; z <= numbAdd; z++){
                    //console.log("iteration: ", iteration)
                    //console.log('dataParse[x].date: ', dataParse[x].date)
                    dataParse[x].date.splice(iteration, 0, "")
                    iteration++
                    //console.log(' dataParse['+ x +'].data: ',  dataParse[x].date)
                }
            }

        }

        //console.log('check result parse only price: ', dataParse[4].date)
        //console.log('dataParse[4]: ', dataParse[4])
        //console.log('dataParse[4].data.length: ', dataParse[4].date.length)
        //console.log('dataParse[4].json.length: ', dataParse[4].json.length)
        writeChartDate(dataParse)

    } catch (err) {
        console.log('err writeChartDate: ', err)
    }
}

async function writeChartDate(calcDataParse){
    try{
        let check = await GetChart({ name: 'mainChart' } )
        if(check.type == 'success'){
            let update = await UpdateChart({ name: 'mainChart', data: calcDataParse } )
            if(update.type == 'success'){
                console.log('success update calcDataParse')
            } else {
                console.log('ERR update calcDataParse: ', update.data)
            }
        } else {
            let update = await CreateChart({ name: 'mainChart', data: calcDataParse } )
            if(update.type == 'success'){
                console.log('success write CreateChart')
            } else {
                console.log('ERR update CreateChart: ', update.data)
            }
        }
    } catch (err) {
        console.log('ERR writeChartDate: ', err)
    }
}

//скролинг страницы
/*
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight/4) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
*/


ontime({
    cycle: [ '00:00', '20:00', '40:00', '50:00']
}, function (ot) {
    parseTableCrypto()
    ot.done()
    return
})

ontime({
    cycle: [ '35:00']
}, function (ot) {
    parseNews()
    ot.done()
    return
})


ontime({
    cycle: [ '03:00', '13:00', '23:00', '38:00', '43:00', '53:00']
}, function (ot) {
    getMainInfo('https://www.coingecko.com/en/coins/keep-network')
    ot.done()
    return
})


ontime({
    cycle: [ '05:00', '30:00']
}, function (ot) {
    getChartData('https://www.coingecko.com/en/coins/keep-network')
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
