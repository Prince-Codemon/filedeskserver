const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./config/db')   
const app = express()
const PORT = process.env.PORT || 5000
const path = require('path')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/uploads", express.static(path.resolve("uploads")));

db()

app.get('/',(req,res)=>{
    res.send('Hello World')
}
)

app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/shop',require('./routes/shopRoutes'))
app.use('/file',require('./routes/pdfRouter'))


app.listen(PORT,()=>console.log(`Listening on => http://localhost:`,PORT))