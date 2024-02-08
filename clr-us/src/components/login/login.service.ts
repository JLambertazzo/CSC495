import { IUser } from '../../types'
import { axios } from '../services/axios'

class LoginService {
  loginUser = (
    username: string,
    password: string,
    setUser: (user: IUser | null) => void
  ): Promise<IUser> => {
    return axios
      .post('/Users', { username, password })
      .then((res) => {
        if (res.status === 404) {
          return 'Incorrect Password.'
        } else {
          setUser(res.data as IUser)
        }
      })
      .catch((err) => err)
  }

  logout = (setUser: (user: IUser | null) => void) => {
    setUser(null)
  }
}
export const loginService = new LoginService()
