import React, { ReactNode } from 'react'
import { KeyboardTypeOptions, StyleSheet } from "react-native"
import { TextInput } from "react-native-paper"

type InputPaperProps = {
    label: string
    value: string | number
    onChangeText: (msg: string | number) => void
    onBlur?: () => void
    secureTextEntry?: boolean
    keyboardType?: KeyboardTypeOptions
    customStyle?: {}
    leftIcon?: string
     leftIconSize?: number        // 👈 NEW
    autoFocus?: boolean
    mode?: "outlined" | "flat"
    maxLength?: number
    selectTextOnFocus?: boolean
    disabled?: boolean
    clearTextOnFocus?: boolean
    // themeColors?: string
    hideUnderline?: boolean
    multiline?: boolean
    onFocus?: () => void
    onKeyPress?: () => void
    rightNode?: ReactNode
    isInputFieldInUppercase?:boolean
}

const InputPaper = ({
    isInputFieldInUppercase=true,
    label,
    value,
    onChangeText,
    onBlur,
    secureTextEntry,
    keyboardType,
    customStyle,
    leftIcon,
    leftIconSize = 20,
    autoFocus,
    mode = "flat",
    maxLength = 100,
    selectTextOnFocus,
    disabled,
    clearTextOnFocus,
    // themeColors,
    multiline,
    hideUnderline = false,
    onFocus,
    onKeyPress,
    rightNode
}: InputPaperProps) => {
    return (
        <TextInput
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            selectTextOnFocus={selectTextOnFocus}
            mode={mode}
            keyboardType={keyboardType}
            label={label}
            value={isInputFieldInUppercase ? value?.toString().toUpperCase() : value?.toString()}
            onChangeText={onChangeText}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            style={[customStyle,isInputFieldInUppercase && style.textInputStyle]}
            left={leftIcon && <TextInput.Icon icon={leftIcon} size={leftIconSize} />}
            // right={<TextInput.Icon icon={secureTextEntry ? "eye-off" : "eye"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
            autoFocus={autoFocus}
            maxLength={maxLength}
            multiline={multiline}
            // underlineColor={themeColors}
            // underlineStyle={{ backgroundColor: themeColors }}
            // cursorColor={themeColors}
            // // selectionColor={themeColors}
            // textColor={themeColors}
            // placeholderTextColor={themeColors}
            disabled={disabled}
            clearTextOnFocus={clearTextOnFocus}
            underlineStyle={{
                display: !hideUnderline ? "flex" : "none"
            }}
            right={rightNode}
        />
    )
}

const style = StyleSheet.create({
    textInputStyle:{
            textTransform:'uppercase'
    }
})

export default InputPaper