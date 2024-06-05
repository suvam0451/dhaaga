import {styled} from "styled-components";
import Image from 'next/image'

export const RootContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const MainContainer = styled.div`
    max-width: 75em;
    padding: 4rem;
    background-color: #eee;
`;

// prettier-ignore
export const ScrollImageHorizontallyOnHover = styled.img<{
  moveby?: string
}>`
    transform: translateX(0%);
    transition: all 300ms;

    &:hover {
        transform: translateX(${(props) => (props.moveby !== undefined ? props.moveby : "0%")});
    }
`;
