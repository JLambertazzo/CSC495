import Axios from 'axios'

export const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://clrus.azurewebsites.net/api'
      : 'http://localhost:5277/api/',
  headers: {
    'Content-type': 'application/json',
  },
})
