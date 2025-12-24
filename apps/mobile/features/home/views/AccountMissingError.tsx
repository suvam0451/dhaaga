import { View, StyleSheet } from 'react-native';
import BearError from '#/components/svgs/BearError';
import { useAppActiveSession } from '#/states/global/hooks';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import RoutingUtils from '#/utils/routing.utils';

function AccountMissingError() {
	const { session } = useAppActiveSession();

	return (
		<View style={styles.root}>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'No Account Selected'}
				errorDescription={
					'The app found some valid accounts. But, none of them are currently selected.'
				}
			>
				<AppButtonVariantA
					style={{ marginTop: 32 }}
					label={'Select Now'}
					loading={session.state === 'loading'}
					onClick={RoutingUtils.toAccountManagement}
				/>
			</ErrorPageBuilder>
		</View>
	);
}

export default AccountMissingError;

const styles = StyleSheet.create({
	root: {
		marginVertical: 'auto',
		alignItems: 'center',
		height: '100%',
	},
});
