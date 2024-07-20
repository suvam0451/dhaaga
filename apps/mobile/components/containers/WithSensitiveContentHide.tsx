import useSensitiveContent from '../../states/useSensitiveContent';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Divider, Text } from '@rneui/themed';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../styles/AppTheme';

type Props = {
	isSensitive: boolean;
	spoilerText?: string;
	children: any;
};

function WithSensitiveContentHide({ isSensitive, spoilerText }: Props) {
	const { Show, toggleShow } = useSensitiveContent(isSensitive);
	return (
		<View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<View style={{ width: 24 }}>
					<FontAwesome
						name="warning"
						size={24}
						color="yellow"
						style={{ opacity: 0.6 }}
					/>
				</View>
				<View style={{ marginLeft: 8, maxWidth: '90%' }}>
					{spoilerText && (
						<Text
							style={{
								fontFamily: 'Inter-Bold',
								color: 'yellow',
								opacity: 0.6,
							}}
						>
							{spoilerText}
						</Text>
					)}
				</View>
			</View>
			<View style={sensitive.toggleHideContainer}>
				<Divider style={{ flex: 1, flexGrow: 1, opacity: 0.6 }} />
				<Pressable
					style={sensitive.toggleHidePressableAreaContainer}
					onPress={toggleShow}
				>
					<Text style={sensitive.toggleHideText}>
						{Show ? 'Hide Sensitive' : 'Show' + ' Sensitive'}
					</Text>
					<View style={{ width: 24, marginLeft: 4 }}>
						<FontAwesome5
							name="eye-slash"
							size={18}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</Pressable>
				<Divider style={{ flex: 1, flexGrow: 1, opacity: 0.6 }} />
			</View>
		</View>
	);
}

const sensitive = StyleSheet.create({
	toggleHideContainer: {
		marginHorizontal: 'auto',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 8,
	},
	toggleHideText: {
		color: APP_FONT.MONTSERRAT_BODY,
		flexShrink: 1,
		textAlign: 'center',
		fontSize: 16,
		fontFamily: 'Montserrat-Bold',
	},
	toggleHidePressableAreaContainer: {
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
});

export default WithSensitiveContentHide;
