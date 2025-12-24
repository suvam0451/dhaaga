import { View, StyleSheet } from 'react-native';
import BearError from '#/components/svgs/BearError';
import {
	useAppActiveSession,
	useAppGlobalStateActions,
} from '#/states/global/hooks';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';

function AccountLoadError() {
	const { session } = useAppActiveSession();
	const { restoreSession } = useAppGlobalStateActions();

	return (
		<View style={styles.root}>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Failed to load account'}
				errorDescription={session.error}
			>
				<AppButtonVariantA
					style={{ marginTop: 32 }}
					label={'Retry'}
					loading={session.state === 'loading'}
					onClick={restoreSession}
				/>
				{/*<AppButtonVariantA*/}
				{/*	style={{ marginTop: 8 }}*/}
				{/*	label={'Re-Login 🚧'}*/}
				{/*	loading={false}*/}
				{/*	variant={'secondary'}*/}
				{/*	onClick={() => {}}*/}
				{/*/>*/}
			</ErrorPageBuilder>
		</View>
	);
}

export default AccountLoadError;

const styles = StyleSheet.create({
	root: {
		marginVertical: 'auto',
		alignItems: 'center',
		height: '100%',
	},
});
