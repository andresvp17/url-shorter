import express from 'express'
import cors from 'cors'
import { DataBaseConnection } from './db/db.js'
import { ShortModel } from './model/model.js'

export class Server {
    constructor(port, dbService) {
        this.port = port
        this.dbService = dbService
        this.express = express()
        this.startServer()
        this.setUpMiddleware()
    }

    async startServer() {
        this.express.listen(this.port, '0.0.0.0', () => {
            console.log('Server Running' + ' ' + this.port)
        })
        await this.dbService.connect()
    }

    setUpMiddleware () {
        this.express.use(cors({ methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
    }
}

const app = new Server(process.env.PORT ?? 5641, DataBaseConnection)

app.express.get('/', async (req, res) => {
    const urls = await ShortModel.find({})
    return res.json({ urls })
})

app.express.post('/', async (req, res) => {
    const { fullUrl, alias } = req.body
    if (!fullUrl.startsWith('https://')) {
        return res
        .json({
            message: 'The shortened url must be https'
        })
        .status(400)
    }

    const existingURL = await ShortModel.findOne({ fullUrl })
    const existingAlias = await ShortModel.findOne({ alias })

    if (existingURL) {
        return res
        .status(400)
        .json({
            message: 'This URL is already shortened on the site'
        })
    }

    if (existingAlias) {
        return res
        .status(400)
        .json({
            message: 'This Alias is already used in a URL'
        })
    }

    try {
        const newUrl = new ShortModel({ fullUrl, alias })
        const savedProduct = await newUrl.save()

        return res.status(201).json(savedProduct)
    } catch (error) {
        console.log(error)
    }
})

app.express.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortModel.findOne({ shortUrl: req.params.shortUrl })

    if (shortUrl == null) return res.sendStatus(404)

    res.redirect(shortUrl.fullUrl)
})