import { TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import {
	AppIonicon,
	ButtonGroupContainer,
	DhaagaText,
} from '../../styles/Containers';
import { APP_FONT } from '../../styles/AppTheme';
import { router } from 'expo-router';

function SearchScreenManual() {
	return (
		<View
			style={{
				display: 'flex',
				alignItems: 'center',
				marginTop: 54,
				padding: 16,
			}}
		>
			<View
				style={{
					borderWidth: 1,
					borderColor: '#ffffff60',
					padding: 16,
					borderRadius: 16,
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Text
					style={{
						opacity: 0.87,
						fontSize: 20,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					⌨️ to get started
				</Text>
				<View style={{ width: '100%', display: 'flex', marginVertical: 16 }}>
					<Text
						style={{
							textAlign: 'center',
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						{' '}
						--- OR ---{' '}
					</Text>
				</View>

				<View style={{ minWidth: '100%' }}>
					<TouchableOpacity
						onPress={() => {
							router.navigate('/discover/trending-posts');
						}}
					>
						<ButtonGroupContainer first>
							<DhaagaText secondary style={{ fontFamily: 'Inter-Bold' }}>
								Trending Posts
							</DhaagaText>
							<AppIonicon
								secondary
								size={24}
								color="white"
								name={'chevron-forward'}
							/>
						</ButtonGroupContainer>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							router.navigate('/discover/trending-tags');
						}}
					>
						<ButtonGroupContainer>
							<DhaagaText secondary style={{ fontFamily: 'Inter-Bold' }}>
								Trending Tags
							</DhaagaText>
							<AppIonicon
								secondary
								size={24}
								color="white"
								name={'chevron-forward'}
							/>
						</ButtonGroupContainer>
					</TouchableOpacity>
					<ButtonGroupContainer last>
						<DhaagaText secondary style={{ fontFamily: 'Inter-Bold' }}>
							Trending Links
						</DhaagaText>
						<AppIonicon
							secondary
							size={24}
							color="white"
							name={'chevron-forward'}
						/>
					</ButtonGroupContainer>
				</View>
			</View>
		</View>
	);
}

export default SearchScreenManual;
