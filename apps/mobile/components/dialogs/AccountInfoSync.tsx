import { RneuiDialogProps } from './_types';
import { memo, useCallback, useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONTS } from '../../styles/AppFonts';
import { APP_FONT } from '../../styles/AppTheme';
import { FontAwesome } from '@expo/vector-icons';
import { SoftwareBadgeUpdateAccountOnClick } from '../common/software/SimpleBadge';
import ActivityPubService from '../../services/activitypub.service';
import AccountOverviewFragment from './accounts/_AccountOverview';
import { Account } from '../../database/_schema';
import { AccountService } from '../../database/entities/account';
import { useSQLiteContext } from 'expo-sqlite';

type Props = {
	acct: Account;
} & RneuiDialogProps;

const AccountInfoSyncDialog = memo(function Foo({
	setIsVisible,
	acct,
	IsVisible,
}: Props) {
	const [SoftwareAutoDetectLoading, setSoftwareAutoDetectLoading] =
		useState(false);
	const db = useSQLiteContext();
	const autoDetectSoftware = useCallback(async () => {
		if (SoftwareAutoDetectLoading) return;
		setSoftwareAutoDetectLoading(true);
		try {
			const software = await ActivityPubService.detectSoftware(acct.server);
			AccountService.updateDriver(db, acct, software);
		} catch (e) {
			console.log(e);
		}
		setSoftwareAutoDetectLoading(false);
	}, [acct, setSoftwareAutoDetectLoading, SoftwareAutoDetectLoading]);

	return (
		<AccountOverviewFragment
			setIsVisible={setIsVisible}
			IsVisible={IsVisible}
			acct={acct}
			title={'Fix Account Issues'}
			onClicked={() => {}}
		>
			<View style={{ alignItems: 'center' }}>
				<View style={styles.debugSegment}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={styles.debugButtonText}>pfp/name is outdated</Text>
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
								Refresh
							</Text>
						</View>
					</View>
				</View>
				<SoftwareBadgeUpdateAccountOnClick acct={acct} />
				<Text style={[styles.debugButtonText, { paddingVertical: 8 }]}>
					My instance software is incorrect
				</Text>
				<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
					<TouchableOpacity
						style={{
							padding: 8,
							backgroundColor: '#363636',
							borderRadius: 8,
							marginRight: 8,
						}}
						onPress={autoDetectSoftware}
					>
						{SoftwareAutoDetectLoading ? (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<ActivityIndicator size={20} />
								<Text
									style={{
										color: APP_FONT.MONTSERRAT_BODY,
										fontFamily: APP_FONTS.INTER_700_BOLD,
										marginLeft: 4,
									}}
								>
									Loading...
								</Text>
							</View>
						) : (
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_BODY,
									fontFamily: APP_FONTS.INTER_700_BOLD,
								}}
							>
								Auto-Detect
							</Text>
						)}
					</TouchableOpacity>
					<View
						style={{
							padding: 8,
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: '#363636',
							borderRadius: 8,
						}}
					>
						<FontAwesome name="warning" size={16} color={APP_FONT.DISABLED} />
						<Text
							style={{
								color: APP_FONT.DISABLED,
								fontFamily: APP_FONTS.INTER_700_BOLD,
								marginLeft: 4,
							}}
						>
							Set Manually
						</Text>
					</View>
				</View>
			</View>
		</AccountOverviewFragment>
	);
});

const styles = StyleSheet.create({
	debugSegment: {
		marginBottom: 16,
		alignItems: 'center',
	},
	debugButtonText: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		color: APP_FONT.MONTSERRAT_BODY,
		textAlign: 'center',
	},
});

export default AccountInfoSyncDialog;
