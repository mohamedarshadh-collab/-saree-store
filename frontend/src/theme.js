import { createTheme } from "@mui/material/styles";

const wine = "#6e1423";
const wineDark = "#4a0d18";
const gold = "#b8873b";
const ivory = "#fdf9f3";
const ink = "#2a1c1c";
const inkSoft = "#6b5a54";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: wine,
      dark: wineDark,
      contrastText: ivory,
    },
    secondary: {
      main: gold,
      dark: "#9c6f2c",
      contrastText: "#fff",
    },
    background: {
      default: ivory,
      paper: "#fffdf9",
    },
    text: {
      primary: ink,
      secondary: inkSoft,
    },
    divider: "#e6d9c7",
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
      letterSpacing: 0,
    },
    button: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: 0.2,
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: ivory,
          color: ink,
        },
        "::selection": {
          backgroundColor: "#e4c48b",
          color: wineDark,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: "11px 24px",
          transition: "transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 20px rgba(74, 13, 24, 0.14)",
          },
        },
        containedSecondary: {
          color: "#fff",
          "&:hover": {
            backgroundColor: "#9c6f2c",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
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
          borderRadius: 2,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: gold,
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export default theme;
