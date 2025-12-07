import { memo } from 'react';
import { View } from 'react-native';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import ProfileModuleFactory from './ProfileModuleFactory';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import type { UserObjectType } from '@dhaaga/bridge/typings';

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
			{/*<View style={{ width: ADDITIONAL_INFO_MAX_LABEL_WIDTH }}>*/}
			{/*	{ParsedLabel}*/}
			{/*</View>*/}
			{/*<View style={{ flexGrow: 1, flex: 1, marginLeft: 4 }}>*/}
			{/*	<Text numberOfLines={1}>{ParsedValue}</Text>*/}
			{/*</View>*/}
		</View>
	);
});

type UserProfileExtraInformationProps = {
	acct: UserObjectType;
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
