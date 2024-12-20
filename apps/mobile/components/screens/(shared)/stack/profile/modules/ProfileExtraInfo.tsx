import { memo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { useActivitypubUserContext } from '../../../../../../states/useProfile';
import useMfm from '../../../../../hooks/useMfm';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ProfileModuleFactory from './ProfileModuleFactory';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { AppUserDto } from '../../../../../../types/app-user.types';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type ExtraInformationFieldProps = {
	label: string;
	value: string;
	last?: boolean;
};

const ADDITIONAL_INFO_MAX_LABEL_WIDTH = 96;

const ExtraInformationField = memo(function Foo({
	label,
	value,
	last,
}: ExtraInformationFieldProps) {
	const { user } = useActivitypubUserContext();
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);

	const { content: ParsedValue } = useMfm({
		content: value,
		remoteSubdomain: user?.getInstanceUrl(acct?.server),
		emojiMap: user?.getEmojiMap(),
		deps: [value],
		emphasis: 'medium',
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	});
	const { content: ParsedLabel } = useMfm({
		content: label,
		remoteSubdomain: user?.getInstanceUrl(acct?.server),
		emojiMap: user?.getEmojiMap(),
		deps: [label],
		emphasis: 'high',
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				paddingVertical: 8,
				borderBottomWidth: last ? 0 : 1,
				borderColor: 'rgba(50, 50, 50, 0.87)',
			}}
		>
			<View style={{ width: ADDITIONAL_INFO_MAX_LABEL_WIDTH }}>
				{ParsedLabel}
			</View>
			<View style={{ flexGrow: 1, flex: 1, marginLeft: 4 }}>
				<Text numberOfLines={1}>{ParsedValue}</Text>
			</View>
		</View>
	);
});

type UserProfileExtraInformationProps = {
	acct: AppUserDto;
};

function UserProfileExtraInformation({
	acct,
}: UserProfileExtraInformationProps) {
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);
	if (driver === KNOWN_SOFTWARE.BLUESKY) return <View />;

	const FIELDS = acct?.meta?.fields || [];

	const fieldsCount = FIELDS.length;
	return (
		<ProfileModuleFactory
			style={{
				paddingHorizontal: 8,
			}}
			label={'Additional Info'}
			subtext={`${fieldsCount}`}
			disabled={FIELDS.length === 0}
		>
			{FIELDS.map((x, i) => (
				<ExtraInformationField
					key={i}
					label={x.name}
					value={x.value}
					last={i === FIELDS.length - 1}
				/>
			))}
		</ProfileModuleFactory>
	);
}

export default UserProfileExtraInformation;
