import { useCollectionListInteractor } from '../api/useCollectionsQuery';
import { View } from 'react-native';
import CollectionListView from '../views/CollectionListView';
import { useState } from 'react';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import { useAppDialog } from '../../../hooks/utility/global-state-extractors';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

function CollectionListPresenter() {
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
			t(`collection.add.placeholder`),
			(text: string) => {
				add(text);
				refetch();
			},
		);
	}

	function onItemPress(id: number) {
		router.navigate({
			pathname: APP_ROUTING_ENUM.APP_FEATURE_COLLECTION,
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
							t(`collection.rename.placeholder`),
							(text: string) => {
								rename(id, text);
								hide();
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
							t(`collection.describe.placeholder`),
							(text: string) => {
								describe(id, text);
								hide();
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
		<CollectionListView
			onAdd={onAdd}
			onPress={onItemPress}
			onLongPress={onItemLongPress}
			items={data}
			refresh={onRefresh}
			refreshing={IsRefreshing}
		/>
	);
}

export default CollectionListPresenter;
