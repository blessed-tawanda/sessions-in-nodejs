const express = require('express')
const session = require('express-session')
const config = require('./server.config')
const bodyParser = require('body-parser')

app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
  name: 'sid',
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.calculateHours(1),
    sameSite: true,
    secure: false 
  }
}))

const users = [
  {id:1, name: 'blessed', email: 'bl@bmw.com', password: 'mypassword'},
  {id:2, name: 'tawanda', email: 't@bmw.com', password: 'mypass'}
]

const redirectLogIn = (req,res,next) => {
  if(!req.session.userId) {
    res.redirect('/login')
  } else {
    next()
  }
}

const redirectHome = (req,res,next) => {
  if(req.session.userId) {
    res.redirect('/home')
  } else {
    next()
  }
}

app.get('/', (req,res) => {
  const {userId} = req.session
  res.send(`
  <h1>Welcome</h1>
  ${userId ? `
  <a href='/home'>Home</a>
  <form method='post' action='/logout'>
  <button>LogOut</button>
  </form>
  `: `
  <a href='/login'>LogIn</a>
  <a href='/register'>Register</a>
  ` }
  `)
})

app.get('/home', redirectLogIn ,(req,res) => {
  res.send(`
    <h1>Home</h1>
    <a href='/'> Main </a>
    <ul>
      <li>Name: </li>
      <li>Email: </li>
    </ul>
  `)
})


app.get('/login', redirectHome ,(req,res) => {
  res.send(`
  <h1> LogIn </h1>
  <form method='post' action='/login'>
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' required />
    <input type='submit' value='LogIn' />
  </form>
  <a href='/register'> Register </a>
  `)
})

app.get('/register', redirectHome,(req,res) => {
  res.send(`
  <h1> LogIn </h1>
  <form method='post' action='/register'>
    <input type='text' name='name' placeholder='Email' required />
    <input type='email' name='email' placeholder='Email' required />
    <input type='password' name='password' required />
    <button type='Submit'>Register</button
  </form>
  <a href='/login'> LogIn </a>
  `)
})

app.post('/login', redirectHome ,(req,res) => {
  const {email, password} = req.body

  if(email && password) {
    const user = users.find(
      user => user.email === email && user.password === password
    )

    if(user) {
      req.session.userId = user.id
      return res.redirect('/home')
    }
  }

  res.redirect('/login')
})

app.post('/register', redirectHome ,(req,res) => {
  const {name, email, password} = req.body

  if(name && email && password) {
    const exists = users.some(
      user => user.email = email
    )

    if(!exists) {
      const user = {
        userId: users.length + 1,
        name,
        email,
        password
      }

      users.push(user)

      req.session.userId = userId

      return res.redirect('/home')
    }
  }

  res.redirect('/register')
})

app.post('/logout', redirectLogIn ,(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return res.redirect('/home')
    }

    res.clearCookie('sid')
    res.redirect('/login')    
  })
})


app.listen(config.PORT, ()=> {
  console.log(`Server running on ${config.PORT}`)
})
