import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountCollection } from '../../../database/_schema';
import { AccountCollectionService } from '../../../database/entities/account-collection';
import {
	useAppAcct,
	useAppDb,
} from '../../../hooks/utility/global-state-extractors';
import { AppPostObject } from '../../../types/app-post.types';
import { AccountSavedPostService } from '../../../database/entities/account-saved-post';

export function useDbCollections() {
	const { db } = useAppDb();
	const { acct } = useAppAcct();
	const queryClient = useQueryClient();

	const rename = useMutation({
		mutationKey: ['accountCollection', 'rename'],
		mutationFn: async ({
			collection,
			alias,
		}: {
			collection: AccountCollection;
			alias: string;
		}) => {
			AccountCollectionService.renameCollection(db, collection.id, alias);
			return;
		},
		onSuccess: (data) => {
			console.log('Data updated successfully', data);
			// Update any relevant UI state or local UI cache here
		},
		onError: (error) => {
			console.error('Error updating data', error);
			// Handle error state (e.g., display error message)
		},
	});

	const add = useMutation({
		mutationKey: ['accountCollection', 'add'],
		mutationFn: async ({ name }: { name: string }) => {
			AccountCollectionService.addCollection(db, acct, name);
		},
		onSuccess: () => {},
		onError: () => {},
	});

	const togglePostToCollection = useMutation({
		mutationKey: ['accountCollection', 'add'],
		mutationFn: async ({
			collection,
			post,
		}: {
			post: AppPostObject;
			collection: AccountCollection;
		}) => {
			const savedPost = AccountSavedPostService.upsert(db, acct, post);
			AccountCollectionService.toggleLink(db, collection, savedPost);
		},
		onSuccess: (data: any) => {
			void queryClient.invalidateQueries({
				queryKey: ['db', 'accountCollection', acct?.id],
			});
		},
	});

	return { rename, add, togglePostToCollection };
}
