import { Button } from "@mantine/core";

type LoadingStatusIndicatorProps = {
	onClick: () => void;
	loading: boolean;
	allowClicks: boolean;
};

function LoadingStatusIndicator({
	onClick,
	loading,
	allowClicks,
}: LoadingStatusIndicatorProps) {
	return (
		<Button onClick={onClick} mt={"md"} loading={loading}>
			{allowClicks ? "Load Next Page" : "Loading More..."}
		</Button>
	);
}

export default LoadingStatusIndicator;
