export const randomURL = () => 
    Math.random().toString(32).substring(2, 5) + 
    Math.random().toString(32).substring(2, 5)

export const ERROR_NAMES = {
    requestError: 'Request Error',
    resourcesError: 'Resources Error'
}
