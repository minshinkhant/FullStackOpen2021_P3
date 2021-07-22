import React from 'react'

const Note = ({ note, toggleImportance }) => {
    const label = note.important
        ? 'make not important' : 'make important'
    return (
        <li className='note'>
            <p>{note.content} <button onClick={toggleImportance}>{label}</button></p>
        </li>
    )
}

export default Note;