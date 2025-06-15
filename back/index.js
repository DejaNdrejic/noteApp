require('dotenv').config()
const express = require('express')
const Note = require('./models/note.js')
const cors = require('cors')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

let notes = []

// ROUTES
// ------------------------------------
// root
app.get('/', (req,res) => {
  res.send('<h1>Hello World!</h1>')
})

// notes
app.get('/api/notes', (req,res) => {
  Note.find({}).then(notes => {
    res.json(notes)
    })
  })

 // get specific note
 app.get('/api/notes/:id', (req,res) => {
   Note.findById(req.params.id).then(note => {
     res.json(note)
   })
 })

 // delete note
 app.delete('/api/notes/:id', (req,res) => {
   const id = req.params.id
   notes = notes.filter(note => note.id !== id)
   res.status(204).end()
 })

 // add notes 
 app.post('/api/notes', (req,res) => {
   const body = req.body
   if (!body.content) {
     return res.status(400).json({
       error: 'content missing'
     }) 
   }
   const note = new Note ({
     content: body.content,
     important: body.important || false,
   })
   note.save().then(saved => {
     res.json(saved)
   })
})
 
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
