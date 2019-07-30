import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Numbers from './components/Numbers';
import personService from './services/persons';

const InfoNotification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className='info'>
            {message}
        </div>
    )
}

const ErrorNotification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className='error'>
            {message}
        </div>
    )
}

const App = () => {
  const [ persons, setPersons] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ infoMessage, setInfoMessage ] = useState(null);
  const [ errorMessage, setErrorMessage ] = useState(null);

  useEffect(() => {
      personService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
      event.preventDefault();
      const personObject = {
          name: newName,
          number: newNumber
      }
      
      const alreadyExists = persons.find(function(element) {
          return element.name === personObject.name && element.number === personObject.number;
      });

      const differentNumber = persons.find(function(element) {
        return element.name === personObject.name && element.number !== personObject.number;
      });

      if (!alreadyExists && !differentNumber) {
        personService
        .create(personObject)
        .then(returnedPersons => {
            setPersons(persons.concat(returnedPersons))
            setNewName('');
            setNewNumber('');
            setInfoMessage(
                `Added ${personObject.name}`
              )
              setTimeout(() => {
                setInfoMessage(null)
              }, 5000)
        })
        .catch(error => {
            setErrorMessage(`Couldn't add ${personObject.name}`)
            setTimeout(() => {
                setInfoMessage(null)
            }, 5000)
        });
      }

      else if (alreadyExists) {
        window.alert(`${newName} is already added to phonebook`);
        return;
      }

      
      else if (differentNumber) {
        const message = `${newName} is already added to phonebook, replace the old number with a new one?` 
        const askForUpdate = window.confirm(message);

        if (askForUpdate) {
            const person = persons.find(p => p.name === personObject.name);
            const changedPerson = { ...person, number: personObject.number }
            personService
            .update(person.id, changedPerson)
            .then(returnData => {
                setPersons(persons.map(p => p.id !== person.id ? p : returnData));
                setNewName('');
                setNewNumber('');
                setInfoMessage(
                    `Edited ${personObject.name}'s number`
                  )
                  setTimeout(() => {
                    setInfoMessage(null)
                  }, 5000)
            })
            .catch(error => {
                const newPersons = persons.filter(p => p.id !== person.id); 
                setPersons(newPersons);
                setErrorMessage(`Couldn't edit ${personObject.name}'s number, because name didn't exist on the server`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            });
        }
    }
  }

  const removePerson = (id, name) => {
      const message = `Delete ${name} ?` 
      let result = window.confirm(message);
      const removedPerson = persons.filter(person => person.id === id);

      if (result) {
        personService.remove(id)
        .then(response => {
            if (response.status === 204) {
              const newPersons = persons.filter(person => person.id !== id); 
              setPersons(newPersons);
              setInfoMessage(
                `Removed ${removedPerson[0].name}`
              )
              setTimeout(() => {
                setInfoMessage(null)
              }, 5000)
            }
        })
        .catch(error => {
            const newPersons = persons.filter(person => person.id !== id); 
            setPersons(newPersons);
            setErrorMessage(`${removedPerson[0].name} was already removed`)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        });
      }
  }

  const handleNameChange = (event) => {
      setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
      setNewNumber(event.target.value);
  }

  const handleFilterchange = (event) => {
      setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <div>
      <h1>Phonebook</h1>
      <InfoNotification message={infoMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter filter={filter} handleFilterchange={handleFilterchange} />
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />  
      <Numbers persons={filteredPersons} removeFunction={removePerson}/>
    </div>
  )

}

export default App