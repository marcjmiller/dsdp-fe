import { createTheme } from '@material-ui/core'

const theme = createTheme({
	palette: {
		type: 'light',
		primary: {
			main: '#3989c7',
		},
		secondary: {
			main: '#0307fc',
		},
		error: {
			main: '#d81010',
		},
	},
	props: {
		MuiButton: {
			variant: 'contained',
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
