import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Text } from '@rneui/themed';
import {
	AppIonicon,
	ButtonGroupContainer,
	DhaagaText,
} from '../../styles/Containers';
import { useNavigation } from '@react-navigation/native';

function SearchScreenManual() {
	const navigation = useNavigation<any>();

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
				<Text style={{ opacity: 0.87, fontSize: 20 }}>⌨️ to get started</Text>
				<View style={{ width: '100%', display: 'flex', marginVertical: 16 }}>
					<Text> --- OR --- </Text>
				</View>

				<Text>Browse some photography from your community.</Text>

				<Text style={{ color: 'orange', fontSize: 18, margin: 8 }}>
					sunset 🌆
				</Text>
				<Text style={{ color: 'orange', fontSize: 18, margin: 8 }}>
					nightsky 🌙
				</Text>
				<Text style={{ color: 'orange', fontSize: 18, margin: 8 }}>
					wildlifephotography 🐾
				</Text>

				<View style={{ minWidth: '100%' }}>
					<View>
						<Text>Trending</Text>
					</View>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Trending Posts');
						}}
					>
						<ButtonGroupContainer first>
							<DhaagaText primary>Posts</DhaagaText>
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
							navigation.navigate('Trending Tags');
						}}
					>
						<ButtonGroupContainer>
							<DhaagaText primary>Tags</DhaagaText>
							<AppIonicon
								secondary
								size={24}
								color="white"
								name={'chevron-forward'}
							/>
						</ButtonGroupContainer>
					</TouchableOpacity>
					<ButtonGroupContainer last>
						<DhaagaText primary>Links</DhaagaText>
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
