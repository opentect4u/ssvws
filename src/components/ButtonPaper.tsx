import React from 'react'
import { PropsWithChildren } from "react"
import { Button, Text } from "react-native-paper"
import { IconSource } from "react-native-paper/lib/typescript/components/Icon"

type ButtonPaperProps = {
    children?: React.ReactNode
    mode: "text" | "outlined" | "contained" | "elevated" | "contained-tonal"
    onPress: (e: any) => void
    icon?: IconSource
    buttonColor?: string
    textColor?: string
    style?: {}
    disabled?: boolean
    loading?: boolean
}

const ButtonPaper = ({
    children,
    mode,
    onPress,
    icon,
    buttonColor,
    textColor,
    style,
    disabled,
    loading,
}: PropsWithChildren<ButtonPaperProps>) => (
    <Button
        loading={loading}
        disabled={disabled}
        icon={icon}
        mode={mode}
        onPress={onPress}
        buttonColor={buttonColor}
        textColor={textColor}
        style={style}>
        {children}
    </Button>
)

export default ButtonPaper