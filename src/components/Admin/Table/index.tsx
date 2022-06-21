import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from '@mui/material'
import { FC, ReactElement } from 'react'

interface AdminTableProps {
	header: ReactElement
	admins: string[]
}

const AdminTable: FC<AdminTableProps> = ({ header, admins }) => {
	return (
		<TableContainer sx={{ height: '100%', minWidth: '500px' }}>
			<Table size="small">
				{header}
				<TableBody data-testid="admins-list">
					{admins.map((username) => (
						<TableRow key={username}>
							<TableCell>{username}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default AdminTable
