import { useDbSavedPostStatus } from '#/features/collections/api/useCollectionsQuery';
import { AccountCollection } from '@dhaaga/db';
import useCollections from '#/features/collections/api/useCollections';
import { useState } from 'react';
import { PostInspector } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { useAppDialog } from '#/states/global/hooks';

/**
 * Helps add/remove a post to/from collections
 *
 * Also allows in-place creation of new collections
 * @param postId
 */
function useDbAddPostToCollection(postId: string) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const queryResult = useDbSavedPostStatus(postId);
	const { add, toggleForCollection } = useCollections();
	const { t: tDialog } = useTranslation([LOCALIZATION_NAMESPACE.DIALOGS]);
	const { show } = useAppDialog();

	async function _refetch() {
		setIsRefreshing(true);
		queryResult.refetch().finally(() => setIsRefreshing(false));
	}

	function onToggle(collection: AccountCollection, post: PostObjectType) {
		console.log(collection, PostInspector.getContentTarget(post).id);
		try {
			toggleForCollection(collection, PostInspector.getContentTarget(post));
		} catch (e) {
			console.log('failed to toggle bookmark', e);
		} finally {
			_refetch();
		}
	}

	function onAdd(text: string) {
		add(text);
		_refetch();
	}

	function onRequestAddNewCollection() {
		show(
			{
				title: tDialog(`collection.add.title`),
				description: tDialog(`collection.add.description`, {
					returnObjects: true,
				}) as string[],
				actions: [],
			},
			{
				$type: 'text-prompt',
				placeholder: tDialog(`collection.add.placeholder`),
			},
			(ctx) => {
				if (!ctx || ctx.$type !== 'text-prompt' || !ctx.userInput) return;
				add(ctx.userInput);
				_refetch();
			},
		);
	}

	function onRequestUpdateCollection(collection: AccountCollection) {}

	return {
		...queryResult,
		toggle: onToggle,
		add: onAdd,
		loading: IsRefreshing,
		onRequestAddNewCollection,
		onRequestUpdateCollection,
	};
}

export default useDbAddPostToCollection;
