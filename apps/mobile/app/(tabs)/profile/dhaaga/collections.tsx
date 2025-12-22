import { useCollectionListInteractor } from '#/features/collections/api/useCollectionsQuery';
import {
	FlatList,
	Pressable,
	RefreshControl,
	View,
	StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import { useAppDialog, useAppTheme } from '#/states/global/hooks';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { AccountCollection } from '@dhaaga/db';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppCtaButton } from '#/components/lib/Buttons';
import { appDimensions } from '#/styles/dimensions';
import { NativeTextNormal, NativeTextBold } from '#/ui/NativeText';

type ListItemViewProps = {
	item: AccountCollection;
	onPress: () => void;
	onLongPress: () => void;
};

function ListItemView({ onPress, onLongPress, item }: ListItemViewProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<Pressable style={styles.root} onPress={onPress} onLongPress={onLongPress}>
			<View
				style={[
					styles.iconContainer,
					{
						borderColor: theme.secondary.a50,
					},
				]}
			>
				<AppIcon id={'albums-outline'} size={24} color={theme.secondary.a20} />
			</View>
			<View style={{ marginLeft: 16, justifyContent: 'center' }}>
				<NativeTextBold
					style={{
						fontSize: 18,
						color: theme.primary,
					}}
				>
					{item.alias}
				</NativeTextBold>
				<NativeTextNormal
					style={{
						color: theme.secondary.a20,
					}}
				>
					{item.desc || t(`collections.fallbackDesc`)}
				</NativeTextNormal>
			</View>
			<View style={{ flexGrow: 1 }} />
			<AppIcon
				id={'chevron-right'}
				size={32}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				onPress={() => {}}
			/>
		</Pressable>
	);
}

type CollectionListInteractorProps = {
	items: AccountCollection[];
	onAdd: () => void;
	onPress: (id: number) => void;
	onLongPress: (id: number) => void;
	refresh: () => void;
	refreshing: boolean;
};

function ListView({
	items,
	onAdd,
	onPress,
	onLongPress,
	refresh,
	refreshing,
}: CollectionListInteractorProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();
	return (
		<>
			<NavBar_Simple
				label={t(`collections.name`)}
				animatedStyle={animatedStyle}
			/>
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<ListItemView
						item={item}
						onPress={() => {
							onPress(item.id);
						}}
						onLongPress={() => {
							onLongPress(item.id);
						}}
					/>
				)}
				style={{
					backgroundColor: theme.background.a0,
				}}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
					paddingHorizontal: 10,
				}}
				ListFooterComponent={
					<AppCtaButton label={t(`collections.addButton`)} onPress={onAdd} />
				}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={refresh} />
				}
			/>
		</>
	);
}

function Page() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, error, refetch, add, remove, rename, describe } =
		useCollectionListInteractor();
	const { show, hide } = useAppDialog();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.DIALOGS]);

	if (error) return <View />;

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	function onAdd() {
		show(
			{
				title: t(`collection.add.title`),
				description: t(`collection.add.description`, {
					returnObjects: true,
				}) as string[],
				actions: [],
			},
			{ $type: 'text-prompt', placeholder: t(`collection.add.placeholder`) },
			(ctx) => {
				if (ctx.$type !== 'text-prompt') return;
				if (!ctx.userInput) return;
				add(ctx.userInput.trim());
				refetch();
			},
		);
	}

	function onItemPress(id: number) {
		router.navigate({
			pathname: APP_ROUTING_ENUM.SPECIAL_FEATURE_COLLECTION_VIEW,
			params: {
				id,
			},
		});
	}

	function onItemLongPress(id: number) {
		Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		show({
			title: t(`collection.moreOptions.title`),
			description: t(`collection.moreOptions.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`collection.moreOptions.renameOption`),
					onPress: async () => {
						show(
							{
								title: t(`collection.rename.title`),
								description: t(`collection.rename.description`, {
									returnObjects: true,
								}) as string[],
								actions: [],
							},
							{
								$type: 'text-prompt',
								placeholder: t(`collection.rename.placeholder`),
							},
							(ctx) => {
								if (ctx.$type !== 'text-prompt') return;
								if (!ctx.userInput) return;
								rename(id, ctx.userInput.trim());
							},
						);
					},
				},
				{
					label: t(`collection.moreOptions.updateDescriptionOption`),
					onPress: async () => {
						show(
							{
								title: t(`collection.describe.title`),
								description: t(`collection.describe.description`, {
									returnObjects: true,
								}) as string[],
								actions: [],
							},
							{
								$type: 'text-prompt',
								placeholder: t(`collection.describe.placeholder`),
							},
							(ctx) => {
								if (ctx.$type !== 'text-prompt') return;
								if (!ctx.userInput) return;
								const text = ctx.userInput.trim();
								describe(id, text);
							},
						);
					},
				},
				{
					label: t(`collection.moreOptions.removeOption`),
					variant: 'destructive',
					onPress: async () => {
						show({
							title: t(`collection.delete.title`),
							description: t(`collection.delete.description`, {
								returnObjects: true,
							}) as string[],
							actions: [
								{
									label: t(`collection.delete.deleteConfirmOption`),
									variant: 'destructive',
									onPress: async () => {
										remove(id);
										hide();
									},
								},
							],
						});
					},
				},
			],
		});
	}

	return (
		<ListView
			onAdd={onAdd}
			onPress={onItemPress}
			onLongPress={onItemLongPress}
			items={data}
			refresh={onRefresh}
			refreshing={IsRefreshing}
		/>
	);
}

export default Page;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		marginBottom: 16,
		alignItems: 'center',
		paddingRight: 4,
	},
	iconContainer: {
		padding: 16,
		borderWidth: 2,
		borderRadius: 12,
	},
});
