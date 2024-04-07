import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "18px",
        xl: "20px",
        xxl: "24px",
        xxxl: "32px",
      },
      colors: {
        grey: "#F4F4F4",
        light_grey: "#C1C1C1",
        grey2: "#ACACAC",
        btn_bg: "#000",
        text_color: "#fff",
      },
    },
  },
  plugins: [],
} satisfies Config;
