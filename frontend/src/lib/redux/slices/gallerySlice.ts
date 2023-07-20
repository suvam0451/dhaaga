import { createAction, createReducer } from "@reduxjs/toolkit";
import { getImageBase64 } from "./workerSlice";
import { utils } from "../../../../wailsjs/go/models";

export interface GalleryState {
	imageUrls: utils.PostImageDTO[];
	galleryIndex: number;
	currentItem?: utils.PostImageDTO;
	currentImage?: string;
	currentImageLoading: boolean;

	// video controllers
	HasVideo: boolean;
	VideoLoading: boolean;
	VideoLoaded: boolean;
}

const clearGallery = createAction("clearGallery");
const setGallery = createAction<utils.PostImageDTO[], "setGallery">(
	"setGallery"
);
const setPrimaryDisplayItem = createAction<string, "setPrimaryDisplayItem">(
	"setPrimaryDisplayItem"
);
const galleryNext = createAction("galleryNext");
const galleryPrev = createAction("galleryPrev");

const setGalleryVideoContent = createAction<any, "setGalleryVideoContent">(
	"setGalleryVideoContent"
);
const resetVideoLoadStatus = createAction<"resetVideoLoadStatus">(
	"resetVideoLoadStatus"
);

const setGalleryVideoLoading = createAction<boolean, "setGalleryVideoLoading">(
	"setGalleryVideoLoading"
);

export const gallerySlice = createReducer<GalleryState>(
	{
		imageUrls: [],
		galleryIndex: -1,
		currentImageLoading: false,
		HasVideo: false,
		VideoLoading: false,
		VideoLoaded: false,
	},
	(builder) =>
		builder
			.addCase(setGalleryVideoLoading, (state, action) => {
				return {
					...state,
					VideoLoading: action.payload,
				};
			})
			.addCase(resetVideoLoadStatus, (state, action) => {
				return {
					...state,
					VideoLoading: false,
					VideoLoaded: false,
				};
			})
			.addCase(setGalleryVideoContent, (state, action) => {
				return {
					...state,
					currentImage: action.payload,
					VideoLoading: false,
					VideoLoaded: true,
				};
			})
			.addCase(clearGallery, (state, action) => {
				return {
					...state,
					imageUrls: [],
					galleryIndex: -1,
					HasVideo: false,
					VideoLoaded: false,
					VideoLoading: false,
				};
			})
			.addCase(setGallery, (state, action) => {
				return {
					...state,
					imageUrls: action.payload,
					galleryIndex: action.payload.length > 0 ? 0 : -1,
					currentItem:
						action.payload.length > 0 ? action.payload[0] : undefined,
					HasVideo:
						action.payload.length > 0
							? action.payload[0].asset_type === "video"
							: false,
				};
			})
			.addCase(galleryNext, (state, _) => {
				if (state.galleryIndex === -1) {
					return {
						...state,
						VideoLoaded: false,
						VideoLoading: false,
					};
				}
				let setval = state.galleryIndex + 1;
				if (setval >= state.imageUrls.length)
					setval = state.imageUrls.length > 0 ? 0 : -1;

				return {
					...state,
					galleryIndex: setval,
					currentItem: state.imageUrls[setval],
					HasVideo: state.imageUrls[setval].asset_type === "video",
					VideoLoaded: false,
					VideoLoading: false,
				};
			})
			.addCase(galleryPrev, (state, _) => {
				if (state.galleryIndex === -1) {
					return {
						...state,
						VideoLoaded: false,
						VideoLoading: false,
					};
				}
				let setval = state.galleryIndex - 1;
				if (setval <= 0) setval = state.imageUrls.length - 1;

				return {
					...state,
					galleryIndex: setval,
					currentItem: state.imageUrls[setval],
					HasVideo: state.imageUrls[setval].asset_type === "video",
					VideoLoaded: false,
					VideoLoading: false,
				};
			})
			.addCase(setPrimaryDisplayItem, (state, action) => {
				return {
					...state,
					currentImage: action.payload,
				};
			})
			.addCase(getImageBase64.pending, (state, action) => {
				return {
					...state,
					currentImage: undefined,
					currentImageLoading: true,
				};
			})
			.addCase(getImageBase64.fulfilled, (state, action) => {
				return {
					...state,
					currentImage: action.payload as any,
					currentImageLoading: false,
				};
			})
			.addCase(getImageBase64.rejected, (state, action) => {
				return {
					...state,
					currentImage: undefined,
					currentImageLoading: false,
				};
			})
);

export default gallerySlice;
