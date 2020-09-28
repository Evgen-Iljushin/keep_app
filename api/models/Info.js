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


const Info = sequelize.define('info', {
    name: {
        type: Sequelize.TEXT
    },
    data: {
        type: Sequelize.TEXT
    }
})


sequelize.sync().then((result) => {
    console.log('result sync: ', result)
})
    .catch(err => console.log(err))


const CreateInfo = async function (data) {
    try {
        const result = await Info.create({
            name: data.name,
            data: data.data
        })
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error CreateInfo: ', err)
        return { type: 'error', data: err }
    }
}

async function GetAllInfo () {
    try {
        let result = await Info.findAll({ raw: true })
        if (!result){
            console.log('error get all Info')
            return { type: 'error', data: e }
        }
        console.log('get Info length: ', result.length)
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error GetAllInfo: ', err)
        return { type: 'error', data: err }
    }
}


async function GetInfo (data) {
    try{
        let result = await Info.findAll({ where: {
                name: data.name
            },
            raw: true
        })

        console.log('GetInfo on name: ', result)

        if(result && result.length > 0){
            console.log('GetInfo on name success')
            return { type: 'success', data: result }
        } else {
            return { type: 'error', message: 'Info not found' }
        }

    } catch (err) {
        return { type: 'error', message: err }
    }
}


async function UpdateInfo (data) {
    try {
        const resultUpdate = await Info.update({
            data: data.data
        }, {
            where: {
                name: data.name
            },
            returning: true,
            plain: true
        })
        if (!resultUpdate) {
            console.log('error_1 UpdateInfo: ', data.name)
            return { type: 'error', data: 'error update in db'}
        } else {
            console.log('success update Info: ', data.name)
            console.log('resultUpdate: ', resultUpdate)
            return { type: 'success', data: data  }
        }
    } catch (err) {
        console.log('error UpdateInfo: ', err)
        return { type: 'error', data: err }
    }
}


exports = module.exports = {
    CreateInfo,
    GetAllInfo,
    GetInfo,
    UpdateInfo
}
