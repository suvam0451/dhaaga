import { Box } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useState } from "react";
import { SetUserFavourite, UnsetUserFavourite } from "../../../../wailsjs/go/main/App";

type UserFavouriteControllerProps = {
	pk: string;
	favourited: boolean;
};

function UserFavouriteController({
	pk,
	favourited,
}: UserFavouriteControllerProps) {
	const [Favourited, setFavourited] = useState(favourited);

	function onClick() {
		if (Favourited) {
			UnsetUserFavourite(pk).then(() => {
        setFavourited(false); // unfavourite

      })
			// unfavourite
		} else {
			SetUserFavourite(pk).then(() => {
        setFavourited(true); // favourite
      })
			// favourite
		}
	}
	return (
		<Box onClick={onClick}>
			{Favourited ? <IconHeart color="red" /> : <IconHeart color="#888" />}
		</Box>
	);
}

export default UserFavouriteController;
