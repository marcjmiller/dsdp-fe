import { Box } from '@mui/material'
import FilesTable from './components/Table'
import Logo from './Logo'
import FileInputModal from './components/Modal'
import FilesProvider from './context/Files/provider'
import UserProvider from './context/User/provider'
import Header from './components/Table/header'

const App = () => {
	return (
		<UserProvider>
			<FilesProvider>
				<Box px={5} display="flex" flexDirection="column">
					<Logo height={210} width={297} />
					<FileInputModal />
					<FilesTable header={<Header />} />
				</Box>
			</FilesProvider>
		</UserProvider>
	)
}

export default App
