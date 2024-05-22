import { ActivityPubStatuses } from "@dhaaga/shared-abstraction-activitypub/src";
import { createContext, useContext, useState } from "react";

type StoreType = {
	posts: ActivityPubStatuses;
};

type DispatchType = {
	setPosts: (posts: ActivityPubStatuses) => void;
};

const storeDefault: StoreType = {
	users: [],
};

const dispatchDefault: DispatchType = {
	setPosts: () => {},
};

const StoreContext = createContext<StoreType>(storeDefault);
const DispatchContext = createContext<DispatchType>(dispatchDefault);

function UserPostsProvider({ children }: { children: React.ReactNode }) {
	const [posts, setPosts] = useState<ActivityPubStatuses>([]);

	function setPostsFn(posts: ActivityPubStatuses) {
		setPosts(posts);
	}

	return (
		<StoreContext.Provider value={{ posts: users }}>
			<DispatchContext.Provider value={{ setPosts: setPostsFn }}>
				{children}
			</DispatchContext.Provider>
		</StoreContext.Provider>
	);
}
export function UserPostsHook() {
	return {
		store: useContext(StoreContext),
		dispatch: useContext(DispatchContext),
	};
}

export default UserPostsProvider;
