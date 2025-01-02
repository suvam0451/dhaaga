import { DependencyList, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import MfmService from '../../services/mfm.service';
import { Skeleton } from '@rneui/themed';
import WithAppMfmContext from '../../hooks/app/useAppMfmContext';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import FacetService from '../../services/facets.service';
import { RandomUtil } from '../../utils/random.utils';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../utils/theming.util';
import {
	useAppAcct,
	useAppApiClient,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';

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
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
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
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { driver } = useAppApiClient();

	const defaultValue = useRef<any>({
		isLoaded: false,
		content: (
			<Skeleton
				style={{
					height: expectedHeight || 32,
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
	const IsSolved = useRef(RandomUtil.nanoId());

	// since font remains same for each reusable component
	const fontStyle = {
		color: AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis),
		// fontFamily: fontFamily,
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

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
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
			subdomain: acct?.server,
			remoteSubdomain,
			fontFamily,
			emphasis,
			colorScheme: theme,
			style: {
				fontFamily,
			},
		});
		setData({
			isLoaded: true,
			content: (
				<WithAppMfmContext acceptTouch={_acceptTouch}>
					<View style={{ height: 'auto' }}>
						{reactNodes?.map((para) => {
							const uuid = RandomUtil.nanoId();
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
	}, [...deps, theme]);

	return {
		content: Data.content,
		isLoaded: Data.isLoaded,
		aiContext: Data.aiContext,
	};
}

export default useMfm;
