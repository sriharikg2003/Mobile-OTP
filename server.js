require('dotenv/config');
const mongose = require('mongoose');
// const app = require('./app');
const express = require('express')
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
const  {signUp,verifyOtp} = require('./Controllers/userController');




mongose.connect(process.env.MONGODB_URL_LOCAL)
.then( () => {console.log("Connecion to database succesful");})
.catch( () => {console.log("FAILES: " )});


const port  = process.env.PORT || 3001;

app.listen(port,() =>{
    console.log(port,"Listening successfully")
});

app.get("/",(req,res)=>{
    console.log("Rendering Index file...")
    res.render('index',{isotp : false})
})


app.post("/",signUp);

app.post("/api/user/signup/verify",verifyOtp);


app.get("*",(req,res)=>{
 res.render('index',{isotp : false});   
})