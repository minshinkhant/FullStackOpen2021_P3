import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import contactService from './services/contacts';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newMessage, setNewMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  //using react hooks to fetch data from server 3001
  const hook = () => {
    //console.log('effect');
    contactService.getAll().then(initialContact => (setPersons(initialContact)));
  }

  useEffect(hook, []);
  //console.log("render", persons.length, "persons");

  //search contact with the filter name
  const filterPersons = persons.filter(person => {
    return person.name.toLowerCase().includes(newFilter.toLowerCase());
  })

  //adding new contact to the phone book
  const addPerson = (event) => {
    event.preventDefault();
    const personsObject = {
      name: newName,
      number: newNumber,
    };
    //check the contact is already in the phonebook
    if (persons.find((item) => item.name === personsObject.name)) {
      //confirm to replace old contact with new contact
      if (window.confirm(`${newName} is already added to phonebook, 
      replace the old number with the new one?`)) {
        //find the id of old contact and add id to the updated contact
        personsObject.id = persons.find((item) => item.name === personsObject.name).id;
        contactService.update(personsObject.id, personsObject)
          .then((returnedContact) => {
            setNewName("");
            setNewNumber("");
            setNewMessage(
              `Updated ${returnedContact.name}`
            )
            setTimeout(() => {
              setNewMessage(null);
              window.location.reload();
            },5000)
          }).catch(error => {
            setErrorMessage(
              `Information of ${personsObject.name} has already 
              been removed from server`
            )
            console.log(error)
            setTimeout(() => {
              setErrorMessage(null);
              window.location.reload();
            }, 3000)
          })
      }
    }
    //if not, adding contact to the backend server
    else {
      //adding id for the new contact
      personsObject.id = persons.length + 1;
      //create new contact with contactService
      contactService.create(personsObject)
        .then(returnedContact => {
          console.log(returnedContact)
          setPersons(persons);
          setNewName("");
          setNewNumber("");
          setNewMessage(
            `Added ${personsObject.name}`
          )
          setTimeout(() => {
            setNewMessage(null);
            window.location.reload();
          },5000)
        })
    }

  }

  //notification when new contact added
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

  return (
    <div className="main_div">
      <h1 className="header_div">Phonebook</h1>
      <Notification message={newMessage} />
      <Notification message={errorMessage} />
      <Filter newFilter={newFilter}
        handleFilterChange={handleFilterChange} />

      <h2 className="header_div">Add a new contact</h2>
      <PersonForm addPerson={addPerson}
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2 className="header_div">Contacts</h2>
      <Persons filterPersons={filterPersons} deleteContact={contactService.deleteContact} />

    </div>
  )
}

export default App
