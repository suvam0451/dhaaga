import { Text } from '@rneui/themed';
import { APP_FONT } from '../../styles/AppTheme';
import { View } from 'react-native';
import { router } from 'expo-router';

type Props = {
	msg?: string;
};

function ErrorGoBack({ msg }: Props) {
	return (
		<View
			style={{
				height: '100%',
				backgroundColor: '#1e1e1e',
				padding: 16,
				paddingTop: 64,
			}}
		>
			<Text style={{ color: APP_FONT.MONTSERRAT_HEADER, textAlign: 'center' }}>
				Uh oh, some error occurred
			</Text>
			<Text style={{ textAlign: 'center' }}>{msg}</Text>
			<View
				onTouchEnd={() => {
					router.back();
				}}
			>
				<Text
					style={{
						fontSize: 24,
						fontFamily: 'Montserrat-Bold',
						color: APP_FONT.MONTSERRAT_HEADER,
						textAlign: 'center',
					}}
				>
					Go Back
				</Text>
			</View>
		</View>
	);
}

export default ErrorGoBack;
