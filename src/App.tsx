import { Box } from '@mui/material'
import FilesTable from './components/Table'
import Banner from './components/Banner'
import FileInputModal from './components/Modal'
import FilesProvider from './context/Files/provider'
import UserProvider from './context/User/provider'
import Header from './components/Table/header'
import Footer from './components/Footer'

const App = () => {
	return (
		<UserProvider>
			<FilesProvider>
				<Box
					p={5}
					sx={{ height: '100vh' }}
					display="flex"
					flexDirection="column"
				>
					<Banner />
					<FileInputModal />
					<FilesTable header={<Header />} />
					<Footer />
				</Box>
			</FilesProvider>
		</UserProvider>
	)
}

export default App
