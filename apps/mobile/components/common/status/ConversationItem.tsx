import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useActivitypubStatusContext } from '../../../states/useStatus';
import MfmService from '../../../services/mfm.service';
import { ActivityPubUserAdapter } from '@dhaaga/bridge';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { RandomUtil } from '../../../utils/random.utils';

type ConversationItem = {
	displayName: string;
	accountUrl: string;
	unread?: boolean;
	lastStatusAt?: Date;
};

/**
 * A StatusItem, with the content only
 * @constructor
 */
function ConversationItem({ accountUrl, displayName }: ConversationItem) {
	const { driver, acct, theme } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
			theme: o.colorScheme,
		})),
	);

	const [DescriptionContent, setDescriptionContent] = useState(<></>);
	const [UserInterface, setUserInterface] = useState(
		ActivityPubUserAdapter(null, driver),
	);

	const { status } = useActivitypubStatusContext();
	let content = status.getContent();

	useEffect(() => {
		const emojiMap = UserInterface.getEmojiMap();
		const { reactNodes } = MfmService.renderMfm(content, {
			emojiMap,
			domain: driver,
			subdomain: acct?.server,
			colorScheme: theme,
		});
		setDescriptionContent(
			<>
				{reactNodes?.map((para, i) => {
					const uuid = RandomUtil.nanoId();
					return (
						<Text key={uuid} style={{ marginBottom: 8, opacity: 0.87 }}>
							{/*<FlatList data={para} renderItem={({ item }) => item} />*/}
							{para.map((o, j) => o)}
						</Text>
					);
				})}
			</>,
		);
	}, [content]);

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}
		>
			<View style={{ flexGrow: 1 }}>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text
						style={{
							color: '#fff',
							fontWeight: 700,
							opacity: 0.87,
						}}
					>
						{displayName}
					</Text>
					<Text
						style={{
							color: '#fff',
							fontWeight: 700,
							opacity: 0.6,
						}}
					>
						{accountUrl}
					</Text>
				</View>
				<View
					style={{
						marginBottom: 16,
						opacity: 0.6,
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<FontAwesome5
						name="check"
						size={12}
						color="#fff"
						style={{
							display: 'inline',
						}}
					/>
					{DescriptionContent}
				</View>
			</View>

			<View>
				<Text
					style={{
						color: '#fff',
						opacity: 0.6,
					}}
				>
					12 hours ago
				</Text>
			</View>
		</View>
	);
}

export default ConversationItem;
