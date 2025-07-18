import express from 'express'
import "dotenv/config"
import dbConn from './config/db.js'
import { bootstrap } from './app.js'
const app = express()
const port = 3000
bootstrap(app)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))