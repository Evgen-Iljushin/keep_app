const Sequelize = require('sequelize')
const sequelize = new Sequelize('keep_app', process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost',
    port: process.env.MYSQL_PORT
})


const getDate = async function () {
    const date = new Date()
    let month = ''
    let day = ''
    if (Number((date.getMonth() + 1)) < 10) {
        month = '0' + (date.getMonth() + 1)
    } else {
        month = date.getMonth() + 1
    }
    if (Number(date.getDate()) < 10) {
        day = '0' + date.getDate()
    } else {
        day = date.getDate()
    }
    const dateNow = date.getFullYear() + '-' + month + '-' + day + ''
    return dateNow
}


const Crypto = sequelize.define('crypto', {
    name: {
        type: Sequelize.TEXT
    },
    url: {
        type: Sequelize.TEXT
    },
    pair: {
        type: Sequelize.TEXT
    },
    addressPair: {
      type: Sequelize.TEXT
    },
    price: {
        type: Sequelize.TEXT
    },
    priceETH: {
        type: Sequelize.TEXT
    },
    _24hVolume: {
        type: Sequelize.TEXT
    },
    trust: {
        type: Sequelize.TEXT
    }
})


sequelize.sync().then((result) => {
    console.log('result sync: ', result)
})
    .catch(err => console.log(err))


const CreateCrypto = async function (data) {
    try {
        const result = await Crypto.create({
            name: data.name,
            pair: data.pair,
            addressPair: data.addressPair,
            url: data.url,
            price: data.price,
            priceETH: data.priceETH,
            _24hVolume: data._24hVolume,
            trust: data.trust
        })
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error CreateCrypto: ', err)
        return { type: 'error', data: err }
    }
}

async function GetAllCrypto () {
    try {
        let result = await Crypto.findAll({ raw: true })
        if (!result){
            console.log('error get all Crypto')
            return { type: 'error', data: e }
        }
        console.log('get Crypto length: ', result.length)
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error GetAllEvent: ', err)
        return { type: 'error', data: err }
    }
}


async function GetCrypto (data) {
    try{
        let result = await Crypto.findAll({ where: {
                name: data.name,
                pair: data.pair
            },
            order: [ [ 'createdAt', 'DESC' ]],
            raw: true
        })

        console.log('GetCrypto on name: ', result)

        if(result && result.length > 0){
            console.log('GetCrypto on name success')
            return { type: 'success', data: result }
        } else {
            return { type: 'error', message: 'Crypto not found' }
        }

    } catch (err) {
        return { type: 'error', message: err }
    }
}


async function UpdateCrypto (data) {
    try {
        const resultUpdate = await Crypto.update({
            price: data.price,
            priceETH: data.priceETH,
            _24hVolume: data._24hVolume,
            trust: data.trust,
            url: data.url
        }, {
            where: {
                name: data.name,
                pair: data.pair
            },
            returning: true,
            plain: true
        })
        if (!resultUpdate) {
            console.log('error_1 UpdateCrypto: ', data.name)
            return { type: 'error', data: 'error update in db'}
        } else {
            console.log('success update crypto: ', data.name)
            console.log('resultUpdate: ', resultUpdate)
            return { type: 'success', data: data  }
        }
    } catch (err) {
        console.log('error UpdateCrypto: ', err)
        return { type: 'error', data: err }
    }
}


exports = module.exports = {
    CreateCrypto,
    GetAllCrypto,
    GetCrypto,
    UpdateCrypto
}
