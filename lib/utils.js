import cors from 'cors'

export const randomURL = () => Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5)

export const ERROR_NAMES = {
    requestError: 'Request Error',
    resourcesError: 'Resources Error'
}

const ACCEPTED_ORIGINS = [
    'https://url-shorter-sigma.vercel.app/',
    'https://localhost:3000/',
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
    return cors({
      origin: (origin, callback) => {
        if (acceptedOrigins.includes(origin) || !origin) {
          return callback(null, true)
        }
  
        if (!origin) {
          return callback(null, true)
        }
  
        return callback(new Error('Not allowed by CORS'))
      }
    })
  }
  