import { memo } from 'react';
import { View } from 'react-native';

const PreviewPage = memo(() => {
	return (
		<View
			style={{ height: '100%', width: '100%', backgroundColor: '#2C2C2C' }}
		></View>
	);
});

export default PreviewPage;
