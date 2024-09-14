/**
 * This object from profile
 * can be used to estimate user relations
 */
type AtprotoProfileViewerDto = {
	muted?: boolean;
	blockedBy?: boolean;
	/**
	 * at://did:plc:<>/app.bsky.graph.follow/<>
	 *
	 * generally, existence means following
	 * */
	following?: string;
	knownFollowers?: {
		count: number;
		followers: {
			// not used by Dhaaga
			associated: {
				chat: {
					allowIncoming: string;
				};
			};
			did: string;
			handle: string;
			displayName: string;
			labels: any[];
			viewer: {
				blockedBy?: boolean;
				following?: string;
				muted?: boolean;
			};
		};
	};
};
