import axios from 'axios'

const baseURL = 'http://localhost:8080/api'

const API = axios.create({
	baseURL,
})

export default API
