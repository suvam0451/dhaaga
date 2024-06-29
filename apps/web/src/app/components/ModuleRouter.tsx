import { Box, BoxProps, PolymorphicComponentProps } from '@mantine/core';
import { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';

const ModuleABox = styled(Box)<
	PolymorphicComponentProps<any> & {
		selected: boolean;
	}
>`
	background-color: ${(props) => (props.selected ? '#fadca2' : 'auto')};

	> p {
		color: ${(props) => (props.selected ? 'black' : 'white')};
	}

	&:hover {
		background-color: #fadca2;
		color: black;

		> p {
			color: black;
			transition: color 0.5s ease-out;
		}
	}

	padding: 10px;
	border-radius: 8px;
	transition: all 0.25s ease-out;
`;

const ModuleBBox = styled(Box)`
	&:hover {
		background-color: #c7f8fb;
		color: black;

		> p {
			color: black;
			transition: color 0.5s ease-out;
		}
	}

	padding: 10px;
	border-radius: 8px;
	transition: all 0.25s ease-out;
`;

const ModuleCBox = styled(Box)`
	&:hover {
		background-color: rgb(203, 159, 210);
		color: black;

		> p {
			color: black;
			transition: color 0.5s ease-out;
		}
	}

	padding: 10px;
	border-radius: 8px;
	transition: all 0.25s ease-out;
`;

function ModuleRouter() {
	const [ModuleSelectionIndex, setModuleSelectionIndex] = useState(0);
	return (
		<Box>
			<Box
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
				}}
			>
				<Box></Box>
				<ModuleABox selected={ModuleSelectionIndex === 0}>
					<p style={{ textAlign: 'center', fontSize: 20 }}>Downloads</p>
				</ModuleABox>
				<ModuleBBox>
					<p style={{ textAlign: 'center', fontSize: 20 }}>Services</p>
				</ModuleBBox>
				<ModuleCBox>
					<p style={{ textAlign: 'center', fontSize: 20 }}>Request Features</p>
				</ModuleCBox>
			</Box>
		</Box>
	);
}

export default ModuleRouter;
