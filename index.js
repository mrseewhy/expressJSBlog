const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/realblog')

const realBlogSchema = new Schema ({
    title: String, 
    url: String,
    body: String
})

const Blog = mongoose.model('Blog', realBlogSchema)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended:true}))



app.get('/', (req, res)=>{
    res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            res.redirect('/blogs/new')
        } else{
            res.render('index', {blogs})
        }
    })
})

app.get('/blogs/new', (req, res) => res.render('new'))

app.post('/blogs', (req, res)=> {
    const newBlog = req.body
    Blog.create(newBlog, (err, blog) => {
        if(err){
            res.redirect('/blogs/new')
        }else{
            res.redirect('/blogs')
        }
    })
})

app.get('/blogs/:id', (req, res) => {
    const blogId = req.params.id
    Blog.findById(blogId, (err, blog)=>{
        if(err){
            res.redirect('/blogs/new')
        }else {
            res.render('show', {blog})
        }
    })
})

app.get('/blogs/:id/edit', (req, res) => {
    const blogId = req.params.id
    Blog.findById(blogId, (err, blog)=>{
        if(err){
            res.redirect('/blogs/new')
        }else {
            res.render('edit', {blog})
        }
    })
})

app.put('/blogs/:id', (req, res) => {
    const blogId = req.params.id
    const newBlog = req.body
    Blog.findByIdAndUpdate(blogId, newBlog, (err, blog)=>{
        if(err){
            res.redirect('/blogs/new')
        }else {
            res.redirect('/blogs/'+blogId)
        }
    })
})

app.delete('/blogs/:id', (req, res) => {
    const blogId = req.params.id
    Blog.findByIdAndRemove(blogId, (err, blog)=>{
        if(err){
            res.redirect('/blogs/new')
        }else {
            res.redirect('/blogs')
        }
    })
})



app.listen(8000, ()=> console.log('Server Started'))