import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAsset } from "../../wailsjs/go/main/App";

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
