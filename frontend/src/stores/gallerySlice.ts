import { createAction, createReducer } from "@reduxjs/toolkit";
import { getImageBase64 } from "./workerSlice";

interface GalleryState {
	imageUrls: string[];
	galleryIndex: number;
	currentImage?: string | Uint8Array;
	currentImageLoading: boolean;
}

const clearGallery = createAction("clearGallery");
const setGallery = createAction<string[], "setGallery">("setGallery");
const setPrimaryDisplayItem = createAction<Uint8Array, "setPrimaryDisplayItem">(
	"setPrimaryDisplayItem"
);
const galleryNext = createAction("galleryNext");
const galleryPrev = createAction("galleryPrev");

export const gallerySlice = createReducer<GalleryState>(
	{ imageUrls: [], galleryIndex: -1, currentImageLoading: false },
	(builder) =>
		builder
			.addCase(clearGallery, (state, action) => {
				return {
					...state,
					imageUrls: [],
					galleryIndex: -1,
				};
			})
			.addCase(setGallery, (state, action) => {
				return {
					...state,
					imageUrls: action.payload,
					galleryIndex: action.payload.length > 0 ? 0 : -1,
				};
			})
			.addCase(galleryNext, (state, _) => {
				if (state.galleryIndex === -1) return state;
				let setval = state.galleryIndex + 1;
				if (setval >= state.imageUrls.length)
					setval = state.imageUrls.length > 0 ? 0 : -1;

				return {
					...state,
					galleryIndex: setval,
				};
			})
			.addCase(galleryPrev, (state, _) => {
				if (state.galleryIndex === -1) return state;
				let setval = state.galleryIndex - 1;
				if (setval <= 0) setval = state.imageUrls.length - 1;

				return {
					...state,
					galleryIndex: setval,
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
