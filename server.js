require('dotenv').config()
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const mongodb = require('mongodb');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require('path')
var cors = require('cors');
const { hash } = require('bcrypt');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

app.use(express.urlencoded({extended: true}))
app.use(session({secret: process.env.SESSION_CODE, resave: true, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/public', express.static('public'))
app.use(express.json());
app.use(cookieParser())
app.use(helmet())
app.use(cors());

var db
MongoClient.connect(process.env.DB_URL,{useUnifiedTopology: true}, function(err, client){
    if (err) return console.log(err)
    db = client.db('toypj')
    // db.collection('post').insertOne({},(err, result)=>{
    //     console.log('success to insert post')
    // })
    app.listen(process.env.PORT_NUMBER, function(){
        console.log('listening on 8080')
    })
})

app.post('/add', (req,res)=>{
    db.collection('post').insertOne({date: req.body.date, title:req.body.title, writer:req.user.id}, (err, result)=>{
        db.collection('user').updateOne({id: req.user.id},{$inc: {allTask:1}}, (err, result1)=>{
            res.redirect('/list')
        })
    })
})

app.get('/getList', (req, res)=>{
    db.collection('post').find({writer:req.user.id}).toArray((err, result)=>{
        res.send({tasks: result, num: result.length})
    })
})

app.delete('/done/:id', (req, res)=>{
    db.collection('post').deleteOne({_id: new mongodb.ObjectID(req.params.id) }, (err, result)=>{
        res.send('task done')
    })
})

app.delete('/delete/:id', (req, res)=>{
    db.collection('post').deleteOne({_id: new mongodb.ObjectID(req.params.id)}, (err, result)=>{
        res.send('task deleted')
    })
})

app.put('/edit', (req, res)=>{
    db.collection('post').updateOne({_id: new mongodb.ObjectID(req.body._id)},{$set: {title: req.body.title, date: req.body.date}}, (err, result)=>{
        res.redirect('/list')
    })
})

app.post('/register',(req,res)=>{
    db.collection('user').findOne({id:req.body.id},(err, result)=>{
        if (!result){
            const saltRounds = parseInt(process.env.SALT)
            bcrypt.hash(req.body.pw, saltRounds, (err,hash)=>{
                try{
                    db.collection('user').insertOne({id: req.body.id, pw: hash, completedTask:0, allTask:0})
                }
                catch{
                    console.log('err: '+err)
                }
            })
            res.send('register success')
        }
        else{
            res.send('same id')
        }
    })
})

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}),(req,res)=>{
    res.send('signed in')
})

app.get('/logout', (req, res, next) => {
    req.logOut(err => {
      if (err) {
        return next(err);
      } else {
        console.log('로그아웃됨')
      }
    });
  });

app.get('/getData', (req, res)=>{
    db.collection('user').findOne({id: req.user.id},(err,result)=>{
        var all = result.allTask
        var comp = result.completedTask
        res.send({id:req.user.id, all: all, comp: comp})
    })
})

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false
}, function(inputId, inputPw, done){
    db.collection('user').findOne({id: inputId}, (err, result)=>{
        if (err) console.log(err)
        if(!result) return done(null, false, {message: '존재하지 않는 아이디입니다.'})
        bcrypt.compare(inputPw, result.pw, (err, result2)=>{
            try {
                if(result2) {
                    return done(null, result)
                } else {
                    done(null, false, {message:'비밀번호가 맞지 않습니다.'})
                }
            } catch(err) {
                console.log(err);
            }
        })
    })
}))

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    db.collection('user').findOne({id:id}, (err, result)=>{
        done(null,result)
    })
}); 

function Logined(req,res,next){
    if(req.user){
        next()
    }
    else{
        res.send('Not Logined')
    }
}

app.use(express.static(path.join(__dirname, 'todo/build')));

app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, '/todo/build/index.html'));
}); 

app.get('*', Logined,(req, res)=>{
    res.sendFile(path.join(__dirname, '/todo/build/index.html'));
});         