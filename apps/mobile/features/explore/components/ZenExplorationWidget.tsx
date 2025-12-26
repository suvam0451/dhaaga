import { getSearchTabs } from '@dhaaga/db';
import {
	DiscoverStateAction,
	useDiscoverDispatch,
	useDiscoverState,
} from '@dhaaga/core';
import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { AppIcon } from '#/components/lib/Icon';
import { useRef, useState } from 'react';
import { Pressable, TextInput, View, StyleSheet } from 'react-native';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import AppSegmentedControl from '#/ui/AppSegmentedControl';
import AppWidget from '#/features/widgets/AppWidget';

function ZenExplorationWidget() {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const State = useDiscoverState();
	const dispatch = useDiscoverDispatch();

	const navItems = driver
		? getSearchTabs(driver).map((o) => ({
				label: o,
				active: State.tab === o,
				onPress: () =>
					dispatch({
						type: DiscoverStateAction.SET_CATEGORY,
						payload: {
							tab: o,
						},
					}),
			}))
		: [];

	const TextRef = useRef<TextInput>(null);
	const [WidgetOpen, setWidgetOpen] = useState(false);
	const [SearchTerm, setSearchTerm] = useState(null);

	/**
	 * Functions
	 */

	function onWidgetOpen() {
		const WAS_OPEN = WidgetOpen;
		setWidgetOpen((o) => !o);
		if (!WAS_OPEN) {
			setTimeout(() => TextRef.current?.focus(), 200);
		} else {
			setTimeout(() => TextRef.current?.blur(), 200);
		}
	}

	function onClearSearch() {
		setSearchTerm(null);
	}

	function onSubmit() {
		setWidgetOpen(false);
		dispatch({
			type: DiscoverStateAction.SET_SEARCH,
			payload: {
				q: SearchTerm,
			},
		});
		dispatch({
			type: DiscoverStateAction.APPLY_SEARCH,
		});
	}

	return (
		<>
			<AppWidget
				visible={true}
				isOpen={WidgetOpen}
				activeIcon={'search'}
				inactiveIcon={'search'}
				onWidgetPress={onWidgetOpen}
				ForegroundSlot={
					<View
						style={[
							{
								marginVertical: 'auto',
								alignItems: 'center',
								flexDirection: 'row',
								zIndex: 100,
							},
						]}
					>
						<Pressable
							style={{
								paddingVertical: 12,
								paddingHorizontal: 12,
								paddingRight: 6,
								marginRight: 6,
							}}
							onPress={onClearSearch}
						>
							<AppIcon id={'clear'} color={theme.primaryText} />
						</Pressable>
						<TextInput
							ref={TextRef}
							multiline={false}
							placeholder={t(`discover.welcome`)}
							value={SearchTerm}
							onChangeText={setSearchTerm}
							numberOfLines={1}
							autoCorrect={false}
							autoCapitalize={'none'}
							placeholderTextColor={theme.primaryText}
							onSubmitEditing={onSubmit}
							style={{
								flex: 1,
								color: theme.primaryText,
							}}
						/>
					</View>
				}
				BackgroundSlot={
					<AppSegmentedControl
						items={navItems}
						ListFooterComponent={() => (
							<View style={{ backgroundColor: theme.primary, flex: 1 }}></View>
						)}
						ListHeaderComponent={() => (
							<View style={styles.exploreMenuItem}>
								<AppIcon id={'planet-outline'} />
							</View>
						)}
						paddingLeft={16}
					/>
				}
			/>
		</>
	);
}

export default ZenExplorationWidget;

const styles = StyleSheet.create({
	icon: { paddingVertical: 12, paddingHorizontal: 12 },
	exploreMenuItem: {
		paddingVertical: 12,
		paddingRight: 12,
	},
});
