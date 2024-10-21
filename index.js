import express from 'express';
import session from 'express-session'
import connectToMongo from './connectDb.js';
import User from './models/User.js'
import dotenv from 'dotenv';
// import {FileURLToPath} from 'url';
// import { dirname } from 'path';
// import bodyParser from 'body-parser';

const app = express();
const port = 3000;


dotenv.config()


app.use(session({
    secret: process.env.SECRET, // A secret key used to sign the session ID cookie
    resave: true,             // Don't save session if unmodified
    saveUninitialized: false,   // Save uninitialized session
    cookie: { secure: false }  // Use true if you're using HTTPS
}));

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));

connectToMongo();


// Setting static files location
app.use(express.static('public'));


let posts = [];

// Render the index.ejs file
app.get('/', (req, res) => {
    if(!req.session.email){
        res.redirect('/login')
    }
    else{
      res.render('index.ejs', { posts })
    }
});

// Render the new.ejs file
app.get('/new', (req, res) => {
    res.render('new.ejs');
});

// Handle new post creation
app.post('/new', (req, res) => {
    const { title, content } = req.body;
    posts.push({ title, content });
    res.redirect('/');
});

// handle to edit the post
app.get('/edit/:id', (req, res)=>{
    const id = req.params.id;
    res.render('edit.ejs', {post: posts[id], id});
})

// handle the save in post
app.post('/edit/:id', (req, res)=>{
    const id = req.params.id
    const {title, content} = req.body;
    posts[id] = {title, content};
    res.redirect('/');
})

// handle to delete the post
app.post('/delete/:id', (req, res)=>{
    const id = req.params.id
    posts.splice(id, 1);
    res.redirect('/');
})

// Redirect logic of User profile page
app.get('/profile', (req, res)=>{
    if(!req.session.email){
        return res.status(401).redirect('/login');
    }
    else{
      res.render('profile.ejs', {name: req.session.name, email: req.session.email, password: req.session.password})
    }
})

// Login/Signup page
app.get('/login', (req, res)=>{
    res.render('login.ejs')
})

app.get('/signup', (req, res)=>{
    res.render('signup.ejs')
})

// Signup Route
app.post('/api/v1/signup', async (req, res) => {
    // Access form data (req.body contains form fields)

    const { name, email, password } = req.body;

    // Check if user already exists
   const user = await User.findOne( { email } )
   if(user){
       return res.status(400).send('User already exists');
   }

   // Create new user save it to db
   const newUser = new User( { name, email, password });
   await newUser.save();

   // Automatically log the user in (create session)
   req.session.name = newUser.name;
   req.session.email = newUser.email;
   req.session.password = newUser.password;

   res.redirect('/profile');
});

// Login route
app.post('/api/v1/login', async (req,res)=>{
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne( { email });
    if(!user){
        return res.status(400).send('Invalid username or password');
    }

    if(user.password !== password){
        return res.status(400).send('Invalid username or password');
    }

    req.session.name = user.name;
    req.session.email = user.email;
    req.session.password = user.password;
    res.redirect('/profile');
})

app.post('/api/v1/logout', async (req, res)=>{
    req.session.destroy(err=>{
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');
    })
})

// Start the server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
