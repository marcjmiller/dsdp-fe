import { FC, useState, useLayoutEffect } from 'react'
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from '@mui/material'
import { useUser } from '../../context/User/context'
import AdminTable from './Table'
import Header from './Table/header'
import axios from 'axios'

const handleAddAdmin = (username: string) => {
	return axios.post<string[]>('/api/admins', { username: username })
}

const Admin: FC = () => {
	const { user } = useUser()
	const [userName, setUsername] = useState<string>('')
	const [open, setOpen] = useState(false)
	const [admins, setAdmins] = useState<string[]>([])

	useLayoutEffect(() => {
		updateAdmins()
	}, [])

	const updateAdmins = async () => {
		const { data } = await axios.get<string[]>('/api/admins')
		setAdmins(data)
	}

	const handleClickOpen = () => setOpen(true)

	const handleClose = () => setOpen(false)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value)
	}

	const handleAdd = () => {
		handleAddAdmin(userName).then((result) => {
			setAdmins(result.data)
			setUsername('')
		})
	}
	if (!user?.isAdmin) {
		return <></>
	}
	return (
		<>
			<Button
				color={'secondary'}
				sx={{ ml: 'auto', height: '50px', mt: 'auto' }}
				data-testid="admin"
				onClick={handleClickOpen}
				variant={'outlined'}
			>
				Admin
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle sx={{ m: 'auto' }}>User Administration</DialogTitle>
				<DialogContent>
					<AdminTable header={<Header />} admins={admins} />
				</DialogContent>
				<DialogActions sx={{ m: 'auto' }}>
					<TextField
						onChange={handleChange}
						label="Add Admin"
						value={userName}
					/>
					<Button onClick={handleAdd}>Add</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default Admin
