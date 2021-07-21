import React from 'react'

const Persons = ({ filterPersons, deleteContact }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Number</th>
                </tr>
            </thead>
            <tbody>
                {filterPersons.map((person, index) =>
                    <tr key={index}>
                        <td>{person.name}</td>
                        <td>{person.number}</td>
                        <td><input type="button" value="delete" onClick={deleteContact(person.id, person.name)} /></td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default Persons