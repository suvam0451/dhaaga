import {
	Dimensions,
	StyleProp,
	View,
	ViewStyle,
	StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { userProfileQueryOpts } from '@dhaaga/react';
import { APP_KNOWN_MODAL } from '../../../states/_global';
import {
	useAppApiClient,
	useAppModalState,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import useAppNavigator from '../../../states/useAppNavigator';
import useUserPeekInteractor from '../interactors/useUserPeekInteractor';
import TaperedArrow from '../components/TaperedArrow';
import Backdrop from '../components/Backdrop';
import UserPeekModalContentView from '../view/UserPeekModalContentView';
import { Fragment } from 'react';

/**
 * Shows
 *
 * NOTE: it is a full-screen transparent
 * modal that consumes one click to close
 * @constructor
 */
function UserPeekModalPresenter() {
	const { theme } = useAppTheme();
	const { client } = useAppApiClient();
	const { hide, visible } = useAppModalState(APP_KNOWN_MODAL.USER_PEEK);
	const { toProfile } = useAppNavigator();
	const { pos, userId } = useUserPeekInteractor();
	const { data, fetchStatus } = useQuery(
		userProfileQueryOpts(client, { use: 'userId', userId: userId! }),
	);
	const { width } = Dimensions.get('window');

	if (!visible || !pos.ready) return <View />;

	if (fetchStatus !== 'idle') return <View />;

	const IS_TOP_ORIENTED = pos.popoverDirection === 'top';

	function _toProfile() {
		toProfile(userId);
	}

	const arrowStyle: StyleProp<ViewStyle> = {
		position: 'absolute',
		left: pos.x,
		top: IS_TOP_ORIENTED ? pos.y - 12 : pos.y + pos.height,
	};

	const modalContentStyle: StyleProp<ViewStyle> = {
		width: width - 48,
		backgroundColor: theme.background.a20,
		left: pos.x,
		top: IS_TOP_ORIENTED ? pos.y - 12 : pos.y + pos.height + 12 - 2,
		transform: IS_TOP_ORIENTED
			? [{ translateY: '-100%' }]
			: [{ translateY: '0%' }],
	};

	return (
		<Fragment>
			<Backdrop hide={hide} />
			<View style={[styles.contentContainer, modalContentStyle]}>
				<UserPeekModalContentView toProfile={_toProfile} user={data} />
			</View>
			<View style={arrowStyle}>
				<TaperedArrow direction={pos.popoverDirection} />
			</View>
		</Fragment>
	);
}

export default UserPeekModalPresenter;

const styles = StyleSheet.create({
	contentContainer: {
		position: 'absolute',
		maxHeight: 196,
		maxWidth: 396,
		backgroundColor: '#484848',
		zIndex: 99,
		borderRadius: 12,
		transform: [{ translateY: '-100%' }],
	},
	arrowContainer: {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	arrow: {
		width: 0,
		height: 0,
		left: 8,
		borderLeftWidth: 12, // Left side of the triangle
		borderRightWidth: 12, // Right side of the triangle
		borderTopWidth: 10, // Height of the triangle
		borderLeftColor: 'transparent', // No color for the left side
		borderRightColor: 'transparent', // No color for the right side
		borderTopColor: 'red', // Color of the arrow (bottom)
	},
});
