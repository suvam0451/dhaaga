import { useActivitypubStatusContext } from '../../../../../states/useStatus';
import { StyleSheet, View } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useMemo, useState } from 'react';
import MfmService from '../../../../../services/mfm.service';
import { randomUUID } from 'expo-crypto';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { useGlobalMmkvContext } from '../../../../../states/useGlobalMMkvCache';
import { ActivityPubUserAdapter } from '@dhaaga/shared-abstraction-activitypub';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../../styles/AppTheme';

function ChatItem() {
	const { status } = useActivitypubStatusContext();
	const { me, domain, subdomain } = useActivityPubRestClientContext();
	const { globalDb } = useGlobalMmkvContext();
	const [UserInterface, setUserInterface] = useState(
		ActivityPubUserAdapter(null, domain),
	);

	let content = status.getContent();

	const DescriptionContent = useMemo(() => {
		const target = status?.getContent();
		if (!target) return <View></View>;

		const emojiMap = new Map();
		const { reactNodes } = MfmService.renderMfm(content, {
			emojiMap,
			domain,
			subdomain,
			remoteSubdomain: UserInterface?.getInstanceUrl(),
			globalDb,
			colorScheme: null,
		});
		return reactNodes?.map((para) => {
			const uuid = randomUUID();
			return (
				<Text key={uuid} style={{ marginBottom: 8, opacity: 0.87 }}>
					{para.map((o, j) => (
						<Text key={j}>{o}</Text>
					))}
				</Text>
			);
		});
	}, [status?.getContent()]);

	const ownerIsMe = me?.getId() === status.getAccountId_Poster();
	const day = format(new Date(status.getCreatedAt()), 'MM/dd');
	const time = format(new Date(status.getCreatedAt()), 'h:mm a');

	return (
		<View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: ownerIsMe ? 'flex-end' : 'flex-start',
					alignItems: ownerIsMe ? 'center' : 'flex-start',
				}}
			>
				{!ownerIsMe && (
					<View
						style={{
							width: 32,
							height: 32,
							borderRadius: 16,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image style={styles.senderIcon} source={status.getAvatarUrl()} />
					</View>
				)}
				<View>
					{ownerIsMe && <Text style={styles.day}>{day}</Text>}
					{ownerIsMe && <Text style={styles.day}>{time}</Text>}
				</View>
				<View
					style={{
						display: 'flex',
						justifyContent: ownerIsMe ? 'flex-end' : 'flex-start',
						maxWidth: '80%',
						marginLeft: 4,
					}}
				>
					{!ownerIsMe && (
						<Text style={styles.displayName}>{status.getDisplayName()}</Text>
					)}
					<View
						style={[
							styles.chatBubble,
							{
								backgroundColor: ownerIsMe ? '#0a2e34' : '#444',
								borderTopRightRadius: ownerIsMe ? 0 : 8,
								borderTopLeftRadius: !ownerIsMe ? 0 : 8,
							},
						]}
					>
						{DescriptionContent}
					</View>
				</View>
				<View style={{ marginTop: 'auto', marginBottom: 8, marginLeft: 4 }}>
					{!ownerIsMe && (
						<Text style={[styles.day, { textAlign: 'left' }]}>{day}</Text>
					)}
					{!ownerIsMe && <Text style={styles.time}>{time}</Text>}
				</View>
			</View>
		</View>
	);
}

export default ChatItem;

// @ts-ignore
const styles = StyleSheet.create({
	timestampContainer: {},
	chatBubble: {
		padding: 4,
		paddingHorizontal: 12,
		marginVertical: 0,
		borderRadius: 8,
		marginBottom: 8,
	},
	senderIcon: {
		width: 32,
		height: 32,
		borderRadius: 8,
		opacity: 0.87,
	},
	displayName: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 14, // opacity: 0.87,
		fontFamily: 'Montserrat-Bold',
	}, // @ts-ignore
	day: {
		color: '#fff',
		marginBottom: 0,
		fontSize: 10,
		opacity: 0.6,
		textAlign: 'right',
	},
	time: {
		color: '#fff',
		marginBottom: 0,
		fontSize: 10,
		opacity: 0.6,
		textAlign: 'right',
	},
});
