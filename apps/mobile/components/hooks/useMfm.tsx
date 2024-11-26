import { DependencyList, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import MfmService from '../../services/mfm.service';
import { randomUUID } from 'expo-crypto';
import { Skeleton } from '@rneui/themed';
// import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import * as Crypto from 'expo-crypto';
import WithAppMfmContext from '../../hooks/app/useAppMfmContext';
import { useAppTheme } from '../../hooks/app/useAppThemePack';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import FacetService from '../../services/facets.service';

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
	// const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const { colorScheme } = useAppTheme();

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
				return colorScheme.textColor.high;
			case 'medium':
				return colorScheme.textColor.medium;
			case 'low':
				return colorScheme.textColor.low;
			default:
				return colorScheme.textColor.medium;
		}
	}, [emphasis, colorScheme]);

	// since font remains same for each reusable component
	const fontStyle = {
		color: color,
		fontFamily: fontFamily,
	};

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

		if (domain === KNOWN_SOFTWARE.BLUESKY) {
			const nodes = FacetService.render(content, { fontFamily, emphasis });
			setData({
				isLoaded: true,
				content: (
					<WithAppMfmContext acceptTouch={_acceptTouch}>
						<View style={{ height: 'auto' }}>
							<Text>{nodes.map((node, i) => node)}</Text>
						</View>
					</WithAppMfmContext>
				),
				aiContext: [],
			});
			return;
		}

		const { reactNodes, openAiContext } = MfmService.renderMfm(content, {
			emojiMap: emojiMap || new Map(),
			domain,
			subdomain,
			globalDb,
			remoteSubdomain,
			fontFamily,
			emphasis,
			colorScheme,
		});
		setData({
			isLoaded: true,
			content: (
				<WithAppMfmContext acceptTouch={_acceptTouch}>
					<View style={{ height: 'auto' }}>
						{reactNodes?.map((para) => {
							const uuid = randomUUID();
							if (numberOfLines) {
								return (
									<Text
										key={uuid}
										style={fontStyle as any}
										numberOfLines={numberOfLines}
									>
										{para.map((o, j) => (
											<Text key={j} style={fontStyle as any}>
												{o}
											</Text>
										))}
									</Text>
								);
							} else {
								return (
									<Text key={uuid} style={fontStyle as any}>
										{para.map((o, j) => (
											<Text key={j} style={fontStyle as any}>
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
	}, [...deps, colorScheme]);

	return {
		content: Data.content,
		isLoaded: Data.isLoaded,
		aiContext: Data.aiContext,
	};
}

export default useMfm;
