import {Ionicons} from "@expo/vector-icons";

export function extractInstanceUrl(
    url: string,
    theirUsername: string,
    currentsubdomain: string
) {
  let ourUrl = "";
  let theirUrl = "";
  const ex = /^https?:\/\/(.*?)\/(.*?)/;
  const subdomainExtractUrl = /^https?:\/\/(.*?)\/?/;

  if (ex.test(currentsubdomain)) {
    ourUrl = currentsubdomain.match(subdomainExtractUrl)[1];
  }

  if (ex.test(url)) {
    theirUrl = url.match(ex)[1];
  }

  if (url.includes(currentsubdomain)) return "@" + theirUsername;


  if (ourUrl === theirUrl) {
    return "@" + theirUsername;
  }
  return "@" + theirUsername + "@" + theirUrl;
}

export function visibilityIcon(visibility: string) {
  switch (visibility) {
    case "public":
      return <Ionicons name="earth-outline" size={16} color="#888"/>;
    case "direct":
      return <Ionicons name={"lock-closed-outline"} size={16} color={"#333"}/>
    default:
      return <Ionicons name="earth-outline" size={16} color="#333"/>;
  }
}
