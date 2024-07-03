import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/src/adapters/profile/_interface';
import { DependencyList, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MfmService from '../../services/mfm.service';
import { randomUUID } from 'expo-crypto';
import { Skeleton, Text } from '@rneui/themed';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';

type Props = {
	content: string;
	// Mastodon sup-plied emoji list
	emojiMap: Map<string, EmojiMapValue>;
	// instance of the target user (will resolve emojis from there)
	remoteSubdomain: string;
	deps: DependencyList;
	expectedHeight?: number;
};

/**
 * Use MfM to render content
 * @param content
 * @param emojiMap
 * @param remoteSubdomain
 * @param deps
 * @param expectedHeight
 */
function useMfm({
	content,
	emojiMap,
	remoteSubdomain,
	deps,
	expectedHeight,
}: Props) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const subdomain = primaryAcct?.subdomain;
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const [Data, setData] = useState<any>({
		isLoaded: false,
		content: (
			<Skeleton
				style={{
					height: expectedHeight || 54,
					borderRadius: 8,
					width: '100%',
				}}
			/>
		),
		aiContext: [],
	});

	const IsSolved = useRef(null);

	useEffect(() => {
		if (IsSolved.current === content) return;
		if (content === '') {
			setData({
				isLoaded: false,
				content: <View></View>,
				aiContext: [],
			});
		}
		const { reactNodes, openAiContext } = MfmService.renderMfm(content, {
			emojiMap: emojiMap || new Map(),
			domain,
			subdomain,
			db,
			globalDb,
			remoteSubdomain,
		});
		setData({
			isLoaded: true,
			content: reactNodes?.map((para, i) => {
				const uuid = randomUUID();
				return (
					<Text key={uuid} style={{ color: '#fff', opacity: 0.87 }}>
						{para.map((o, j) => (
							<Text key={j}>{o}</Text>
						))}
					</Text>
				);
			}),
			aiContext: openAiContext,
		});
		IsSolved.current = content;
	}, [deps]);

	return {
		content: Data.content,
		isLoaded: Data.isLoaded,
		aiContext: Data.aiContext,
	};
}

export default useMfm;
