import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import noteServiceAll from './services/notes';

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [errorMessage, setErrorMessage] = useState(null);


  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const hook = () => {
    noteServiceAll.getAll().then(initialNotes => { setNotes(initialNotes) })
  }

  useEffect(hook, []);

//mark important for each note
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteServiceAll.update(id, changedNote)
      .then(returnedNote => {
        console.log(returnedNote)
        setNotes(returnedNote)
      }).catch(error => {
        setErrorMessage(
          `Note "${note.content}" was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000)
        setNotes(notes.filter(n => n.id !== id));
      })
  }

  //error message when the use tried to toggle the importance of a deleted note
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className="error">
        {message}
      </div>
    )
  }

//adding new note
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote
    }
    noteServiceAll
      .create(noteObject)
      .then(returnedNote => {
        setNotes(returnedNote)
        setNewNote('')
      })
  }

//Creating footer component 
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2021</em>
    </div>
  )
}

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      
      <ul>
        {notes.map((note, index) =>
          <Note key={index} note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>

      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      
      <Footer />
    </div>
  )
}


export default App;
