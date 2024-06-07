import styled from "styled-components/native";
import {Image} from "expo-image";
import {Text, TextProps} from "@rneui/themed"
import Ionicons from "@expo/vector-icons/Ionicons";
import {IconProps} from "@expo/vector-icons/build/createIconSet";

export const StandardView = styled.View`
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
`

export const ParsedDescriptionContainerForChatroomPreview = styled.Text`
    margin-top: 4px;
    //display: inline-flex;
    //line-clamp: max(1);
    //font-size: 12px;
    align-items: center;
    flex-direction: row;
    max-width: 100%;
`

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
`

type ButtonGroupContainerType = {
  first?: boolean,
  last?: boolean
}

export const ButtonGroupContainer =
    styled.View<ButtonGroupContainerType>`
        background-color: #232323;
        //opacity: 0.3;
        padding: 6px 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        border-color: #ffffff30;
        
        border-top-width: ${props => props.first ? 0 : "0.5px"};
        border-top-left-radius: ${props => props.first ? "8px" : 0};
        border-top-right-radius: ${props => props.first ? "8px" : 0};

        border-bottom-width: ${props => props.last ? 0 : "0.5px"};
        border-bottom-left-radius: ${props => props.last ? "8px" : 0};
        border-bottom-right-radius: ${props => props.last ? "8px" : 0};
    `



type StyledTextProps = {
  primary?: boolean
  secondary?: boolean
  background?: boolean
  disabled?: boolean
}

function handleTextEmphasis(props: StyledTextProps): number {
  if (props.primary) return 0.87
  if (props.secondary) return 0.6
  if (props.background) return 0.3
  if (props.disabled) return 0.1
  return 1
}

export const DhaagaText = styled(Text)<TextProps & StyledTextProps>`
    opacity: ${props => handleTextEmphasis(props)};
`

export const AppIonicon = styled(Ionicons)<IconProps<string> & StyledTextProps>`
    opacity: ${props => handleTextEmphasis(props)};
`

export const DialogButtonGroupItem = styled.View`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
`