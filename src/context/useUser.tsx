import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

export type User = {
	name: string
	isAdmin: boolean
}

export interface UserContextType {
	user: User | undefined
}

export const UserContext = React.createContext<UserContextType>({
	user: undefined,
})

export const useUser = (): UserContextType => useContext(UserContext)

export const UserProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<User>()
	useEffect(() => {
		axios.get('/api/whoami').then((result) => setUser(result.data))
	}, [])

	return (
		<UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
	)
}
