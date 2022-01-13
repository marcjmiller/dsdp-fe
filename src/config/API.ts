import axios from 'axios'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080/api'

const API = axios.create({
	baseURL,
})

export default API
