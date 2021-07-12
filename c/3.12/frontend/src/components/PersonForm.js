import React from 'react'

const PersonForm = (props) => {
    return (
        <>
            <form onSubmit={props.addPerson}>
                <table>
                    <tbody>
                        <tr>
                            <td>name:</td>
                            <td><input value={props.newName}
                                onChange={props.handleNameChange} /></td>
                        </tr>
                        <tr>
                            <td>number:</td>
                            <td><input value={props.newNumber}
                                onChange={props.handleNumberChange} /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><button type="submit">add</button></td>
                        </tr>
                    </tbody>
                </table>

            </form>
        </>
    )
}

export default PersonForm