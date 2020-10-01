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


const News = sequelize.define('news', {
    title: {
        type: Sequelize.TEXT
    },
    url: {
        type: Sequelize.TEXT
    },
    description: {
        type: Sequelize.TEXT
    },
    author: {
        type: Sequelize.TEXT
    },
    date: {
        type: Sequelize.TEXT
    },
    timeRead: {
        type: Sequelize.TEXT
    },
    backgroundImage: {
        type: Sequelize.TEXT
    },
    html: {
        type: Sequelize.TEXT
    },
    lang: {
        type: Sequelize.TEXT
    }
})


sequelize.sync().then((result) => {
    console.log('result sync: ', result)
})
    .catch(err => console.log(err))


const CreateNews = async function (data) {
    try {
        const result = await News.create({
            title: data.title,
            url: data.url,
            description: data.description,
            author: data.author,
            date: data.data,
            timeRead: data.timeRead,
            backgroundImage: data.backgroundImage,
            html: data.html,
            lang: data.lang
        })
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error CreateNews: ', err)
        return { type: 'error', data: err }
    }
}

async function GetAllNews () {
    try {
        let result = await News.findAll({ raw: true })
        if (!result){
            console.log('error GetAllNews')
            return { type: 'error', data: 'news not find' }
        }
        console.log('get GetAllNews length: ', result.length)
        return { type: 'success', data: result }
    } catch (err) {
        console.log('error GetAllNews: ', err)
        return { type: 'error', data: err }
    }
}


async function GetNews (data) {
    try{
        let result = await News.findAll({ where: {
                url: data.url
            },
            order: [ [ 'createdAt', 'DESC' ]],
            raw: true
        })

        console.log('GetNews on name: ', result)

        if(result && result.length > 0){
            console.log('GetNews on name success')
            return { type: 'success', data: result }
        } else {
            return { type: 'error', message: 'GetNews not found' }
        }

    } catch (err) {
        return { type: 'error', message: err }
    }
}


async function UpdateNews (data) {
    try {
        const resultUpdate = await News.update({
            html: data.html
        }, {
            where: {
                url: data.url
            },
            returning: true,
            plain: true
        })
        if (!resultUpdate) {
            console.log('error_1 UpdateNews: ', data.name)
            return { type: 'error', data: 'error update in db'}
        } else {
            console.log('success update news: ', data.name)
            console.log('resultUpdate: ', resultUpdate)
            return { type: 'success', data: data  }
        }
    } catch (err) {
        console.log('error UpdateNews: ', err)
        return { type: 'error', data: err }
    }
}

exports = module.exports = {
    CreateNews,
    GetAllNews,
    GetNews,
    UpdateNews
}
