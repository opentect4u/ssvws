import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Icon, RadioButton, Text } from 'react-native-paper'
import { usePaperColorScheme } from '../theme/theme'

interface DataArrayProps {
    optionName: string
    optionState: string
    currentState: string
    optionSetStateDispathFun: React.Dispatch<React.SetStateAction<string>>
}

interface RadioCompProps {
    title: string
    icon?: string
    dataArray: Array<DataArrayProps>

    titleColor?: string
    color?: string
    radioButtonColor?: string
    disabled?: boolean
}

const RadioComp = ({ title, titleColor, icon, dataArray, color, radioButtonColor, disabled }: RadioCompProps) => {
    const theme = usePaperColorScheme()

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 5,
        }}>
            <View style={{
                flexDirection: "row",
                gap: 12
            }}>
                <Icon source={icon} size={25} color={color ?? theme.colors.secondary} />
                <Text variant='bodyLarge' style={{
                    color: titleColor || theme.colors.secondary
                }}>{title}</Text>
            </View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5
            }}>
                {
                    dataArray?.map((item, i) => (
                        <View key={i} style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5
                        }}>
                            <Text style={{
                                color: color ?? theme.colors.secondary,
                                fontSize: 17
                            }}>{item?.optionName}</Text>
                            <RadioButton
                                disabled={disabled}
                                color={radioButtonColor ?? theme.colors.primary}
                                value={item?.optionState}
                                status={item?.optionState === item?.currentState ? 'checked' : 'unchecked'}
                                onPress={() => item?.optionSetStateDispathFun(item?.currentState)}
                            />
                        </View>
                    ))
                }
                {/* <Text>YES</Text>
                <RadioButton
                    value="yes"
                    status={tvAvailable === 'yes' ? 'checked' : 'unchecked'}
                    onPress={() => setTvAvailable('yes')}
                />
                <Text>NO</Text>
                <RadioButton
                    value="no"
                    status={tvAvailable === 'no' ? 'checked' : 'unchecked'}
                    onPress={() => setTvAvailable('no')}
                /> */}
            </View>
        </View>
    )
}

export default RadioComp

const styles = StyleSheet.create({})