import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: { main: "#2E73C5", dark: "#022D6D", light: "#C8EAFD" },
    secondary: { main: "#2EB3C5" },
    success: { main: "#73B79E" },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});
