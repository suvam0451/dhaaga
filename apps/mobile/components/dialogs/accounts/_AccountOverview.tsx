import { memo } from 'react';
import { Account } from '../../../entities/account.entity';
import { RneuiDialogProps } from '../_types';
import { useRealm } from '@realm/react';
import AccountRepository from '../../../repositories/account.repo';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import {
	AccountDetails,
	AccountPfp,
} from '../../../screens/accounts/fragments/AccountListingFragment';
import AppDialogContainer from '../../containers/AppDialogContainer';

type Props = {
	acct: Account;
	children: any;
	title: string;
	onClicked: () => void;
} & RneuiDialogProps;

const AccountOverviewFragment = memo(function Foo({
	acct,
	setIsVisible,
	IsVisible,
	children,
	title,
	onClicked,
}: Props) {
	const db = useRealm();

	const avatar = AccountRepository.findSecret(db, acct, 'avatar')?.value;
	const displayName = AccountRepository.findSecret(
		db,
		acct,
		'display_name',
	)?.value;

	if (!IsVisible || !acct) return <View />;
	return (
		<AppDialogContainer setIsVisible={setIsVisible} IsVisible={IsVisible}>
			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
					fontSize: 20,
					color: APP_FONT.MONTSERRAT_HEADER,
					marginBottom: 32,
					textAlign: 'center',
				}}
			>
				{title}
			</Text>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: 16,
					alignItems: 'center',
					backgroundColor: '#121212',
					padding: 8,
					borderRadius: 8,
				}}
			>
				<AccountPfp
					selected={acct.selected}
					url={avatar}
					onClicked={onClicked}
				/>
				<AccountDetails
					selected={acct.selected}
					displayName={displayName}
					username={acct.username}
					subdomain={acct.subdomain}
					onClicked={onClicked}
				/>
			</View>
			{children}
		</AppDialogContainer>
	);
});

export default AccountOverviewFragment;
