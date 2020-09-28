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


const Chart = sequelize.define('chart', {
    name: {
        type: Sequelize.TEXT
    },
    data: {
        type: Sequelize.JSON
    }
})


sequelize.sync().then((result) => {
    console.log('result sync: ', result)
})
    .catch(err => console.log(err))


const CreateChart = async function (data) {
    try {
        const result = await Chart.create({
            name: data.name,
            data: data.data
        })
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error CreateChart: ', err)
        return { type: 'error', data: err }
    }
}

async function GetAllChart () {
    try {
        let result = await Chart.findAll({ raw: true })
        if (!result){
            console.log('error get all Chart')
            return { type: 'error', data: e }
        }
        console.log('get Chart length: ', result.length)
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error GetAllChart: ', err)
        return { type: 'error', data: err }
    }
}


async function GetChart (data) {
    try{
        let result = await Chart.findAll({ where: {
                name: data.name
            },
            raw: true
        })

        console.log('GetChart on name: ', result)

        if(result && result.length > 0){
            console.log('GetChart on name success')
            return { type: 'success', data: result }
        } else {
            return { type: 'error', message: 'Chart not found' }
        }

    } catch (err) {
        return { type: 'error', message: err }
    }
}


async function UpdateChart (data) {
    try {
        const resultUpdate = await Chart.update({
            data: data.data
        }, {
            where: {
                name: data.name
            },
            returning: true,
            plain: true
        })
        if (!resultUpdate) {
            console.log('error_1 UpdateChart: ', data.name)
            return { type: 'error', data: 'error update in db'}
        } else {
            console.log('success update Chart: ', data.name)
            console.log('resultUpdate: ', resultUpdate)
            return { type: 'success', data: data  }
        }
    } catch (err) {
        console.log('error UpdateChart: ', err)
        return { type: 'error', data: err }
    }
}


exports = module.exports = {
    CreateChart,
    GetAllChart,
    GetChart,
    UpdateChart
}
