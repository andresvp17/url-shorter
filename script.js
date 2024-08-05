import { ResourcesError } from './error.js'
 
const form = document.getElementById('form')
const tableBody = document.getElementById('table')
const formData = new FormData(form)

const getUrls = async () => {
    let html = ''
    try {
        const urls = await fetch('http://localhost:5641/')

        if (!urls.ok) {
            throw new ResourcesError('The Urls could not be retrieved')
        }

        const { urls: urlsToRender } = await urls.json()

        urlsToRender.forEach(({ fullUrl, shortUrl }) => {
            html += `
            <tr class="tableRow">
                <td><a target="_blank" href="${fullUrl}">${fullUrl}</a></td>
                <td><a target="_blank" href="http://localhost:5641/${shortUrl}">${'/' + shortUrl}</a></td>
            </tr>
            `
        })

        tableBody.innerHTML = html
    } catch (error) {
        if (error instanceof ResourcesError) {
            tableBody.innerHTML = `
                <h2>Error loading the resources. Try to refresh the page</h2>
            `
        }
    }
}

form.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const input = formData.get('link')

    try {
        await fetch('http://localhost:5641/', {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        getUrls()
    } catch (error) {
        console.log(error)
    }
})

getUrls()