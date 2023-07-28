import { Box, Button, Flex, Loader } from "@mantine/core";
import { TextTitle } from "../../../styles/Mastodon";
import { useOnboardingProviderHook } from "../../../contexts/OnboardingContext";

type LoadingStepTemplateProps = {
	hidden: boolean;
	label: string;
	buttonDisabled?: boolean;
	onClick: () => void;
	children: any;
};

/**
 * Utility component to runder a step of the 
 * onboarding process
 * @param param0 
 * @returns 
 */
function LoadingStepTemplate({
	hidden,
	label,
	buttonDisabled,
	onClick,
	children,
}: LoadingStepTemplateProps) {
  const { store, dispatch } = useOnboardingProviderHook();

  
	return (
		!hidden && (
			<Box my={"md"}>
				<TextTitle mb={"sm"}>{label}</TextTitle>
				<Flex align={"center"} w={"100%"}>
					{children}
					<Button style={{flexShrink: 1}} disabled={buttonDisabled || store.loading} onClick={onClick}>
						{store.loading ? <Loader color="#fff" size={20} /> : "Next"}
					</Button>
				</Flex>
			</Box>
		)
	);
}

export default LoadingStepTemplate;
