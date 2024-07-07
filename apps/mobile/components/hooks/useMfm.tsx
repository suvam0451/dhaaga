import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/profile/_interface';
import { DependencyList, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MfmService from '../../services/mfm.service';
import { randomUUID } from 'expo-crypto';
import { Skeleton, Text } from '@rneui/themed';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import { APP_FONT } from '../../styles/AppTheme';

type Props = {
	content: string;
	// Mastodon sup-plied emoji list
	emojiMap: Map<string, EmojiMapValue>;
	// instance of the target user (will resolve emojis from there)
	remoteSubdomain: string;
	deps: DependencyList;
	expectedHeight?: number;
	fontFamily?: string;
};

/**
 * Use MfM to render content
 * @param content
 * @param emojiMap
 * @param remoteSubdomain
 * @param deps
 * @param expectedHeight
 * @param fontFamily
 */
function useMfm({
	content,
	emojiMap,
	remoteSubdomain,
	deps,
	expectedHeight,
	fontFamily,
}: Props) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const subdomain = primaryAcct?.subdomain;
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const defaultValue = useRef<any>({
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

	const [Data, setData] = useState(defaultValue.current);

	const IsSolved = useRef(null);

	// since font remains same for each reusable component
	const fontStyle = useRef({
		color: APP_FONT.MONTSERRAT_HEADER,
		fontFamily: fontFamily || 'Inter',
	});

	useEffect(() => {
		if (IsSolved.current === content) return;
		if (content === '') {
			setData({
				isLoaded: false,
				content: <View></View>,
				aiContext: [],
			});
		}
		setData(defaultValue.current);
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
					<Text key={uuid} style={fontStyle.current}>
						{para.map((o, j) => (
							<Text key={j} style={fontStyle.current}>
								{o}
							</Text>
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
