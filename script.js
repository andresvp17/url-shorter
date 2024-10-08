import { ResourcesError } from './error.js'
 
const form = document.getElementById('form')
const table = document.querySelector('table')
const tableBody = document.getElementById('table')
const spiner = document.getElementById('spinner')

const getUrls = async () => {
    let html = ''

    try {
        table.style.display = 'none'
        spiner.style.display = 'block'     

        const urls = await fetch('https://url-shorter-production-3772.up.railway.app')

        if (!urls.ok) {
            throw new ResourcesError('The Urls could not be retrieved')
        }

        const { urls: urlsToRender } = await urls.json()

        urlsToRender.forEach(({ fullUrl, shortUrl, alias }) => {
            html += `
            <tr class="tableRow">
                <td><a target="_blank" href="${fullUrl}">${fullUrl}</a></td>
                <td><a target="_blank" href="https://url-shorter-production-3772.up.railway.app/${shortUrl}">${'/' + shortUrl}</a></td>
                <td>${alias}</td>
            </tr>
            `
        })

        spiner.style.display = 'none'
        table.style.display = 'block'
        tableBody.innerHTML = html
    } catch (error) {
        if (error instanceof ResourcesError) {
            table.style.display = 'block'
            tableBody.innerHTML = `
                <h2>Error loading the resources. Try to refresh the page</h2>
            `
        }
    }
}

form.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const formData = new FormData(form)
    const input = formData.get('link')
    const alias = formData.get('alias')

    try {
        await fetch('https://url-shorter-production-3772.up.railway.app/', {
            method: 'POST',
            body: JSON.stringify({
                fullUrl: input,
                alias
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        
        await getUrls()
    } catch (error) {
        if (error instanceof ResourcesError) {
            tableBody.innerHTML = `
                <h2>Error loading the resources. Try to refresh the page</h2>
            `
        }
    }
})

await getUrls()