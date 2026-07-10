import { View, Pressable, StyleSheet } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { NativeTextMedium } from '#/ui/NativeText';
import { useAppTheme } from '#/states/global/hooks';
import { AppDivider } from '#/components/lib/Divider';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { MenuView } from '@expo/ui/community/menu';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useState } from 'react';
import { AppText } from '#/components/lib/Text';
import AppSwitch from '#/ui/Switch';
import AppInlinePicker from '#/ui/InlinePicker';

function Divider() {
	const { theme } = useAppTheme();
	return (
		<AppDivider.Hard
			style={{
				flex: 1,
				backgroundColor: theme.background.a50,
				marginTop: 16,
			}}
		/>
	);
}

const TIMELINE_SETTINGS_CONTENT_WARNINGS = [
	{ id: 'show_separate', title: 'Show (Separate Row)' },
	{
		id: 'show_inline',
		title: 'Show (Inline)',
	},
	{
		id: 'hide',
		title: 'Always Hide',
	},
];
const TIMELINE_SETTINGS_TRAILING_HASHTAGS = [
	{
		id: 'collapse',
		title: 'Show First Five',
		label: 'Show First Five',
	},
	{
		id: 'trim_all',
		title: 'Always Remove',
		label: 'Always Remove',
	},
	{
		id: 'show_all',
		title: 'Always Show',
		label: 'Always Show',
	},
];

const TIMELINE_SETTINGS_STAT_COUNTERS = [
	{ id: 'show_separate', title: 'Show (Separate Row)' },
	{
		id: 'show_inline',
		title: 'Show (Inline)',
	},
	{
		id: 'hide',
		title: 'Always Hide',
	},
];

function TimelineSettings() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SETTINGS]);
	const [IsChecked, setIsChecked] = useState(false);

	function toggleCheck() {
		setIsChecked(!IsChecked);
	}

	return (
		<>
			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<AppIcon id={'language'} size={28} color={theme.primary} />
				<NativeTextMedium
					style={{ fontSize: 18, color: theme.primary, marginLeft: 6 }}
				>
					{t(`general.timelines.S_Timelines`)}
				</NativeTextMedium>
			</View>
			<Divider />

			{/*	Content Warnings */}
			<View style={styles.settingItemContainer}>
				<NativeTextMedium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={{ fontSize: 18 }}
				>
					{t(`general.timelines.L_contentWarnings`)}
				</NativeTextMedium>
				<MenuView
					style={{
						flex: 1,
						alignItems: 'flex-end',
					}}
					actions={TIMELINE_SETTINGS_CONTENT_WARNINGS}
				>
					<Pressable
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
					>
						<NativeTextMedium
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							style={{ textAlign: 'right' }}
							color={theme.complementary}
						>
							Hide (Sensitive)
						</NativeTextMedium>
						<AppIcon
							id={'chevron-right'}
							color={theme.complementary}
							size={28}
						/>
					</Pressable>
				</MenuView>
			</View>

			{/*	Stat Counters */}
			<View style={styles.settingItemContainer}>
				<NativeTextMedium
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={{ fontSize: 18 }}
				>
					Stat Counters
				</NativeTextMedium>
				<MenuView
					style={{
						flex: 1,
						alignItems: 'flex-end',
					}}
					actions={TIMELINE_SETTINGS_STAT_COUNTERS}
				>
					<Pressable
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
					>
						<NativeTextMedium
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							style={{ textAlign: 'right' }}
							color={theme.complementary}
						>
							Hide (Sensitive)
						</NativeTextMedium>
						<AppIcon
							id={'chevron-right'}
							color={theme.complementary}
							size={28}
						/>
					</Pressable>
				</MenuView>
			</View>

			{/* Lurker Mode */}
			<View style={styles.settingItemContainer}>
				<View>
					<NativeTextMedium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						{t(`general.timelines.L_lurkerMode`)}
					</NativeTextMedium>
					<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
						{t(`general.timelines.D_lurkerMode`)}
					</AppText.Normal>
				</View>
				<View style={{ flex: 1 }} />
				<AppSwitch value={IsChecked} onValueChange={toggleCheck} />
			</View>

			{/*	Confirm to Share */}
			<View style={styles.settingItemContainer}>
				<View>
					<NativeTextMedium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						Confirm to Share
					</NativeTextMedium>
				</View>
				<View style={{ flex: 1 }} />
				<AppSwitch value={IsChecked} onValueChange={toggleCheck} />
			</View>

			{/*	Confirm to Like */}
			<View style={styles.settingItemContainer}>
				<View>
					<NativeTextMedium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						Confirm to Like
					</NativeTextMedium>
				</View>

				<View style={{ flex: 1 }} />
				<AppSwitch value={IsChecked} onValueChange={toggleCheck} />
			</View>

			{/*	Compact Hashtags */}
			<View style={styles.settingItemContainer}>
				<View style={{ flex: 1 }}>
					<NativeTextMedium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={{ fontSize: 18 }}
					>
						Trailing Hashtags
					</NativeTextMedium>
					<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}>
						Reduces hashtag clutter
					</AppText.Normal>
				</View>
				<AppInlinePicker
					value={TIMELINE_SETTINGS_TRAILING_HASHTAGS[0].label}
					options={TIMELINE_SETTINGS_TRAILING_HASHTAGS}
					onSelect={() => {}}
				/>
			</View>
		</>
	);
}

export default TimelineSettings;

const styles = StyleSheet.create({
	text: {
		marginTop: '50%',
		fontSize: 18,
		textAlign: 'center',
	},
	settingItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 56,
	},
});
