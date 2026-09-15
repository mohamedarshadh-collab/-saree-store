import { createTheme } from "@mui/material/styles";

const rose = "#ff3f6c";
const roseDark = "#e62b5d";
const blush = "#fff1f5";
const bg = "#f5f5f6";
const card = "#ffffff";
const ink = "#282c3f";
const inkSoft = "#7e818d";
const stroke = "#e9e9eb";
const success = "#03a685";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: rose,
      dark: roseDark,
      contrastText: "#fff",
    },
    secondary: {
      main: ink,
      dark: "#1d2333",
      contrastText: "#fff",
    },
    background: {
      default: bg,
      paper: card,
    },
    text: {
      primary: ink,
      secondary: inkSoft,
    },
    divider: stroke,
  },
  typography: {
    fontFamily: "Inter, 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "Inter, 'Segoe UI', sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontFamily: "Inter, 'Segoe UI', sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },
    h3: {
      fontFamily: "Inter, 'Segoe UI', sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    button: {
      fontFamily: "Inter, 'Segoe UI', sans-serif",
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: 0.2,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: bg,
          color: ink,
        },
        "::selection": {
          backgroundColor: "#ffd9e3",
          color: roseDark,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "11px 22px",
          transition: "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
          fontWeight: 700,
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 10px 18px rgba(255, 63, 108, 0.15)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${rose} 0%, ${roseDark} 100%)`,
          color: "#fff",
          "&:hover": {
            background: `linear-gradient(135deg, ${roseDark} 0%, ${roseDark} 100%)`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 18,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: rose,
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export default theme;
