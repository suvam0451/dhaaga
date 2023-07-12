import { Box, Button, Flex, Loader, Text, TextInput } from "@mantine/core";
import { IconCheck, IconSearch, IconSlash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { SearchState } from "../../stores/searchSlice";

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
 * Generic text input box for the "Search" page
 *
 * The validity of the user's input will
 * be checked, and a callback will be
 * invoked on user request.
 * @param validator This function verifies if the URL is valid for chosen platform
 * @returns
 */
function SearchBox({
	validator,
	isLoadingOverride,
	onClickCallback,
	placeholder,
}: SearchBoxProps) {
	const dispatch = useDispatch<AppDispatch>();
	const search = useSelector<RootState, SearchState>(
		(o) => o.search)
	const searchboxRef = useRef<HTMLInputElement>(null);

	const [SearchTermValid, setSearchTermValid] = useState<SearchTermValidity>({
		valid: false,
		tooltip: undefined,
	});

	useEffect(() => {
		setSearchTermValid(validator(search.searchTerm));
	}, [search.searchTerm]);

	function onClickCallbackHandler() {
		return onClickCallback(search.searchTerm);
	}

	return (
		<Box>
			<Flex>
				<TextInput
					ref={searchboxRef}
					icon={
						SearchTermValid.valid ? <IconCheck color="green" /> : <IconSearch />
					}
					value={search.searchTerm || ""}
					onChange={(e) => {
						dispatch({ type: "setSearchTerm", payload: e.currentTarget.value });
					}}
					placeholder={placeholder || "Search for anything..."}
					error={
						search.searchTerm === "" || SearchTermValid.valid === true ? false : true
					}
				/>
				<Button onClick={onClickCallbackHandler} ml={"xs"}>
					{isLoadingOverride ? (
						<Loader color="#fff" size={20} />
					) : (
						<Text>Go</Text>
					)}
				</Button>
			</Flex>
		</Box>
	);
}

export default SearchBox;
