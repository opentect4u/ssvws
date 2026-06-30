import { Dimensions } from "react-native";
import { fp } from "../utils/responsive";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    primary: "#1a73e8", // Professional Blue
    secondary: "#ff6f00", // Accent Orange
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
    white: "#ffffff",
    black: "#000000",
    gray: "#9e9e9e",
    lightGray: "#f5f5f5",
    darkGray: "#424242",
    background: "#e6eefdff",
    text: "#333333",
    border: "#e2e2e2ff",
    transparent: "transparent",
    overlay: "rgba(0,0,0,0.5)",
    primaryDark: '#1D4ED8',
};

export const SIZES = {
    // Global sizes
    base: 8,
    font: 12,
    radius: 12,
    padding: 24,

    // Font sizes (Reduced by 2)
    h1: 28,
    h2: 20,
    h3: 14,
    h4: 12,

    body1: 28,
    body2: 20,
    body3: 14,
    body4: 12,
    body5: 10,
    body6: 8,

    // App dimensions
    width,
    height,
};

export const FONTS = {
    h1: { fontSize: fp(28), fontWeight: "bold" },
    h2: { fontSize: fp(20), fontWeight: "bold" },
    h3: { fontSize: fp(14), fontWeight: "bold" },
    h4: { fontSize: fp(12), fontWeight: "bold" },

    body1: { fontSize: fp(28), lineHeight: fp(34) },
    body2: { fontSize: fp(20), lineHeight: fp(28) },
    body3: { fontSize: fp(14), lineHeight: fp(20) },
    body4: { fontSize: fp(12), lineHeight: fp(18) },
    body5: { fontSize: fp(10), lineHeight: fp(16) },
    body6: { fontSize: fp(8), lineHeight: fp(14) },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
