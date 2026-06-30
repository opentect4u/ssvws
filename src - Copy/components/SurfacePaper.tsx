import React from 'react'
import { PixelRatio, StyleSheet, View } from "react-native"
import { Surface, Text } from "react-native-paper"
import { usePaperColorScheme } from "../theme/theme"
import { PropsWithChildren } from "react"
import { ElevationLevels } from "react-native-paper/lib/typescript/types"
import { SCREEN_WIDTH } from "react-native-normalize"

type SurfacePaperProps = {
    backgroundColor: string
    heading?: string
    elevation?: ElevationLevels
    customTheme?: {}
    isBorderEnabled?: boolean
    paddingEnabled?: boolean
    borderRadiusEnabled?: boolean
    smallWidthEnabled?: boolean
    style?: {}
}

export default function SurfacePaper({
    heading,
    elevation,
    backgroundColor,
    children,
    isBorderEnabled,
    paddingEnabled,
    borderRadiusEnabled,
    smallWidthEnabled,
    style,
}: PropsWithChildren<SurfacePaperProps>) {
    const theme = usePaperColorScheme()
    return (
        <Surface
            style={[
                styles.bill,
                {
                    backgroundColor: backgroundColor,
                    padding: paddingEnabled ? 5 : 0,
                    borderRadius: borderRadiusEnabled ? 30 : 0,
                    width: smallWidthEnabled ? SCREEN_WIDTH / 1.16 : SCREEN_WIDTH / 1.05,
                },
                { ...style },
            ]}
            elevation={elevation}>
            {heading && (
                <Text
                    variant="headlineSmall"
                    style={{
                        fontFamily: "ProductSans-Medium",
                        textAlign: "center",
                        marginBottom: 5,
                    }}>
                    {heading}
                </Text>
            )}

            {isBorderEnabled && (
                <View
                    style={{
                        width: "80%",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderRadius: 10,
                        // marginBottom: 5,
                        borderColor: theme.colors.onTertiaryContainer,
                    }}></View>
            )}
            {children}
        </Surface>
    )
}

const styles = StyleSheet.create({
    bill: {
        alignSelf: "center",
        margin: 10,
        height: "auto",
        maxHeight: "auto",
        alignItems: "center",
    },
})