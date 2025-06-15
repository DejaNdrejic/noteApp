import axios from 'axios'
const baseUrl='/api/notes'

function getAllNotes() {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
function createNote(newObject) {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}
function updateNote(id, newObject) {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAllNotes, createNote, updateNote }
