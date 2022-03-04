const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');

const initializePassport = require('./passport-config');
initializePassport(passport,email => users.find(user=>user.email===email),id =>users.find(user=>user.id===id));

const users = [];

app.use(session({
    secret:'notagoodsecret',
    resave:false,
    saveUninitialized:true
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:true}));
app.use('/static',express.static(path.join(__dirname,'public')));
app.use((req,res,next)=>
{
    res.locals.success = req.flash('success');
    next();
})
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>
{
    res.render('index.ejs');
})
app.get('/register',(req,res)=>
{
    res.render('register.ejs');
})
app.get('/login',(req,res)=>
{
    res.render('login.ejs');
})
app.post('/register',async (req,res)=>
{
    const {name,email,password} = req.body;
    try
    {
        const hashedPassword = await bcrypt.hash(password,10);
        users.push({
            id: Date.now().toString(),
            name:name,
            email:email,
            password:hashedPassword
        })
        console.log(users);
        req.flash('success','Registered Successfully!!!');
        res.redirect('/login');
    }
    catch{
        console.log("Error");
        res.redirect('/register');
    }
})
app.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}))
app.listen(3000,()=>
{
    console.log('Listening On Port 3000')
})