import { memo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useActivitypubUserContext } from '../../../../states/useProfile';
import useMfm from '../../../hooks/useMfm';
import Animated, { FadeIn } from 'react-native-reanimated';

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

	const { content: ParsedValue } = useMfm({
		content: value,
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [value],
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
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						maxWidth: ADDITIONAL_INFO_MAX_LABEL_WIDTH,
						fontFamily: 'Inter-Bold',
					}}
					numberOfLines={2}
				>
					{label}
				</Text>
			</View>
			<View style={{ flexGrow: 1, flex: 1, marginLeft: 4 }}>
				<Text numberOfLines={1}>{ParsedValue}</Text>
			</View>
		</View>
	);
});

type UserProfileExtraInformationProps = {
	fields: any[];
};

function UserProfileExtraInformation({
	fields,
}: UserProfileExtraInformationProps) {
	const [IsExpanded, setIsExpanded] = useState(false);

	const fieldsCount = fields?.length;
	return (
		<View
			style={{
				borderTopLeftRadius: 8,
				borderTopRightRadius: 8,
				paddingHorizontal: 8,
			}}
		>
			<TouchableOpacity
				onPress={() => {
					setIsExpanded(!IsExpanded);
				}}
			>
				<View style={styles.expandableSectionMarkerContainer}>
					<Text
						style={{
							fontFamily: 'Montserrat-Bold',
							color: APP_FONT.MONTSERRAT_BODY,
							flexGrow: 1,
						}}
					>
						Additional Info{' '}
						<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
							({fieldsCount})
						</Text>
					</Text>
					<Ionicons
						name={IsExpanded ? 'chevron-down' : 'chevron-forward'}
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</TouchableOpacity>
			<Animated.View
				style={[
					{
						display: IsExpanded ? 'flex' : 'none',
					},
					styles.section,
				]}
				entering={FadeIn}
			>
				{fields?.map((x, i) => (
					<ExtraInformationField
						key={i}
						label={x.name}
						value={x.value}
						last={i === fields?.length - 1}
					/>
				))}
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	expandableSectionMarkerContainer: {
		marginVertical: 6,
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#272727',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	section: {
		paddingLeft: 8,
		paddingRight: 8,
		paddingVertical: 8,
		backgroundColor: '#1E1E1E',
		borderRadius: 8,
		marginBottom: 8,
	},
});

export default UserProfileExtraInformation;
