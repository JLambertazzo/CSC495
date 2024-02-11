import Axios from 'axios'

export const axios = Axios.create({
  baseURL: process.env.URL || 'http://localhost:5277/api/',
  headers: {
    'Content-type': 'application/json',
  },
})
