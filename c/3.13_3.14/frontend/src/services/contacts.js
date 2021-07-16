import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const create = (newObject) => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
}

const deleteContact = (id, name) => () => {
    if (window.confirm(`Do you want to delete ${name}`)) {
        const request = axios.delete(`${baseUrl}/${id}`);
        const newContacts = request.then(response => response.data);
        window.location.reload();
        return newContacts;
    }
    return false;

}

const contactService = {
    getAll: getAll,
    create: create,
    update: update,
    deleteContact: deleteContact
}

export default contactService;