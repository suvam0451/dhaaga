/**
 * Post Like Status
 */
export type DriverPostLikeState = {
	state: boolean;
	counter?: number;
	uri?: string;
};
export type DriverLikeStateResult = Promise<DriverPostLikeState>;

/**
 * Post Bookmark Status
 */
export type DriverBookmarkLikeState = {
	state: boolean;
	counter?: number;
};
export type DriverBookmarkStateResult = Promise<DriverPostLikeState>;
