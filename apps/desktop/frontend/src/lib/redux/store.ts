import { configureStore } from "@reduxjs/toolkit";
import { gallerySlice } from "./slices/gallerySlice";
import { recommendationsSlice } from "./slices/recommendationsSlice";
import { searchSlice } from "./slices/searchSlice";
import { threadsDiscoverReducer } from "./slices/discoverSearchSlice";
import { providerAuthSlice } from "./slices/authSlice";
import { taskSlice } from "./slices/tasksSlice";
import { mastodonAccountSlice } from "./slices/mastodonAccountSlice";
import { latestTabRendererSlice } from "./slices/latestTabRenderer";

const store = configureStore({
	reducer: {
		gallery: gallerySlice,
		recommendations: recommendationsSlice,
		search: searchSlice,
		threadsDiscover: threadsDiscoverReducer,
		providerAuth: providerAuthSlice.reducer,
		tasks: taskSlice.reducer,
		mastodonAccount: mastodonAccountSlice.reducer,
		latestTabPushHistory: latestTabRendererSlice.reducer,
	},
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
