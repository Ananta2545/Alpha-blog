import express from 'express';
// import {FileURLToPath} from 'url';
// import { dirname } from 'path';
// import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));

// Setting static files location
app.use(express.static('public'));

let posts = [];

// Render the index.ejs file
app.get('/', (req, res) => {
    res.render('index.ejs', { posts });
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

// Start the server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
