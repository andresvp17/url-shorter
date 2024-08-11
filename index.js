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
    }

    async startServer() {
        this.express.listen(this.port, '0.0.0.0', () => {
            console.log('Server Running' + ' ' + this.port)
        })
        await this.dbService.connect()
    }

    setUpMiddleware () {
        this.express.use(cors({
            origin: 'https://url-shorter-sigma.vercel.app'
        }))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
    }
}

const app = new Server(process.env.PORT ?? 5641, DataBaseConnection)

app.express.options('/', cors())

app.express.get('/', async (req, res) => {
    const urls = await ShortModel.find({})

    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.json({ urls })
})

app.express.post('/', async (req, res) => {
    const { fullUrl } = req.body

    if (!fullUrl.startsWith('https://')) {
        return res.json({
            message: 'The shortened url must be https'
        }).statusCode(400)
    }

    const existingURL = await ShortModel.findOne({ fullUrl: fullUrl })

    if (existingURL) {
        return res
        .status(400)
        .json({
            message: 'This URL is already shortened on the site'
        })
    }

    try {
        const newUrl = new ShortModel({ fullUrl: req.body.fullUrl })
        const savedProduct = await newUrl.save()

        req.header('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Origin', '*')

        return res.status(201).json(savedProduct)
    } catch (error) {
        console.log(error)
    }
})

app.express.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortModel.findOne({ shortUrl: req.params.shortUrl })

    if (shortUrl == null) return res.sendStatus(404)

    res.setHeader('Access-Control-Allow-Origin', '*')

    res.redirect(shortUrl.fullUrl)
})