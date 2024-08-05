import mongoose from "mongoose"
import * as dotenv from 'dotenv'

dotenv.config()

let mongooseInstance = null

class MongooseConnection {
    constructor() {
        if (mongooseInstance != null) {
            throw new Error ('You cannot initialize more than one instace!')
        }
        
        mongooseInstance = this
        this.connectionPassword = `mongodb+srv://Andres:${process.env.DB_PASSWORD}@clusterone.imf7u.mongodb.net/Shortener?retryWrites=true&w=majority`
    }

    async connect() {
        await mongoose.connect(this.connectionPassword)
          .then(() => console.log('Sucessfully connected to DataBase'))
    }
}

export const DataBaseConnection = new MongooseConnection()