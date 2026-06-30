import { StyleSheet, View } from 'react-native'
import React from 'react'
import { usePaperColorScheme } from '../theme/theme'
import { Icon, MD2Colors, Text } from 'react-native-paper'

type ListCardProps = {
    backgroundColor?: string
    position: 1 | 0 | -1
    icon?: string
    iconColor?: string
    iconViewColor: string
    iconViewBorderColor: string
    title: string
    subtitle: string
    subtitleColor?: string
    direction?: "rtl" | "ltr"
}

const ListCard = ({
    backgroundColor,
    position,
    icon,
    iconColor,
    iconViewColor,
    iconViewBorderColor,
    title,
    subtitle,
    subtitleColor,
    direction = "ltr"
}: ListCardProps) => {
    const theme = usePaperColorScheme()

    return (
        <View style={position === 0 ? {
            height: 80,
            width: "100%",
            backgroundColor: backgroundColor || theme.colors.surface,
            borderRadius: 0,
            alignItems: "center",
            paddingHorizontal: 15,
            flexDirection: direction === "ltr" ? "row" : direction === "rtl" ? "row-reverse" : "row",
            gap: 15
        } : position === 1 ? {
            height: 80,
            width: "100%",
            backgroundColor: backgroundColor || theme.colors.surface,
            borderRadius: 20,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            alignItems: "center",
            paddingHorizontal: 15,
            flexDirection: direction === "ltr" ? "row" : direction === "rtl" ? "row-reverse" : "row",
            gap: 15
        } : position === -1 ? {
            height: 80,
            width: "100%",
            backgroundColor: backgroundColor || theme.colors.surface,
            borderRadius: 20,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            alignItems: "center",
            paddingHorizontal: 15,
            flexDirection: direction === "ltr" ? "row" : direction === "rtl" ? "row-reverse" : "row",
            gap: 15
        } : {}}>
            <View style={{
                backgroundColor: iconViewColor,
                width: 53,
                height: 53,
                borderWidth: 5,
                borderColor: iconViewBorderColor,
                borderRadius: 150,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Icon source={icon || "cash"} size={25} color={iconColor || theme.colors.surface} />
            </View>
            <View>
                <Text variant='titleMedium' style={{ color: iconViewColor }}>{title}</Text>
                <Text variant='titleSmall' style={{ color: subtitleColor || theme.colors.secondary }}>{subtitle}</Text>
            </View>
        </View>
    )
}

export default ListCard

const styles = StyleSheet.create({})