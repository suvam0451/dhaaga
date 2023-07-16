import { forwardRef, useEffect, useState } from "react";
import { threadsapi } from "../../../../wailsjs/go/models";
import { Avatar, Box, Group, Text } from "@mantine/core";
import { GetAsset } from "../../../../wailsjs/go/main/App";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
	pk: string;
	username: string;

	profile_pic_url: string;
}

function AvatarBase64Loader({ url, alt }: { url: string; alt?: string }) {
	const [ImageSrcBase64, setImageSrcBase64] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		GetAsset(url).then((res) => {
			if (res) {
				setImageSrcBase64(res);
			}
		});
	}, [url]);

	return <Avatar src={ImageSrcBase64 as any} alt="pfp" />;
}

function HighlightedPartialMatch({
	text,
	searchTerm,
}: {
	text: string;
	searchTerm: string;
}) {
	const ex = new RegExp(searchTerm);
	const matchIndex = ex.exec(text);
	if (matchIndex) {
		const A = text.slice(0, matchIndex.index);
		const B = searchTerm;
		const C = text.slice(matchIndex.index + searchTerm.length);
		return (
			<Box>
				<Text span size={"sm"}>
					{A}
				</Text>
				<Text span size="sm" fw={"bold"}>
					{B}
				</Text>
				<Text span size={"sm"}>
					{C}
				</Text>
			</Box>
		);
	} else {
		return (
			<Text size="sm" fw={"bold"}>
				{text}
			</Text>
		);
	}
}

export type SelectItemType_ThreadsDesktop =
	Partial<threadsapi.ThreadsApi_User> & { value: string };

/**
 * How should a single item in the select look like
 *
 * https://mantine.dev/core/select/#custom-item-component
 */
export const SelectItem_ThreadsDesktop = forwardRef<
	HTMLDivElement,
	ItemProps & { searchTerm: string }
>(
	(
		{
			pk,
			username,
			profile_pic_url,
			searchTerm,
			...others
		}: ItemProps & { searchTerm: string },
		ref
	) => (
		<div ref={ref} {...others}>
			<Group noWrap>
				<AvatarBase64Loader url={profile_pic_url} />
				<div>
					<HighlightedPartialMatch text={username} searchTerm={searchTerm} />
					<Text size="xs" opacity={0.65}>
						{pk}
					</Text>
				</div>
			</Group>
		</div>
	)
);
