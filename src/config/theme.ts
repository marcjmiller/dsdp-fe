import { createTheme } from '@material-ui/core'

const theme = createTheme({
	palette: {
		type: 'dark',
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
	props: {
		MuiIconButton: {
			color: 'secondary',
		},
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				html: {
					height: '100%',
				},
				body: {
					height: '100%',
				},
				'#root': {
					height: '100%',
				},
			},
		},
	},
})

export default theme
