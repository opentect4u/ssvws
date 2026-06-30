import { Platform, useColorScheme } from "react-native"
import { MD3LightTheme, MD3DarkTheme, configureFonts } from "react-native-paper"

export const usePaperColorScheme = () => {
    const colorScheme = useColorScheme()

    const fontConfig = {
        // default: {
        //     fontFamily: "WorkSans-VariableFont_wght"
        // }
    }
    // const fontConfig = {
    //     default: {
    //         fontFamily: "ProductSans-Medium",
    //     },
    //     labelSmall: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 15,
    //     },
    //     labelMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 15,
    //     },
    //     labelLarge: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 15,
    //     },
    //     titleLarge: {
    //         fontFamily: "ProductSans-Bold",
    //         fontSize: 20,
    //     },
    //     bodyMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 17,
    //     },
    //     bodyLarge: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 17,
    //     },
    //     displayMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 40,
    //     },
    //     displaySmall: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 35,
    //     },
    //     headlineMedium: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 20,
    //     },
    //     headlineLarge: {
    //         fontFamily: "ProductSans-Medium",
    //         fontSize: 24,
    //     },
    // }

    return colorScheme === "dark"
        ? {
            ...MD3DarkTheme,
            "colors": {
                ...MD3DarkTheme.colors,
                "primary": "rgb(255, 186, 50)",
                "onPrimary": "rgb(66, 44, 0)",
                "primaryContainer": "rgb(95, 65, 0)",
                "onPrimaryContainer": "rgb(255, 222, 171)",
                "secondary": "rgb(219, 195, 161)",
                "onSecondary": "rgb(60, 46, 22)",
                "secondaryContainer": "rgb(84, 68, 42)",
                "onSecondaryContainer": "rgb(248, 223, 187)",
                "tertiary": "rgb(180, 206, 165)",
                "onTertiary": "rgb(33, 54, 24)",
                "tertiaryContainer": "rgb(55, 77, 45)",
                "onTertiaryContainer": "rgb(208, 234, 191)",
                "error": "rgb(255, 180, 171)",
                "onError": "rgb(105, 0, 5)",
                "errorContainer": "rgb(147, 0, 10)",
                "onErrorContainer": "rgb(255, 180, 171)",
                "background": "rgb(31, 27, 22)",
                "onBackground": "rgb(234, 225, 217)",
                "surface": "rgb(31, 27, 22)",
                "onSurface": "rgb(234, 225, 217)",
                "surfaceVariant": "rgb(78, 69, 57)",
                "onSurfaceVariant": "rgb(210, 197, 180)",
                "outline": "rgb(155, 143, 128)",
                "outlineVariant": "rgb(78, 69, 57)",
                "shadow": "rgb(0, 0, 0)",
                "scrim": "rgb(0, 0, 0)",
                "inverseSurface": "rgb(234, 225, 217)",
                "inverseOnSurface": "rgb(52, 48, 42)",
                "inversePrimary": "rgb(126, 87, 0)",
                "elevation": {
                    "level0": "transparent",
                    "level1": "rgb(42, 35, 23)",
                    "level2": "rgb(49, 40, 24)",
                    "level3": "rgb(56, 45, 25)",
                    "level4": "rgb(58, 46, 25)",
                    "level5": "rgb(62, 49, 26)"
                },
                "surfaceDisabled": "rgba(234, 225, 217, 0.12)",
                "onSurfaceDisabled": "rgba(234, 225, 217, 0.38)",
                "backdrop": "rgba(55, 47, 36, 0.4)",

                "green": "rgb(156, 216, 73)",
                "red": "rgb(216, 83, 73)",
                "onGreen": "rgb(32, 54, 0)",
                "greenContainer": "rgb(49, 79, 0)",
                "onGreenContainer": "rgb(183, 245, 99)"
            },
            fonts: configureFonts({ config: fontConfig }),
        }
        : {
            ...MD3LightTheme,
            "colors": {
                ...MD3LightTheme.colors,
                "primary": "rgb(126, 87, 0)",
                "onPrimary": "rgb(255, 255, 255)",
                "primaryContainer": "rgb(255, 222, 171)",
                "onPrimaryContainer": "rgb(39, 25, 0)",
                "secondary": "rgb(110, 92, 63)",
                "onSecondary": "rgb(255, 255, 255)",
                "secondaryContainer": "rgb(248, 223, 187)",
                "onSecondaryContainer": "rgb(38, 25, 4)",
                "tertiary": "rgb(78, 101, 67)",
                "onTertiary": "rgb(255, 255, 255)",
                "tertiaryContainer": "rgb(208, 234, 191)",
                "onTertiaryContainer": "rgb(12, 32, 6)",
                "error": "rgb(186, 26, 26)",
                "onError": "rgb(255, 255, 255)",
                "errorContainer": "rgb(255, 218, 214)",
                "onErrorContainer": "rgb(65, 0, 2)",
                "background": "rgb(255, 251, 255)",
                "onBackground": "rgb(31, 27, 22)",
                "surface": "rgb(255, 251, 255)",
                "onSurface": "rgb(31, 27, 22)",
                "surfaceVariant": "rgb(238, 224, 207)",
                "onSurfaceVariant": "rgb(78, 69, 57)",
                "outline": "rgb(128, 117, 103)",
                "outlineVariant": "rgb(210, 197, 180)",
                "shadow": "rgb(0, 0, 0)",
                "scrim": "rgb(0, 0, 0)",
                "inverseSurface": "rgb(52, 48, 42)",
                "inverseOnSurface": "rgb(248, 239, 231)",
                "inversePrimary": "rgb(255, 186, 50)",
                "elevation": {
                    "level0": "transparent",
                    "level1": "rgb(249, 243, 242)",
                    "level2": "rgb(245, 238, 235)",
                    "level3": "rgb(241, 233, 227)",
                    "level4": "rgb(240, 231, 224)",
                    "level5": "rgb(237, 228, 219)"
                },
                "surfaceDisabled": "rgba(31, 27, 22, 0.12)",
                "onSurfaceDisabled": "rgba(31, 27, 22, 0.38)",
                "backdrop": "rgba(55, 47, 36, 0.4)",

                "green": "rgb(66, 105, 0)",
                "red": "rgb(216, 68, 9)",
                "onGreen": "rgb(255, 255, 255)",
                "greenContainer": "rgb(183, 245, 99)",
                "onGreenContainer": "rgb(17, 32, 0)"
            },
            fonts: configureFonts({ config: fontConfig }),
        }
}