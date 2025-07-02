import React from 'react'
import { AnimatedFAB } from "react-native-paper"

type AnimatedFABPaperProps = {
    icon: string
    label: string
    extended?: boolean
    onPress: () => void
    visible?: boolean
    customStyle?: {}
    iconMode?: "dynamic" | "static"
    animateFrom?: "left" | "right"
    disabled?: boolean
    color?: string
    variant?: "primary" | "secondary" | "tertiary" | "surface"
}

export default function AnimatedFABPaper({
    icon,
    label,
    onPress,
    extended = false,
    visible,
    animateFrom,
    iconMode,
    customStyle,
    disabled,
    color,
    variant
}: AnimatedFABPaperProps) {
    return (
        <AnimatedFAB
            icon={icon}
            label={label}
            extended={extended}
            onPress={onPress}
            visible={visible}
            animateFrom={animateFrom}
            iconMode={iconMode}
            style={customStyle}
            disabled={disabled}
            color={color}
            variant={variant}
        />
    )
}