import { DependencyList, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import MfmService from '../../services/mfm.service';
import { randomUUID } from 'expo-crypto';
import { Skeleton } from '@rneui/themed';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import { APP_FONT } from '../../styles/AppTheme';
import * as Crypto from 'expo-crypto';
import WithAppMfmContext from '../../hooks/app/useAppMfmContext';

type Props = {
	content: string;
	// Mastodon sup-plied emoji list
	emojiMap: Map<string, string>;
	// instance of the target user (will resolve emojis from there)
	remoteSubdomain: string;
	deps: DependencyList;
	expectedHeight?: number;
	fontFamily?: string;

	numberOfLines?: number;
	acceptTouch?: boolean;
	emphasis?: 'high' | 'medium' | 'low';
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
 * @param emphasis
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
	emphasis,
}: Props) {
	const { domain, subdomain } = useActivityPubRestClientContext();
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const defaultValue = useRef<any>({
		isLoaded: false,
		content: (
			<Skeleton
				style={{
					height: expectedHeight || 108,
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

	let color = useMemo(() => {
		switch (emphasis) {
			case 'high':
				return APP_FONT.HIGH_EMPHASIS;
			case 'medium':
				return APP_FONT.MEDIUM_EMPHASIS;
			case 'low':
				return APP_FONT.LOW_EMPHASIS;
			default:
				return APP_FONT.MEDIUM_EMPHASIS;
		}
	}, [emphasis]);
	console.log(emphasis, color);

	// since font remains same for each reusable component
	const fontStyle = useRef({
		color: color,
		fontFamily: fontFamily,
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
			fontFamily,
			emphasis,
		});
		setData({
			isLoaded: true,
			content: (
				<WithAppMfmContext acceptTouch={_acceptTouch}>
					<View style={{ height: 'auto', flex: 1 }}>
						{reactNodes?.map((para) => {
							const uuid = randomUUID();
							if (numberOfLines) {
								return (
									<Text
										key={uuid}
										style={fontStyle.current as any}
										numberOfLines={numberOfLines}
									>
										{para.map((o, j) => (
											<Text key={j} style={fontStyle.current as any}>
												{o}
											</Text>
										))}
									</Text>
								);
							} else {
								return (
									<Text key={uuid} style={fontStyle.current as any}>
										{para.map((o, j) => (
											<Text key={j} style={fontStyle.current as any}>
												{o}
											</Text>
										))}
									</Text>
								);
							}
						})}
					</View>
				</WithAppMfmContext>
			),
			aiContext: openAiContext,
		});
		IsSolved.current = content;
	}, [...deps]);

	return {
		content: Data.content,
		isLoaded: Data.isLoaded,
		aiContext: Data.aiContext,
	};
}

export default useMfm;
