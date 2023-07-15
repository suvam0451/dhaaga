import { Select } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { getThreadsRecommendations } from "../../lib/redux/slices/workerSlice";
import { SelectItem_ThreadsDesktop } from "../variants/search-recommendations/threadsDesktop";
import { RecommendationsState } from "../../lib/redux/slices/recommendationsSlice";

type SearchTermValidity = {
	valid: boolean;
	tooltip?: string;
};

type SearchBoxProps = {
	validator: (searchTerm: string) => SearchTermValidity;
	isLoadingOverride?: boolean;
	onClickCallback: (searchTerm: string) => void;
	placeholder?: string;
};

/**
 * Search box for the "Search" page
 * @param param0
 * @returns
 */
function SearchLocalDatabase({ placeholder, onClickCallback }: SearchBoxProps) {
	const dispatch = useDispatch<AppDispatch>();
	const recommendations = useSelector<RootState, RecommendationsState>(
		(o) => o.recommendations
	);

	const [SearchTerm, setSearchTerm] = useState<string | null>(null);
	const [debounced] = useDebouncedValue(SearchTerm || "", 200);

	useEffect(() => {
		if (debounced.length < 3) return;
		dispatch(getThreadsRecommendations(debounced));
	}, [debounced]);

	const items =
		recommendations?.searchRecommendations?.map((o) => ({
			username: o.username,
			pk: o.pk,
			profile_pic_url: o.profile_pic_url,
			value: o.username,
			label: o.username,
		})) || [];

	useEffect(() => {
		const match = items.find((o) => o.username === SearchTerm);
		if (match) {
			dispatch({
				type: "setSearchTerm",
				payload: "https://www.threads.net/@" + SearchTerm,
			});
			onClickCallback("https://www.threads.net/@" + SearchTerm);
		}
	}, [SearchTerm]);

	return (
		<Select
			clearable
			searchable
			icon={<IconDatabase />}
			placeholder={placeholder || "Search for anything..."}
			itemComponent={(e) => (
				<SelectItem_ThreadsDesktop searchTerm={debounced} {...e} />
			)}
			nothingFound="No results found..."
			data={items}
			filter={(value, item) =>
				item.username.toLowerCase().includes(value.toLowerCase().trim())
			}
			onSearchChange={setSearchTerm}
			styles={(theme) => ({
				item: {
					// applies styles to selected item
					"&[data-selected]": {
						"&, &:hover": {
							backgroundColor:
								theme.colorScheme === "dark"
									? theme.colors.gray[9]
									: theme.colors.blue[1],
							color:
								theme.colorScheme === "dark"
									? theme.white
									: theme.colors.gray[9],
						},
					},

					// applies styles to hovered item (with mouse or keyboard)
					"&[data-hovered]": {},
				},
			})}
		/>
	);
}

export default SearchLocalDatabase;
