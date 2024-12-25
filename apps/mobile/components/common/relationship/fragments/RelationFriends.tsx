import { memo } from 'react';
import { RelationshipButtonProps } from './_common';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';

const LABEL = 'Friends';

const RelationFriends = memo(
	({ loading, onPress }: RelationshipButtonProps) => {
		const { theme } = useAppTheme();
		return (
			<Pressable
				onPress={onPress}
				style={[
					styles.button,
					{
						borderRadius: appDimensions.buttons.borderRadius,
						backgroundColor: '#323232',
					},
				]}
			>
				{loading ? (
					<ActivityIndicator size={20} color={theme.complementary.a0} />
				) : (
					<Text
						style={[
							styles.text,
							{
								color: theme.complementary.a0,
							},
						]}
					>
						{LABEL}
					</Text>
				)}
			</Pressable>
		);
	},
);

const styles = StyleSheet.create({
	button: {
		borderColor: '#cb6483',
		borderRadius: 4,
		paddingVertical: 8,
		paddingHorizontal: 12,
		alignItems: 'center',
	},
	buttonContainer: {
		borderRadius: 8,
	},
	text: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 16,
	},
});

export default RelationFriends;
