import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_THEME } from '../../../../styles/AppTheme';
import { RelationshipButtonProps } from './_common';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { appDimensions } from '../../../../styles/dimensions';

const LABEL = 'Follow';

const RelationStrangers = memo(
	({ loading, onPress }: RelationshipButtonProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		return (
			<Pressable
				onPress={onPress}
				style={[
					styles.button,
					{
						backgroundColor: theme.primary.a0,
						borderRadius: appDimensions.buttons.borderRadius,
						alignItems: 'center',
					},
				]}
			>
				{loading ? (
					<ActivityIndicator
						size={20}
						color={APP_THEME.COLOR_SCHEME_D_NORMAL}
					/>
				) : (
					<Text style={[styles.text, { color: 'black' }]}>{LABEL}</Text>
				)}
			</Pressable>
		);
	},
);

const styles = StyleSheet.create({
	button: {
		borderColor: '#cb6483',
		backgroundColor: '#363636',
		borderRadius: 12,
		paddingVertical: 8,
		paddingHorizontal: 20,
	},
	buttonContainer: {
		borderRadius: 12,
	},
	text: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
});

export default RelationStrangers;
