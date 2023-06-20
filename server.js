require('dotenv/config');
const mongose = require('mongoose');
const app = require('./app');
app.set('view engine', 'ejs');
mongose.connect(process.env.MONGODB_URL_LOCAL)
.then( () => {console.log("Connecion to database succesful");})
.catch( () => {console.log("FAILES: " )});


const port  = process.env.PORT || 3001;

app.listen(port,() =>{
    console.log(port,"Listening successfully")
});

app.get("/",(req,res)=>{
    res.render('index')
})
