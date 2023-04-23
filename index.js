const express = require('express');
const path = require('path');
const { getGroceryList } = require('./getGroceryList');

const app = express()
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
    console.log(req.query.p)
    if(req.query.p)
        getGroceryList(req.query.p)
})

router.get('/:note_id', (req, res) => {
    console.log(req.query)
})

app.use('/', router)
app.listen(3000)
