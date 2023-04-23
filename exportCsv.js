const fastCsv = require('fast-csv')
const fs = require('fs')
fs.create

module.exports.exportCsv = (groceryList) => {
    const ws = fs.createWriteStream('./'+ Date.now() + '.csv')

    fastCsv
        .write(groceryList, { headers: true, delimiter: ';', quote: `"` })
        .on('finish', () => console.log('Grocery Item List export succeed'))
        .pipe(ws)
}