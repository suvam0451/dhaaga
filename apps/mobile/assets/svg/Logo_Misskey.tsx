import * as React from "react"
import Svg, { Defs, Circle, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: style */
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <Defs></Defs>
    <Circle cx={39.393} cy={14.766} r={4.106} className="a" />
    <Path
      d="M4.5 15.294a4.635 4.635 0 0 1 4.635-4.634c2.56 0 3.226 1.272 4.002 2.249l9.092 11.677M32.808 32.706a4.635 4.635 0 1 1-9.269 0"
      className="a"
    />
    <Path d="M4.5 32.706V15.293" className="b" />
    <Path
      d="m14.991 29.726-1.222-1.573v4.553a4.635 4.635 0 0 1-9.269 0M23.54 32.706v-4.553l-1.222 1.572M8.238 21.036l5.532 7.117M23.54 28.153l5.605-7.224"
      className="a"
    />
    <Path d="M14.991 29.726s3.38 4.834 7.326 0" className="b" />
    <Path
      d="M8.27 21.068c-1.548-1.93-3.46-.734-3.76 1.078M22.23 24.586c1.445 1.67 3.292 1.15 4.379-.383M29.144 20.928a2.046 2.046 0 0 1 3.653.33"
      className="c"
    />
    <Path
      d="M16.517 17.221c1.427 1.893 2.848 1.93 4.35.059l3.544-4.584c.688-.812 1.203-2.036 3.763-2.036a4.635 4.635 0 0 1 4.635 4.634v17.413"
      className="c"
    />
    <Path
      d="M39.392 20.646a4.106 4.106 0 0 0-4.106 4.106v8.483a4.107 4.107 0 0 0 8.214 0v-8.483a4.107 4.107 0 0 0-4.108-4.106Z"
      className="b"
    />
  </Svg>
)
export default SvgComponent
