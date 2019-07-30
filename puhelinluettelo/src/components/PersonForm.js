import React from 'react';

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
    return (
        <div>
            <h3>add a new</h3>
            <form onSubmit={addPerson}>
            <p>name: <input value={newName} onChange={handleNameChange} /></p>
            <p>number: <input value={newNumber} onChange={handleNumberChange} /></p>
            <button type="submit">add</button>
            </form>
        </div>
    )
}

export default PersonForm;