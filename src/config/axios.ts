import axios from 'axios'


const baseURL = 'http://localhost:8080/api'

const API = axios.create({
  baseURL,
})
API.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
API.defaults.headers.get['Access-Control-Allow-Origin'] = '*'

export default API