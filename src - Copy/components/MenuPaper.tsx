import { StyleSheet } from "react-native"
import React, { useState } from "react"
import { Button, Menu } from "react-native-paper"
// import { loginStorage } from "../storage/appStorage"
import { SCREEN_WIDTH } from "react-native-normalize"

type MenuPaperTypes = {
    menuArrOfObjects: { icon?: string; title: string; func: () => void }[]
    title?: string
    textColor?: string
    customStyle?: {}
    menuStyle?: {}
    mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal"
    disabled?: boolean
}

export default function MenuPaper({
    menuArrOfObjects,
    title = "Options",
    customStyle,
    textColor,
    menuStyle,
    mode,
    disabled
}: MenuPaperTypes) {
    const [visible, setVisible] = useState(false)
    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)

    // const loginStore = JSON.parse(loginStorage.getString("login-data"))

    return (
        <Menu
            style={menuStyle}
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                <Button
                    icon="chevron-down-circle-outline"
                    onPress={openMenu}
                    // textColor={textColor}
                    disabled={disabled}
                    style={customStyle}
                    mode={mode}
                    textColor={textColor}>
                    {title}
                </Button>
            }>
            {menuArrOfObjects?.map((item, i) => (
                <Menu.Item
                    key={i}
                    trailingIcon={item.icon}
                    onPress={() => {
                        item.func()
                        closeMenu()
                    }}
                    title={item.title}
                />
            ))}
        </Menu>
    )
}

const styles = StyleSheet.create({})