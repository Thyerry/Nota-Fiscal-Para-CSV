const puppeteer = require('puppeteer')
const { exportCsv } = require('./exportCsv')

module.exports.getGroceryList = async (códigoDaNota) => {
    async function getPurchaseDate(page) {
        const textInfo = (await page.$eval('#infos ', textInfo => textInfo.innerText)).split('Data de Emissão: ')[1]
        const dateText = textInfo.substring(0, 10)
        const day = dateText.substring(0, 2)
        const month = dateText.substring(3, 5)
        const year = dateText.substring(6, 10)
        const date = `${year}-${month}-${day}`
        return date
    }
    async function getItems(page, purchaseDate) {
        const groceryListElement = await page.$$('#tabResult tbody tr')
        const groceryList = []
        for (let i = 0; i < groceryListElement.length; i++) {
            const name = await groceryListElement[i].$eval('td .txtTit', name => name.innerText)
            const quantity = (await groceryListElement[i].$eval('td p .Rqtd', quantity => quantity.innerText)).split(': ')[1]
            const measure = (await groceryListElement[i].$eval('td p .RUN', measure => measure.innerText)).split(': ')[1]
            const price = (await groceryListElement[i].$eval('td p .RvlUnit', price => price.innerText)).split(': ')[1]
            const value = parseFloat((await groceryListElement[i].$eval('.txtTit p .valor', value => value.innerText)).replace(',', '.'))
            groceryList.push({ name, quantity, measure, price, value, purchaseDate })
        }
        return groceryList
    }

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(
        'http://nfce.sefaz.pe.gov.br/nfce-web/consultarNFCe?p='+códigoDaNota,
        { timeout: 50000 }
    )
    await page.waitForSelector('#tabResult', { timeout: 3000 }).catch(() => console.log('deu ruim aí com a internet'))
    const purchaseDate = await getPurchaseDate(page)
    const groceryList = await getItems(page, purchaseDate)
    await browser.close()
    exportCsv(groceryList)
    return true
}
