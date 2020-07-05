var express = require('express');
var app = express();
const bodyparser = require('body-parser');
const {User} = require('./models/User');
const config = require('./config/key')

app.use(bodyparser.urlencoded({ extended: true }))

app.use(bodyparser.json())

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true,  useUnifiedTopology:true, useCreateIndex:true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))
app.get('/', (req,res) => {
    res.send('hellow')
})

app.post('/register', (req,res)=> {
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})
app.listen(5000, () => console.log(`Example app listening in port 5000!!`))