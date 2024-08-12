import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const View = styled.View`
	padding: 10px;
`;

export const AvatarContainerWithInset = styled.View`
	width: 72px;
	height: 72px;
	border-color: gray;
	border-width: 1px;
	border-radius: 4px;
	margin-top: -36px;
	margin-left: 13px;
`;

export const ParsedDescriptionContainer = styled.View`
	margin-top: 12px;
	padding: 8px 8px;
`;

export const ParsedDescriptionContainerForChatroomPreview = styled.Text`
	margin-top: 4px;
`;

export const AvatarContainer = styled.View`
	width: 52px;
	height: 52px;
	border-color: gray;
	border-width: 1px;
	border-radius: 4px;
`;

export const AvatarExpoImage = styled(Image)`
	flex: 1;
	width: 100%;
	background-color: #0553;
	padding: 2px;
`;

export const BottomSheetActionButtonContainer = styled.View`
	border-color: #ffffff30;
	border-width: 1px;
	border-radius: 4px;
	padding: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const DialogButtonGroupItem = styled.View`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8px 0;
`;
