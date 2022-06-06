import { createContext, useContext } from 'react'
import { User } from './types'

export interface UserContextType {
	user: User | undefined
}

const UserContext = createContext<UserContextType>({
	user: undefined,
})

const useUser = (): UserContextType => useContext(UserContext)

export { UserContext, useUser }
