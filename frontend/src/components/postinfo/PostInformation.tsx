import { Box } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../lib/redux/store";
import { GalleryState } from "../../lib/redux/slices/gallerySlice";
import { useEffect } from "react";
import { GetDatabasePostInfo } from "../../../wailsjs/go/main/App";

/**
 * This component shows information about the
 * post corresponding to the image being shown
 * 
 * e.g. - OP info, Repost info
 */
function PostInformation() {
  const dispatch = useDispatch<AppDispatch>();
	const galleryState = useSelector<RootState, GalleryState>((o) => o.gallery);

  useEffect(() => {
    if(galleryState.galleryIndex === -1) return;
    // console.log("detected gallery item change", galleryState.galleryIndex);
    const item = galleryState.imageUrls[galleryState.galleryIndex];
    // console.log(item)

    GetDatabasePostInfo(item.post_id).then((res) => {
      console.log("result post info", res);
    }).catch((e) => {
      console.log("[WARN] Failed to get post info", e)
    })
  }, [galleryState.galleryIndex])
  
  
  return <Box></Box>
}

export default PostInformation;