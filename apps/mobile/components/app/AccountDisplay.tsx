import { Card } from '@rneui/base';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

export type AccountCreationPreviewProps = {
	avatar: string;
	displayName: string;
	username: string;
};

function AccountCreationPreview({
	avatar,
	displayName,
	username,
}: AccountCreationPreviewProps) {
	return (
		<Card
			wrapperStyle={{
				height: 48,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}
			containerStyle={{
				margin: 0,
				padding: 8,
				backgroundColor: '#E5FFDA',
				borderRadius: 4,
			}}
		>
			<View>
				{avatar && (
					<View style={{ height: 48, width: 48 }}>
						{/*@ts-ignore-next-line*/}
						<Image
							style={styles.image}
							source={avatar}
							contentFit="fill"
							transition={1000}
						/>
					</View>
				)}
			</View>
			<View style={{ marginLeft: 8, flexGrow: 1 }}>
				<Text style={{ fontWeight: '500' }}>{displayName}</Text>
				<Text style={{ color: 'gray', fontSize: 14 }}>{username}</Text>
			</View>
			<View
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					flexDirection: 'row',
					marginRight: 8,
					alignItems: 'center',
				}}
			>
				<Ionicons name="menu-outline" size={32} color="black" />
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		flex: 1,
		width: 48,
		backgroundColor: '#0553',
	},
});

export default AccountCreationPreview;
