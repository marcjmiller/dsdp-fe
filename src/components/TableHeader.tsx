import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core'

const TableHeader = () => {
	return (
		<TableHead>
			<TableRow>
				<TableCell>
					<Typography color="secondary">Name:</Typography>
				</TableCell>
				<TableCell>
					<Typography color="secondary">Size:</Typography>
				</TableCell>
				<TableCell>
					<Typography color="secondary">Actions:</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
	)
}

export default TableHeader