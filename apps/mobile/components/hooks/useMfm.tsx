import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/src/adapters/profile/_interface';
import { DependencyList, useMemo } from 'react';
import { View } from 'react-native';
import MfmService from '../../services/mfm.service';
import { randomUUID } from 'expo-crypto';
import { Text } from '@rneui/themed';
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
};

/**
 * Use MfM to render content
 * @param content
 * @param emojiMap
 * @param remoteSubdomain
 * @param deps
 */
function useMfm({ content, emojiMap, remoteSubdomain, deps }: Props) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const subdomain = primaryAcct?.subdomain;
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	return useMemo(() => {
		if (content === '') {
			return {
				isLoaded: false,
				content: <View></View>,
				aiContext: [],
			};
		}
		const { reactNodes, openAiContext } = MfmService.renderMfm(content, {
			emojiMap: emojiMap,
			domain,
			subdomain,
			db,
			globalDb,
			remoteSubdomain,
		});
		return {
			isLoaded: true,
			content: reactNodes?.map((para, i) => {
				const uuid = randomUUID();
				return (
					<Text key={uuid} style={{ color: '#fff', opacity: 0.87 }}>
						{para.map((o, j) => o)}
					</Text>
				);
			}),
			aiContext: openAiContext,
		};
	}, deps);
}

export default useMfm;
