import React from 'react';

const Number = (props) => {
    return (
        <>
            <p>{props.name} {props.number}<button onClick={() => props.removeFunction(props.id, props.name)}>delete</button></p>
        </>
    )
}

const Numbers = (props) => {
    const { persons, removeFunction } = props;
    const numbers = () => persons.map(person => <Number key={person.name} name={person.name} number={person.number} removeFunction={removeFunction} id={person.id}/>)
    return (
        <>
            <h2>Numbers</h2>
            {numbers()}
        </>
    )
}

export default Numbers;