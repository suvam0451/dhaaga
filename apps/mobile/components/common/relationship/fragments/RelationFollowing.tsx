import { memo } from 'react';
import { RelationshipButtonProps, styles } from './_common';
import { Button } from '@rneui/themed';
import { ActivityIndicator, Text } from 'react-native';
import { APP_THEME } from '../../../../styles/AppTheme';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const LABEL = 'Following';

const RelationFollowing = memo(
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
					{ backgroundColor: theme.palette.menubar },
				]}
				containerStyle={[styles.buttonContainer]}
			>
				{loading ? (
					<ActivityIndicator
						size={20}
						color={APP_THEME.COLOR_SCHEME_D_NORMAL}
					/>
				) : (
					<Text style={styles.text}>{LABEL}</Text>
				)}
			</Button>
		);
	},
);

export default RelationFollowing;
