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
import * as Crypto from 'expo-crypto';
import { APP_FONTS } from '../../styles/AppFonts';
import WithAppMfmContext from '../../hooks/app/useAppMfmContext';

type Props = {
	content: string;
	// Mastodon sup-plied emoji list
	emojiMap: Map<string, EmojiMapValue>;
	// instance of the target user (will resolve emojis from there)
	remoteSubdomain: string;
	deps: DependencyList;
	expectedHeight?: number;
	fontFamily?: string;

	numberOfLines?: number;
	acceptTouch?: boolean;
};

/**
 * Use MfM to render content
 * @param content
 * @param emojiMap
 * @param remoteSubdomain
 * @param deps
 * @param expectedHeight
 * @param fontFamily
 * @param numberOfLines
 * @param acceptTouch
 */
function useMfm({
	content,
	emojiMap,
	remoteSubdomain,
	deps,
	expectedHeight,
	fontFamily,
	numberOfLines,
	acceptTouch,
}: Props) {
	const { domain, subdomain } = useActivityPubRestClientContext();
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

	const _acceptTouch = acceptTouch === undefined ? true : acceptTouch;

	/**
	 * don't set this to null
	 * some software actually use {content: null}
	 * */
	const IsSolved = useRef(Crypto.randomUUID());

	// since font remains same for each reusable component
	const fontStyle = useRef({
		color: APP_FONT.MONTSERRAT_HEADER,
		fontFamily: fontFamily || APP_FONTS.INTER_400_REGULAR,
	});

	useEffect(() => {
		if (IsSolved.current === content) return;
		setData(defaultValue.current);

		// { text: null } is possible with misskey forks
		if (content === '' || content === null) {
			setData({
				isLoaded: true,
				content: <View></View>,
				aiContext: [],
			});
			IsSolved.current = content;
			return;
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
			content: (
				<WithAppMfmContext acceptTouch={_acceptTouch}>
					{reactNodes?.map((para) => {
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
					})}
				</WithAppMfmContext>
			),
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
