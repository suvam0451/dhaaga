import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';
import MfmService from '../../services/mfm.service';
import WithAppMfmContext from '../../hooks/app/useAppMfmContext';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import FacetService from '../../services/facets.service';
import { RandomUtil } from '../../utils/random.utils';
import {
	APP_COLOR_PALETTE_EMPHASIS,
	AppThemingUtil,
} from '../../utils/theming.util';
import {
	useAppApiClient,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../styles/AppFonts';
import { TEXT_PARSING_VARIANT } from '../../types/app.types';
import { TextContentView } from '../common/status/TextContentView';

type Props = {
	content: string;
	// Mastodon sup-plied emoji list
	emojiMap: Map<string, string>;
	expectedHeight?: number;
	fontFamily?: string;
	numberOfLines?: number;
	acceptTouch?: boolean;
	emphasis?: APP_COLOR_PALETTE_EMPHASIS;
	variant?: TEXT_PARSING_VARIANT;
	nonInteractive?: boolean;
};

/**
 * Use MfM to render content
 * @param content
 * @param emojiMap
 * @param deps
 * @param fontFamily
 * @param numberOfLines
 * @param acceptTouch
 * @param emphasis
 * @param nonInteractive makes the fragments not interactable
 *
 * @deprecated no longer using this...
 */
function useMfm({
	content,
	emojiMap,
	fontFamily,
	numberOfLines,
	acceptTouch,
	emphasis,
	variant,
	nonInteractive,
}: Props) {
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();

	const defaultValue = useRef<any>({
		isLoaded: false,
		content: <View />,
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
	const fontStyle: StyleProp<TextStyle> = {
		color: AppThemingUtil.getColorForEmphasis(theme.secondary, emphasis),
		fontFamily:
			variant === 'displayName'
				? APP_FONTS.INTER_600_SEMIBOLD
				: APP_FONTS.INTER_400_REGULAR,
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
			const parsed = FacetService.parseTextContent(content);
			setData({
				isLoaded: true,
				content: (
					<WithAppMfmContext acceptTouch={_acceptTouch}>
						<TextContentView
							tree={parsed}
							variant={variant}
							mentions={[]}
							emojiMap={new Map()}
						/>
					</WithAppMfmContext>
				),
				aiContext: [],
			});
			return;
		}

		const { reactNodes, openAiContext } = MfmService.renderMfm(content, {
			emojiMap: emojiMap || new Map(),
			emphasis: emphasis || APP_COLOR_PALETTE_EMPHASIS.A0,
			colorScheme: theme,
			variant,
			nonInteractive,
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
	}, [content, theme]);

	return {
		content: Data.content,
		isLoaded: Data.isLoaded,
		aiContext: Data.aiContext,
	};
}

export default useMfm;
