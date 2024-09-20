import { memo } from 'react';
import { RneuiDialogProps } from '../_types';
import { TouchableOpacity, View } from 'react-native';
import AccountOverviewFragment from './_AccountOverview';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import { Accounts } from '../../../database/entities/account';
import { useAccountDbContext } from '../../screens/profile/stack/settings/hooks/useAccountDb';

type Props = {
	acct: Accounts;
} & RneuiDialogProps;

const ConfirmAccountDelete = memo(function Foo({
	setIsVisible,
	IsVisible,
	acct,
}: Props) {
	const { remove } = useAccountDbContext();
	async function onRemoveConfirmed() {
		remove(acct.id as unknown as number);
		setIsVisible(false);
	}

	return (
		<AccountOverviewFragment
			setIsVisible={setIsVisible}
			IsVisible={IsVisible}
			acct={acct}
			title={'Remove Account'}
			onClicked={() => {}}
		>
			<TouchableOpacity
				style={{ alignItems: 'center' }}
				onPress={onRemoveConfirmed}
			>
				<View
					style={{
						padding: 8,
						backgroundColor: '#363636',
						borderRadius: 8,
						marginLeft: 8,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.INTER_700_BOLD,
						}}
					>
						Confirm and Remove
					</Text>
				</View>
			</TouchableOpacity>
		</AccountOverviewFragment>
	);
});

export default ConfirmAccountDelete;
