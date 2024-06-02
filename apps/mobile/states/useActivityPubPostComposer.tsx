import {createContext, useContext, useState} from "react";
import {useActivityPubRestClientContext} from "./useActivityPubRestClient";

type PostComposer_MediaAttachment = {
  order: number,
  uri: string,
  status: "IDLE" | "PENDING" | "READY",
  remoteUrl: string | null
}

type Type = {
  mediaAttachments: PostComposer_MediaAttachment[],
  addMediaAttachment: (uri: string) => void
  removeMediaAttachment: (index: number) => void
}


const defaultValue: Type = {
  mediaAttachments: [],
  addMediaAttachment: function (uri: string): void {
    throw new Error("Function not implemented.");
  },
  removeMediaAttachment: function (index: number): void {
    throw new Error("Function not implemented.");
  }
}

const ActivityPubPostComposerContext =
    createContext<Type>(defaultValue);


export function useActivityPubPostComposerContext() {
  return useContext(ActivityPubPostComposerContext);
}

type Props = {
  children: any
}

function WithActivityPubPostComposerContext({
  children
}: Props) {
  const {client} = useActivityPubRestClientContext()
  const [MediaAttachments, setMediaAttachments] = useState<PostComposer_MediaAttachment[]>([])

  async function addMediaAttachment(uri: string) {
    const currentLength = MediaAttachments.length
    setMediaAttachments(MediaAttachments.concat({
      order: currentLength + 1,
      uri,
      remoteUrl: null,
      status: "PENDING"
    }))

    const response = await fetch(uri);
    const blob = await response.blob();
    console.log(blob)

    // client.uploadMedia()
  }

  function processImage() {

  }

  function removeMediaAttachment(index: number): void {
    setMediaAttachments(MediaAttachments.splice(index, 1))
  }

  return <ActivityPubPostComposerContext.Provider value={{
    mediaAttachments: MediaAttachments,
    addMediaAttachment,
    removeMediaAttachment
  }}>
    {children}
  </ActivityPubPostComposerContext.Provider>
}

export default WithActivityPubPostComposerContext