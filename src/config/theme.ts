import { createTheme } from '@mui/material'

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#3989c7',
		},
		secondary: {
			main: '#E7E247',
		},
		error: {
			main: '#d81010',
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				'#root': {
					height: '100%',
				},
				html: {
					height: '100%',
				},
				body: {
					height: '100%',
				},
			},
		},
		MuiIconButton: {
			defaultProps: {
				color: 'secondary',
			},
		},
	},
})

export default theme
