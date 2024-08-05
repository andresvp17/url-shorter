import mongoose from "mongoose";
import { randomURL } from '../lib/utils.js'

const shortUrlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: randomURL()
    }
})

shortUrlSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

export const ShortModel = mongoose.model('ShortUrl', shortUrlSchema) 