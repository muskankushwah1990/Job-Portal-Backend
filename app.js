const express = require("express")
const app = express();
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv') //start localhost:4000
dotenv.config({path: './.env'})
const connectDb = require("./db/connectDb")
connectDb();
const web = require("./routes/web")
const cors = require('cors');
const fileUpload = require("express-fileupload");





app.use(cors())


app.use(cookieParser())

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir: '/tmp'
}))





app.use("/api", web)


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT Localhost: ${process.env.PORT}`)
})