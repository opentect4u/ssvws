import { StyleSheet, View } from 'react-native'
import { IconButton, MD2Colors, Text } from 'react-native-paper'
import React, { useContext } from 'react'
import { usePaperColorScheme } from "../theme/theme"
import { CommonActions, useNavigation } from '@react-navigation/native'
import { AppStore } from '../context/AppContext'

const HeadingComp = ({
    title,
    subtitle,
    background = "",
    isBackEnabled = false,
    footerText = ""
}) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const {
        uat
    } = useContext<any>(AppStore)

    return (
        <View style={{
            backgroundColor: background || theme.colors.primaryContainer,
            margin: 20,
            paddingVertical: 30,
            borderTopLeftRadius: 30,
            borderBottomRightRadius: 30
        }}>
            {isBackEnabled && <View style={{
                position: "absolute"
            }}>
                <IconButton icon="arrow-left" iconColor={theme.colors.onSecondaryContainer} size={20} onPress={() => navigation.dispatch(CommonActions.goBack())} />
            </View>}
            {uat && <View style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: 5,
                backgroundColor: MD2Colors.yellow400,
                borderRadius: 5,
            }}>
                <Text style={{
                    color: MD2Colors.red500,
                    fontWeight: "bold"
                }}>UAT</Text>
            </View>}
            <View style={{
                padding: 15,
            }}>
                <Text variant="headlineLarge" style={{
                    color: theme.colors.onSecondaryContainer,
                    // textAlign: "left",
                }}>{title}</Text>
                <Text variant="bodyLarge" style={{
                    color: theme.colors.onSecondaryContainer,
                    // textAlign: "left",
                }}>{subtitle}</Text>
            </View>
            {footerText && <Text variant="bodySmall" style={{
                color: theme.colors.onPrimary,
                textAlign: "center",
                bottom: -17,
                right: 20,
                left: 160,
                textTransform: "uppercase",
                fontStyle: "italic",
                backgroundColor: MD2Colors.blue500,
                padding: 4,
                width: 200,
                borderRadius: 10,
                fontSize: 11
            }}>{footerText}</Text>}

        </View>
    )
}

export default HeadingComp

const styles = StyleSheet.create({})