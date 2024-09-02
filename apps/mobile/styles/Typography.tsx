import styled from 'styled-components/native';
import { APP_FONTS } from './AppFonts';

export const MainText = styled.Text`
	color: rgba(255, 255, 255, 0.87);
	font-size: 20px;
	font-family: ${APP_FONTS.MONTSERRAT_800_EXTRABOLD};
`;

export const PrimaryText = styled.Text`
	color: rgba(255, 255, 255, 0.6);
	font-family: Inter-Bold;
`;

export const SecondaryText = styled.Text`
	color: #888;
	font-size: 12px;
	font-weight: 500;
`;
