import React, { ReactNode, useContext, useEffect, useState } from "react";

import { IUser } from "../types";

const userContext = React.createContext({
  user: null as IUser | null,
  setUser: ((user) => {
    void user;
  }) as (user: IUser | null) => void,
});

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const local = localStorage.getItem('user')
  const localUser = local ? JSON.parse(local) : null
  const [user, setUser] = useState<IUser | null>(localUser)

  useEffect(() => {
    if (user?.username) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.clear()
    }
  }, [user])

  return <userContext.Provider value={{ user, setUser }}>{children}</userContext.Provider>
}

export default function useAuth() {
  return useContext(userContext)
}
