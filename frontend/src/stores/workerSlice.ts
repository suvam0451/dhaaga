import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAsset, SearchUsers } from "../../wailsjs/go/main/App";

/**
 * Use worker to fetch image assets as base64,
 * since browser CORS will disallow loading
 * remote images from a different domain.
 */
export const getImageBase64 = createAsyncThunk(
	`api/getImageBase64`,
	(url: string) => {
		return GetAsset(url).then((o) => o);
	}
);

/**
 * This worker scans the sqlite db
 * to fetch matching usernames, which
 * the user has already browsed
 */
export const getThreadsRecommendations = createAsyncThunk(
	`api/threadsnet/recommendations`,
	(searchTerm: string) => {
		return SearchUsers(searchTerm).then((o) => o);
	}
)