import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../styles/AppFonts';
import Feather from '@expo/vector-icons/Feather';
import {
	Account,
	AccountService,
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '@dhaaga/db';
import {
	useAppDb,
	useAppDialog,
	useAppPublishers,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { APP_EVENT_ENUM } from '../../../services/publishers/app.publisher';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

type Props = {
	acct: Account;
	onListChange: () => void;
};

type AccountPfpProps = {
	url: string;
	selected: boolean;
	onClicked: () => void;
};

export function AccountPfp({ url, selected, onClicked }: AccountPfpProps) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={{
				height: 48,
				width: 48,
				borderRadius: 8,
				borderWidth: 1.5,
				borderColor: selected ? theme.primary.a10 : 'gray',
			}}
			onPress={onClicked}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				style={styles.image}
				source={{ uri: url }}
				contentFit="fill"
				transition={1000}
			/>
			<View
				style={[
					{
						display: selected ? 'flex' : 'none',
					},
					styles.selectedIndicator,
					{
						backgroundColor: theme.primary.a10,
					},
				]}
			/>
		</Pressable>
	);
}

type selectedIndicatorProps = {
	displayName?: string;
	username: string;
	subdomain: string;
	selected: boolean;
	onClicked: () => void;
};
export function AccountDetails({
	displayName,
	username,
	selected,
	subdomain,
	onClicked,
}: selectedIndicatorProps) {
	const { theme } = useAppTheme();

	return (
		<Pressable style={{ marginLeft: 8, flexGrow: 1 }} onPress={onClicked}>
			<Text
				style={{
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					color: theme.secondary.a10,
				}}
				numberOfLines={1}
			>
				{displayName || ' '}
			</Text>
			<Text
				style={{
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
					color: theme.secondary.a30,
					fontSize: 12,
				}}
				numberOfLines={1}
			>
				@{username}
			</Text>
			<Text
				style={{
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
					color: selected ? theme.primary.a0 : theme.complementary.a0,
					fontSize: 12,
				}}
				numberOfLines={1}
			>
				{subdomain}
			</Text>
		</Pressable>
	);
}

function AccountListingFragment({ acct, onListChange }: Props) {
	const { theme } = useAppTheme();
	const { appSub } = useAppPublishers();
	const { show, hide } = useAppDialog();
	const { db } = useAppDb();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.DIALOGS]);
	const { loadApp } = useGlobalState(
		useShallow((o) => ({
			loadApp: o.loadApp,
		})),
	);

	function onMoreActions() {
		show(
			DialogBuilderService.appAccountMoreActions(
				t,
				async () => {},
				async () => {
					show(
						DialogBuilderService.deleteAccountConfirm(t, async () => {
							AccountService.removeById(db, acct.id);
							loadApp();
							hide();
							onListChange();
						}),
					);
				},
			),
		);
	}

	const avatar = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		ACCOUNT_METADATA_KEY.AVATAR_URL,
	);
	const displayName = AccountMetadataService.getKeyValueForAccountSync(
		db,
		acct,
		ACCOUNT_METADATA_KEY.DISPLAY_NAME,
	);

	if (!acct) return <View />;
	return (
		<View
			style={{
				backgroundColor: theme.palette.menubar,
				padding: 8,
				paddingVertical: 6,
				marginBottom: 8,
				borderRadius: 8,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
						flexGrow: 1,
					}}
				>
					<AccountPfp
						selected={acct.selected as boolean}
						url={avatar!}
						onClicked={() => {
							AccountService.select(db, acct);
							appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
							loadApp();
						}}
					/>
					<AccountDetails
						onClicked={() => {
							AccountService.select(db, acct);
							appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
							loadApp();
						}}
						selected={acct.selected as boolean}
						displayName={displayName}
						username={acct.username}
						subdomain={acct.server}
					/>
					{acct.selected && (
						<Text
							style={{
								fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
								color: theme.primary.a0,
								fontSize: 16,
								paddingRight: 8,
							}}
						>
							Active
						</Text>
					)}
				</TouchableOpacity>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity
						style={{
							paddingHorizontal: 12,
							paddingVertical: 12,
							flexDirection: 'row',
							alignItems: 'center',
						}}
						onPress={onMoreActions}
					>
						<Feather
							name="more-horizontal"
							size={24}
							color={theme.secondary.a20}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
		width: '100%',
		borderRadius: 6,
	},
	selectedIndicator: {
		position: 'absolute',
		height: 16,
		width: 16,
		backgroundColor: '#9dced7',
		zIndex: 99,
		right: 0,
		bottom: 0,
		borderTopLeftRadius: 8,
		borderBottomEndRadius: 4,
	},
});

export default AccountListingFragment;
