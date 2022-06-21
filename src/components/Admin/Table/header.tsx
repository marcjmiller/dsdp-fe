import { TableCell, TableHead, TableRow, Typography } from '@mui/material'

const Header = () => {
	return (
		<TableHead>
			<TableRow>
				<TableCell>
					<Typography color="secondary">Username:</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
	)
}

export default Header
