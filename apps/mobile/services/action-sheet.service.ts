import {
  ActionSheetOptions
} from "@expo/react-native-action-sheet/lib/typescript/types";


const POST_TRANSLATION_OPTIONS = ["Translate (DeepL)", "Explain (OpenAI)", "Cancel"]
export const POST_TRANSLATION_ACTION_SHEET_OPTIONS: ActionSheetOptions = {
  options: POST_TRANSLATION_OPTIONS,
  message: "You do not follow this person",
  cancelButtonIndex: POST_TRANSLATION_OPTIONS.length - 1,
  destructiveButtonIndex: POST_TRANSLATION_OPTIONS.length - 1,
  title: "Translation Options",
  userInterfaceStyle: "dark",
}

const STATUS_USER_PROFILE_CLICK_OPTIONS = ["Browse", "Follow", "Cancel"];
export const STATUS_USER_PROFILE_CLICK_ACTION_SHEET_OPTIONS: ActionSheetOptions = {
  options: STATUS_USER_PROFILE_CLICK_OPTIONS,
  message: "Whose profile do you want to view",
  cancelButtonIndex: STATUS_USER_PROFILE_CLICK_OPTIONS.length - 1,
  destructiveButtonIndex: STATUS_USER_PROFILE_CLICK_OPTIONS.length - 1,
  title: "Profile",
  userInterfaceStyle: "dark",
}

//
// (selectedIndex: number) => {
//   switch (selectedIndex) {
//     case 0: {
//
//       break;
//     }
//     case 1: {
//       OpenAiService.explain(openAiContext.join(",")).then((res) => {
//         setExplanationObject(res)
//       })
//       break
//     }
//     default: {
//       break;
//     }
//   }
// }
// }