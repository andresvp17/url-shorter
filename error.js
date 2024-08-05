import { ERROR_NAMES } from './lib/utils.js'

export class RequestError extends Error {
    constructor (message) {
        super(message)
        this.name = ERROR_NAMES.requestError
    }
}

export class ResourcesError extends Error {
    constructor (message) {
        super(message)
        this.name = ERROR_NAMES.resourcesError
    }
}