import { Box } from '@mui/material'
import Army_Seal from '../../static/images/Army_Seal.png'
import USMC_Seal from '../../static/images/USMC_Seal.png'
import PEO_Emblem from '../../static/images/PEO_CS_CSS_Emblem_W.png'
import JLTV_Logo from '../../static/images/JLTV_Logo.gif'
import Admin from '../Admin'

const Footer = () => {
	const imgSize = '112px'

	return (
		<Box
			py={2}
			sx={{
				display: 'flex',
				gap: '16px',
			}}
		>
			<img src={Army_Seal} alt={'Army Seal'} height={imgSize} width={imgSize} />
			<img src={USMC_Seal} alt={'USMC Seal'} height={imgSize} width={imgSize} />
			<img
				src={PEO_Emblem}
				alt={'PEO CS CSS Emblem'}
				height={imgSize}
				width={imgSize}
			/>
			<img
				src={JLTV_Logo}
				alt={'JPO JLTV Logo'}
				height={imgSize}
				width={imgSize}
			/>
			<Admin />
		</Box>
	)
}

export default Footer
