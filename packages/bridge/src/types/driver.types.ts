import { ApiAsyncResult } from '../utils/api-result.js';

/**
 * Post Like Status
 */
export type DriverPostLikeState = {
	state: boolean;
	counter?: number;
	uri?: string;
};
export type DriverLikeStateResult = ApiAsyncResult<DriverPostLikeState>;

/**
 * Post Bookmark Status
 */
export type DriverBookmarkLikeState = {
	state: boolean;
	counter?: number;
};
export type DriverBookmarkStateResult = ApiAsyncResult<DriverPostLikeState>;
