import { Box } from '@mantine/core';
import { FaChevronDown } from 'react-icons/fa';

function SeeAllFeatures() {
	return (
		<Box
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				marginBottom: '0.5rem',
			}}
		>
			<p style={{ fontSize: 20, textAlign: 'center' }}>See All Features</p>
			<FaChevronDown size={48} color={'rgba(255, 255, 255, 0.87)'} />
		</Box>
	);
}

export default SeeAllFeatures;
