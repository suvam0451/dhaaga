import { StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
import { AccountSavedUser } from '@dhaaga/db';
import UserBadge from '#/ui/UserBadge';

type SavedPostCreatedByProps = {
	user: AccountSavedUser;
	authoredAt: Date | string;
	style?: StyleProp<ViewStyle>;
};

/**
 * Author indicator for a post
 *
 * The local version must check online
 * connectivity and resolve the handle
 * prior t show information
 * @constructor
 */
export function SavedPostCreatedBy({ user, style }: SavedPostCreatedByProps) {
	if (!user) return <View />;

	return (
		<View style={[styles.savedPostRoot, style]}>
			<UserBadge
				userId={user.identifier}
				avatarUrl={user.avatarUrl}
				displayName={user.displayName}
				handle={user.username}
				style={style}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	savedPostRoot: {
		alignItems: 'center',
		flexDirection: 'row',
		flexGrow: 1,
		width: 'auto',
		position: 'relative',
	},
});
