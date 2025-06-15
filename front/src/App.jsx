import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'


function App() {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note')
  const [showAll, setShowAll] = useState(true)
  const [msg, setMsg] = useState('')
  const notesToShow=showAll ? notes : notes.filter((note) => note.important)

// GET - fetch data from server
  useEffect(() => {
    noteService
      .getAllNotes()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  if(!notes){
    return null
  }

// POST - add new note to server
  function addNote(e) {
    e.preventDefault()    
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
// leting server generate ids
//      id: String(notes.length + 1)
    }
    noteService
      .createNote(noteObject) 
      .then(returnedNote =>{
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  function handleChange(e) {
   setNewNote(e.target.value) 
  }

  function toggleImportanceOf(id) {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}
// PUT - to change/update property of note
    noteService
      .updateNote(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote: note)))
      })
      .catch(error => {
        setMsg(
          `Note ${note.content} was already deleted from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={msg} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note 
            key={note.id}
            note={note}     
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
