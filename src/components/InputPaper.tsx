import React from 'react'
import { KeyboardTypeOptions } from "react-native"
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
}

const InputPaper = ({
    label,
    value,
    onChangeText,
    onBlur,
    secureTextEntry,
    keyboardType,
    customStyle,
    leftIcon,
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
}: InputPaperProps) => {
    return (
        <TextInput
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            selectTextOnFocus={selectTextOnFocus}
            mode={mode}
            keyboardType={keyboardType}
            label={label}
            value={value?.toString()}
            onChangeText={onChangeText}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            style={customStyle}
            left={leftIcon && <TextInput.Icon icon={leftIcon} />}
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
        />
    )
}

export default InputPaper