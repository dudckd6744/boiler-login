var express = require('express');
var app = express();
const bodyparser = require('body-parser');
const {User} = require('./models/User');
const { auth } = require('./middleware/auth');
const config = require('./config/key');
const cookieParser = require('cookie-parser');


app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());
app.use(cookieParser());
//몽고디비 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{ 
    useNewUrlParser:true,  useUnifiedTopology:true, useCreateIndex:true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/api/hello', (req,res) => {
  res.send('hellow')
})

app.get('/', (req,res) => {
    res.send('hellow')
})

app.post('/api/users/register', (req,res)=> {

  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  //요청된 이메일을 데이터베이스에 있는지 찾음
  User.findOne({ email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginsuccess: false,
        message: "해당하는 유저가 없습니다!"
      })
    }
  //요청된 이메일이 데이터베이스에 이다면 비밀번호가맞는 비번인지 확인

    user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch)
    return res.json({ loginsuccess: false, message : "비밀번호가 틀렸습니다!"})


  //비번까지 맞다면 토큰을 생성하기.

      user.generateToken((err,user) =>{
        if(err) return res.status(400).send(err);

        // 토큰을 저장한다.
        res.cookie("x_auth", user.token)   
        .status(200)
        .json({loginsuccess: true, userId: user._id})

      })
    })
  })
})

app.get('/api/users/auth',auth , (req,res) => {

  //여기까지 미들웨어를 통과 했다는 이야기는 인증이 트루라는말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) =>{
  User.findOneAndUpdate({_id: req.user._id},
    { token: "" }
    , (err, user) => {
      if(err) return res.json({ success: false, err});
      return res.status(200).send({
        success: true
      })
    })

})

var port = 4000;

app.listen(port, () => console.log(`Example app listening in port ${port}!!`))