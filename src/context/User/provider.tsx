import axios from 'axios'
import { FC, useLayoutEffect, useState } from 'react'
import { UserContext } from './context'
import { User } from './types'

const UserProvider: FC = ({ children }) => {
	const [user, setUser] = useState<User>({ name: 'Nobody', isAdmin: false })
	useLayoutEffect(() => {
		axios.get('/api/whoami').then((result) => setUser(result.data))
	}, [])

	return (
		<UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
	)
}

export default UserProvider
