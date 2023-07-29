import {
	Box,
	Text,
	Image,
	TextProps,
	ImageProps,
	BoxProps,
} from "@mantine/core";
import styled from "styled-components";

export const ProfilePicSearchResult = styled(Box)`
	height: 48px;
	width: 48px;
`;

export const PostOwnerImage = styled(Image)<ImageProps>`
	max-width: 48px;
	object-fit: cover;
`;

export const PostBoosterImage = styled(Image)<ImageProps>`
	max-width: 20px;
	margin-left: 4px;
	display: "span";
	object-fit: cover;
	border-radius: 2rem;
`;

export const ProfileOwnerImage = styled(Image)<ImageProps>`
	max-width: 64px;
	height: 64px;
	margin-bottom: -32px;
	border-color: red;
	border: 2px solid #888;
	border-radius: 0.25rem;
	transform: translate(0, -32px);
`;

export const StatReportMaintext = styled(Text)`
	font-weight: 700;
	line-height: 1.25;
`;
export const StatReportSubtext = styled(Text)`
	font-size: 12px;
`;

export const StatReportItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	margin-left: 10px;
`;

export const StatReportGrid = styled.div`
	display: flex;
	flex-wrap: nowrap;
`;

export const TextTitle = styled(Text)<TextProps & { $smaller?: boolean }>`
	font-weight: 500;
	font-size: ${(props) => (props.$smaller ? "14px" : "16px")};
`;

export const TextSubtitle = styled(Text)<TextProps>`
	font-weight: 400;
	font-size: 14px;
	color: #888;
`;

export const MastodonProfileLinkArray = styled(Box)<BoxProps>`
	border-radius: 0.5rem;
	padding: 0.625rem;
	background-color: #eee;
	margin-top: 0.625rem;
	margin-bottom: 0.625rem;
`;

export const MastodonProfileLinkArrayItem = styled(Box)<BoxProps>`
	border-bottom: 1px solid #aaa;
	padding-bottom: 0.625rem;
	display: flex;
	align-items: center;
	&:last-child {
		border-bottom: none;
		padding-bottom: 0rem;
	}
`;

export const DangerouslySetHTML = styled.div`
	& > a {
		text-decoration: none !important;

		&:hover {
			background-color: #ccc;
			border-radius: 0.1rem;
		}
	}
`;

// prettier-ignore
export const PostInteractionElement = styled(Box)<BoxProps & { active?: boolean; activebg?: string }>`
	display: flex;
  color: ${(props) => props.active ? props.activebg : "#777" };
	&:hover {
		color: ${(props) => props.active ? "#777" : props.activebg };
	}
	& > svg {
		color: inherit;
	}

  & > div {
    margin-left: 0.25rem;
    color: inherit;
  }
`;

export const MastadonStatusItem = styled(Box)<
	BoxProps & { reblogged?: boolean }
>`
	padding: ${(props) =>
		props.reblogged === true ? "2px 4px 16px 4px" : "16px 4px 16px 4px"};
	border-radius: 0.25rem;
	margin: 0rem 0rem;
	&:hover {
		transition: 200ms;
		background-color: rgb(244, 244, 244);
	}
	&:focus {
		background-color: #ccc;
	}

	border-bottom: 2px solid #eee;
`;
