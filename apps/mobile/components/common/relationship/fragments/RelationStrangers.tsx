import { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { Button } from '@rneui/themed';
import { RelationshipButtonProps } from './_common';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const LABEL = 'Follow';

const RelationStrangers = memo(
	({ loading, onPress }: RelationshipButtonProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		return (
			<Button
				size={'sm'}
				onPress={onPress}
				buttonStyle={[
					styles.button,
					{
						backgroundColor: theme.palette.buttonUnstyled,
					},
				]}
				containerStyle={[styles.buttonContainer, {}]}
			>
				{loading ? (
					<ActivityIndicator
						size={20}
						color={APP_THEME.COLOR_SCHEME_D_NORMAL}
					/>
				) : (
					<Text style={[styles.text, { color: theme.textColor.high }]}>
						{LABEL}
					</Text>
				)}
			</Button>
		);
	},
);

const styles = StyleSheet.create({
	button: {
		borderColor: '#cb6483',
		backgroundColor: '#363636',
		borderRadius: 4,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	buttonContainer: {
		borderRadius: 8,
	},
	text: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
	},
});

export default RelationStrangers;
