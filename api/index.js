

const express=require("express")
const mongoose = require("mongoose")
const cors=require("cors")
require("dotenv").config()
const User=require("./models/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const imageDownloader=require('image-downloader')
const multer=require("multer")
const fs=require("fs")
const app=express()
const bcryptSalt=bcrypt.genSaltSync(10)
const jwtsecret="kdsjvgkfdjgkfgsjfgsdjkgdks"
app.use(express.json())
app.use(cookieParser())

app.use('/uploads',express.static(__dirname + "/uploads"))



app.use(cors({
    credentials:true,
    origin:"http://127.0.0.1:5173"
}))


mongoose.connect(process.env.Mongo_Url)

app.get("/test",(req,res)=>{
    res.json("test ok final kaam h chal rha h")
   
})


app.post("/register",async (req,res)=>{
    const {name,email,password}=req.body
    try{
        const userDoc= await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt ),
        })
            res.json(userDoc)
    }
    catch(err){
        res.status(422).json(err)
    }

})

app.post("/login",async (req,res)=>{
    const {email,password}=req.body

    const userDoc=await User.findOne({email})
    if(userDoc){
       const passOk=bcrypt.compareSync(password, userDoc.password)
       if(passOk){
        jwt.sign({email:userDoc.email, id:userDoc._id, name:userDoc.name}, jwtsecret, {}, (err,token)=>{
            if(err) throw err
            res.cookie("token",token).json(userDoc)
        })
   
       }
       else{
        res.json("not okk")
       }
    }
    else{
        res.json("not found")
    }
})

app.get('/profile',(req,res)=>{
    const {token}=req.cookies
    if(token){
        jwt.verify(token, jwtsecret, {}, (err,user)=>{
if(err) throw err
res.json(user)
        })
    }
    else{
        res.json(null)
    }
    // res.json({token})
})

app.get("/logout",(req,res)=>{
    res.cookie('token', '').json(true)
})




app.post("/upload-by-link",async (req,res)=>{
    const {link}=req.body
    const newName='photo' + Date.now()+ '.jpg';
   await imageDownloader.image({
        url:link,
        dest:__dirname + '/uploads/' +newName,
    })
    res.json(newName)
})

const photosMiddleware=multer({dest:"uploads/"})
app.post("/upload",photosMiddleware.array("photos",100),(req,res)=>{
    const uploadedfiles=[]
for(let i=0;i<req.files.length;i++){
const {path,originalname}=req.files[i];
 const parts= originalname.split(".")
 const ext=parts[parts.length-1]
const newPath=path + "." + ext
fs.renameSync(path, newPath)
let check=uploadedfiles.push(newPath.replace('uploads/',''))

}
   res.json(uploadedfiles)
   console.log(check,"llll")
})

app.listen(4000,()=>{
    console.log("successfully server running on port 4000...")
})

//mongodb+srv://aheerzade:<password>@cluster0.t4bwj7x.mongodb.net/?retryWrites=true&w=majority