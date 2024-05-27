import React from "react";
import WithOpenGraph from "./WithOpenGraph";
import ExternalLinkDisplayName from "../../utils/ExternalLinkDisplayName";

type LinkProcessorProps = {
  url: string,
  displayName: string
}


function LinkProcessor({url, displayName}: LinkProcessorProps) {
  return <WithOpenGraph url={url}>
    <ExternalLinkDisplayName displayName={displayName || url}/>
  </WithOpenGraph>
}

export default LinkProcessor