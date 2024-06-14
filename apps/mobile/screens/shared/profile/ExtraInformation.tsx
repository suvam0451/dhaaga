import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../styles/AppTheme';
import { useActivitypubUserContext } from '../../../states/useProfile';
import useMfm from '../../../components/hooks/useMfm';

type ExtraInformationFieldProps = {
	fieldName: string;
	value: string;
};

function ExtraInformationField({
	fieldName,
	value,
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
				paddingTop: 8,
				paddingBottom: 8,
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<View style={{ width: 72 }}>
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_HEADER,
						maxWidth: 72,
					}}
					numberOfLines={1}
				>
					{fieldName}
				</Text>
			</View>
			<View style={{ flexGrow: 1 }}>
				<Text>{ParsedValue}</Text>
			</View>
		</View>
	);
}

type UserProfileExtraInformationProps = {
	fields: any[];
};

function UserProfileExtraInformation({
	fields,
}: UserProfileExtraInformationProps) {
	const [IsExpanded, setIsExpanded] = useState(false);

	const fieldsCount = fields.length;
	return (
		<View>
			<View
				style={{
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
					paddingHorizontal: 16,
				}}
			>
				<TouchableOpacity
					onPress={() => {
						setIsExpanded(!IsExpanded);
					}}
				>
					<View style={styles.expandableSectionMarkerContainer}>
						<Text style={{ color: APP_FONT.MONTSERRAT_HEADER, flexGrow: 1 }}>
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
				<View
					style={{
						display: IsExpanded ? 'flex' : 'none',
						paddingLeft: 8,
						paddingRight: 8,
						backgroundColor: '#1E1E1E',
						borderRadius: 8,
					}}
				>
					{fields?.map((x, i) => (
						<ExtraInformationField key={i} fieldName={x.name} value={x.value} />
					))}
				</View>
			</View>
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
});

export default UserProfileExtraInformation;
