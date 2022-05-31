import { Box, Table, TableContainer } from '@mui/material'
import DropZone from './components/DropZone'
import FileTable from './components/FileTable'
import TableHeader from './components/TableHeader'
import Logo from './Logo'
import { UserProvider } from './context/useUser'
import { FileProvider } from './context/useFiles'

const App = () => {
	return (
		<UserProvider>
			<FileProvider>
				<Box px={5} display="flex" flexDirection="column">
					<Logo height={210} width={297} />
					<TableContainer>
						<Table size="small">
							<TableHeader />
							<FileTable />
						</Table>
					</TableContainer>
					<DropZone />
				</Box>
			</FileProvider>
		</UserProvider>
	)
}

export default App
