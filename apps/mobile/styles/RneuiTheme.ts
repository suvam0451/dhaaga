import {createTheme} from "@rneui/themed";

const RneuiTheme = createTheme({
  lightColors: {
    primary: "red",
  },
  darkColors: {
    primary: "blue",
  },
  components: {
    Button: {
      raised: true,
    },
    Text: {
      style: {
        color: "#fff",
        opacity: 0.87,
        fontFamily: "Inter-Regular",
      },
    },
    Skeleton: {
      style: {
        backgroundColor: "#fff",
        opacity: 0.3,
      },
      animation: "pulse",
    },
  },
});

export default RneuiTheme