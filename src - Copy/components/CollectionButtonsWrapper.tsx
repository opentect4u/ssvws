import { View } from "react-native"
import React, { PropsWithChildren } from "react"
import normalize from "react-native-normalize"

export default function CollectionButtonsWrapper({ children }: PropsWithChildren) {
    return (
        <View
            style={{
                // padding: normalize(10),
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
            }}>
            {children}
        </View>
    )
}