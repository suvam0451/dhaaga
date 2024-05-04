import { IconCheck } from "@tabler/icons-react";
import { mastodon } from "masto";
import {
	DangerouslySetHTML,
	MastodonProfileLinkArray,
	MastodonProfileLinkArrayItem,
	TextTitle,
} from "../../../styles/Mastodon";
import React from "react";

/**
 * Renders the external links for a mastodon profile
 * @param param0
 * @returns
 */
function ExternalLinks({
	fields,
}: {
	fields: mastodon.v1.AccountField[] | null | undefined;
}) {
	return (
		fields &&
		fields?.length > 0 && (
			<MastodonProfileLinkArray>
				{fields?.map((x, i) => (
					<React.Fragment key={i}>
						<TextTitle $smaller>{x.name}</TextTitle>
						<MastodonProfileLinkArrayItem>
							{x.verifiedAt && (
								<IconCheck
									style={{
										color: "green",
									}}
								/>
							)}
							<DangerouslySetHTML
								style={{
									color: "#888",
									fontSize: 14,
									lineHeight: 1.2,
									textDecoration: "none",
								}}
								dangerouslySetInnerHTML={{ __html: x.value }}
							/>
						</MastodonProfileLinkArrayItem>
					</React.Fragment>
				))}
			</MastodonProfileLinkArray>
		)
	);
}

export default ExternalLinks;
