import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { memo, MutableRefObject } from 'react';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import { Account } from '../../../database/_schema';
import {
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
} from '../../../database/entities/account-metadata';
import { AccountService } from '../../../database/entities/account';
import {
	useAppDb,
	useAppDialog,
	useAppPublishers,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { APP_EVENT_ENUM } from '../../../services/publishers/app.publisher';

type Props = {
	acct: Account;
};

type AccountOptionsProps = {
	IsExpanded: boolean;
	setDeleteDialogExpanded: (o: boolean) => void;
	dialogTarget: MutableRefObject<Account>;
	acct: Account;
};

const ICON_SIZE = 22;

/**
 * @deprecated
 */
export const AccountOptions = memo(function Foo({
	IsExpanded,
	dialogTarget,
	setDeleteDialogExpanded,
	acct,
}: AccountOptionsProps) {
	const { theme } = useAppTheme();

	function onFixClicked() {
		// FIXME: point this to the sql account
		dialogTarget.current = acct;
	}

	const textStyle = {
		color: theme.textColor.medium,
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		fontSize: 16,
		marginTop: 4,
	};

	return (
		<View
			style={{
				display: IsExpanded ? 'flex' : 'none',
				marginTop: 8,
				paddingHorizontal: 8,
				borderRadius: 8,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
					marginVertical: 8,
					paddingVertical: 4,
				}}
			>
				<TouchableOpacity style={styles.actionButton}>
					<Octicons
						name="browser"
						size={ICON_SIZE}
						color={theme.textColor.medium}
					/>
					<Text style={textStyle}>Edit</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} onPress={onFixClicked}>
					<MaterialIcons
						name="auto-fix-high"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text style={textStyle}>Fix</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton}>
					<Octicons
						name="sync"
						size={ICON_SIZE}
						color={theme.textColor.medium}
					/>
					<Text style={textStyle}>Sync</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => {
						dialogTarget.current = acct;
						setDeleteDialogExpanded(true);
					}}
				>
					<FontAwesome name="trash-o" size={ICON_SIZE} color={'#ce6779'} />
					<Text style={textStyle}>Remove</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
});

type AccountPfpProps = {
	url: string;
	selected: boolean;
	onClicked: () => void;
};

export const AccountPfp = memo(function Foo({
	url,
	selected,
	onClicked,
}: AccountPfpProps) {
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
});

type selectedIndicatorProps = {
	displayName?: string;
	username: string;
	subdomain: string;
	selected: boolean;
	onClicked: () => void;
};
export const AccountDetails = memo(function Foo({
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
});

function AccountListingFragment({ acct }: Props) {
	const { theme } = useAppTheme();
	const { appSub } = useAppPublishers();
	const { show, hide } = useAppDialog();
	const { db } = useAppDb();

	function onMoreActions() {
		show(
			DialogBuilderService.appAccountMoreActions(
				async () => {},
				async () => {
					show(
						DialogBuilderService.deleteAccountConfirm(async () => {
							AccountService.removeById(db, acct.id);
							appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
							hide();
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
						url={avatar}
						onClicked={() => {
							AccountService.select(db, acct);
							appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
						}}
					/>
					<AccountDetails
						onClicked={() => {
							AccountService.select(db, acct);
							appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
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
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		flex: 1,
		width: '100%',
		borderRadius: 6,
	},
	actionButton: {
		flex: 1,
		paddingVertical: 6,
		alignItems: 'center',
		marginRight: 8,
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
