import useTopbarSmoothTranslate from "../../states/useTopbarSmoothTranslate";
import {ScrollView} from "react-native";
import WithAutoHideTopNavBar from "./WithAutoHideTopNavBar";

type Props = {
  title: string
  children: any
}

function SimpleTutorialContainer({title, children}: Props) {
  const {translateY} = useTopbarSmoothTranslate({
    onScrollJsFn: () => {
    },
    totalHeight: 50,
    hiddenHeight: 50
  })

  return <WithAutoHideTopNavBar
      title={title}
      translateY={translateY}>
    <ScrollView contentContainerStyle={{marginTop: 54}}>
      {children}
    </ScrollView></WithAutoHideTopNavBar>
}

export default SimpleTutorialContainer;