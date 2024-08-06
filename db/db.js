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
        this.connectionPassword = process.env.DB_CONNECTION_STRING
    }

    async connect() {
        await mongoose.connect(this.connectionPassword)
          .then(() => console.log('Sucessfully connected to DataBase'))
    }
}

export const DataBaseConnection = new MongooseConnection()