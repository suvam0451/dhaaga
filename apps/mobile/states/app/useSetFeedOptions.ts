import { useEffect, useState } from 'react';
import { useAppBottomSheet } from '#/states/global/hooks';

/**
 * Helps perform updates on a timeline
 * opts/query inputs
 */
function useSetFeedOptions() {
	const { ctx, stateId, hide, setCtx } = useAppBottomSheet();
	const [HideReplies, setHideReplies] = useState(false);
	const [HideReposts, setHideReposts] = useState(false);

	/**
	 * States
	 */

	const [FeedSource, setFeedSource] = useState<'all' | 'local' | 'remote'>(
		'all',
	);
	const [MediaOnlyOptions, setMediaOnlyOptions] = useState<
		'all' | 'media-only'
	>('all');

	/**
	 * Initialize the timeline options
	 */
	useEffect(() => {
		if (ctx.$type !== 'set-feed-options') return;

		const opts = ctx.opts;
		setMediaOnlyOptions(opts?.onlyMedia ? 'media-only' : 'all');

		const currentSources = [];

		if (opts?.local) currentSources.push('local');
		if (opts?.remote) currentSources.push('remote');
		if (currentSources.length !== 1) {
			setFeedSource('all');
		} else {
			setFeedSource(currentSources[0]);
		}

		setHideReplies(!!opts?.excludeReplies);
		setHideReposts(!!opts?.excludeReblogs);
	}, [stateId]);

	/**
	 * Publishes the changes to the timeline
	 */
	function submit() {
		if (ctx.$type !== 'set-feed-options') return;
		setCtx({
			...ctx,
			opts: {
				onlyMedia: MediaOnlyOptions === 'media-only',
				local: FeedSource === 'local',
				remote: FeedSource === 'remote',
				excludeReplies: HideReplies,
				excludeReblogs: HideReposts,
			},
		});
		hide();
	}

	return {
		FeedSource,
		MediaOnlyOptions,
		HideReplies,
		HideReposts,

		/**
		 * update actions
		 */

		setFeedSource: setFeedSource,
		setMediaOnlyOptions,
		setHideReplies,
		setHideReposts,

		/**
		 * Form actions
		 */

		submit,
	};
}

export default useSetFeedOptions;
