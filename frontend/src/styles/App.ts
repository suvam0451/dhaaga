import { Box, BoxProps } from "@mantine/core";
import styled from "styled-components";

export const AuthProvider_SelectItem = styled.div`
	border-bottom: 2px solid #ddd;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 8px;
	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background-color: #eee;
		transition: 200ms;
	}
`;

export const HighlightOnHover = styled(Box)<BoxProps>`
	padding: 0.5rem 0.5rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	&:hover {
		background-color: #eee;
		transition: 200ms;
	}
`;
