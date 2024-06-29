import React from 'react';
import { Box } from '@mantine/core';

function AppFooter() {
	return (
		<Box
			style={{
				background: '#1e1e1e',
				minHeight: '4rem',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<p
				color={'#ffffff87'}
				style={{
					fontWeight: 700,
				}}
			>
				© 2024 • Made With 💜 by Debashish Patra
			</p>
		</Box>
	);
}

export default AppFooter;
