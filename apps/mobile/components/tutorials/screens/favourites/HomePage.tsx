import { View } from 'react-native';
import { Text } from '@rneui/themed';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONT } from '../../../../styles/AppTheme';

function FavouritesScreenHomePageDefaultTutorial() {
	return (
		<View style={{ padding: 8 }}>
			<View
				style={{
					padding: 16,
					position: 'relative',
					borderWidth: 2,
					borderColor: '#ffffff60',
					borderRadius: 8,
					marginTop: 16,
				}}
			>
				<View
					style={{
						display: 'flex',
						position: 'absolute',
						left: '100%',
					}}
				>
					<View style={{ marginTop: 8, marginLeft: -4 }}>
						<MaterialIcons
							name="help-outline"
							size={24}
							style={{ marginLeft: 4 }}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>

				<Text
					style={{
						fontSize: 24,
						textAlign: 'center',
						color: APP_FONT.MONTSERRAT_HEADER,
					}}
				>
					Welcome !
				</Text>

				<Text
					style={{
						fontSize: 18,
						textAlign: 'center',
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					Here, you can browse your saved statuses/tags and manage your network.
				</Text>
				<Text
					style={{
						fontSize: 18,
						textAlign: 'center',
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					If you are new to mastodon and need help, click help icon for a
					explainer 😉
				</Text>
			</View>
		</View>
	);
}

export default FavouritesScreenHomePageDefaultTutorial;
