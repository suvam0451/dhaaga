import { memo } from 'react';
import { RneuiDialogProps } from '../_types';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_FONT } from '../../../styles/AppTheme';
import {
	AccountDetails,
	AccountPfp,
} from '../../../screens/accounts/fragments/AccountListingFragment';
import AppDialogContainer from '../../containers/AppDialogContainer';
import { Accounts } from '../../../database/entities/account';

type Props = {
	acct: Accounts;
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
	const avatar = acct?.meta?.find((o) => o.key === 'avatar')?.value;
	const displayName = acct?.meta?.find((o) => o.key === 'display_name')?.value;

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
					selected={acct.selected as unknown as boolean}
					url={avatar}
					onClicked={onClicked}
				/>
				<AccountDetails
					selected={acct.selected as unknown as boolean}
					displayName={displayName}
					username={acct.username}
					subdomain={acct.server}
					onClicked={onClicked}
				/>
			</View>
			{children}
		</AppDialogContainer>
	);
});

export default AccountOverviewFragment;
