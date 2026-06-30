import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, Icon, List, RadioButton, Text } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'

const BMHouseholdDetailsForm = () => {
    const theme = usePaperColorScheme()

    const [loading, setLoading] = useState(() => false)

    const [noOfRooms, setNoOfRooms] = useState(() => "")
    const [parentalAddress, setParentalAddress] = useState(() => "")
    // const [spouseOccupation, setSpouseOccupation] = useState(() => "")
    // const [spouseMonthlyIncome, setSpouseMonthlyIncome] = useState(() => "")
    const [houseTypes, setHouseTypes] = useState(() => [])
    const [houseType, setHouseType] = useState(() => "")
    // const [amountApplied, setAmountApplied] = useState(() => "")
    const [checkOwnOrRent, setCheckOwnOrRent] = useState(() => 'own')
    const [totalLand, setTotalLand] = useState(() => "")
    const [tvAvailable, setTvAvailable] = useState(() => 'yes')
    const [bikeAvailable, setBikeAvailable] = useState(() => "no")
    const [fridgeAvailable, setFridgeAvailable] = useState(() => "yes")
    const [washingMachineAvailable, setWashingMachineAvailable] = useState(() => "no")

    useEffect(() => {
        setHouseTypes([]);

        [{ type: "Asbestor", value: "1" }, { type: "Roof", value: "2" }, { type: "Kacha", value: "3" }]?.map((item, i) => (
            //@ts-ignore
            setHouseTypes(prev => [...prev, { title: item?.type, func: () => setHouseType(item?.value) }])
        ))
    }, [])


    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <View style={{
                    // paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10
                }}>
                    <Divider />

                    <InputPaper label="No. of Rooms" maxLength={5} leftIcon='greenhouse' keyboardType="numeric" value={noOfRooms} onChangeText={(txt: any) => setNoOfRooms(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Parental Address" multiline leftIcon='form-textbox' value={parentalAddress} onChangeText={(txt: any) => setParentalAddress(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} />

                    <List.Item
                        title="House Type"
                        description={`Purpose: ${houseType}`}
                        left={props => <List.Icon {...props} icon="office-building-cog-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={houseTypes} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <RadioComp
                        title="Own or Rent?"
                        icon="home-switch-outline"
                        dataArray={[
                            {
                                optionName: "OWN",
                                optionState: checkOwnOrRent,
                                currentState: "own",
                                optionSetStateDispathFun: setCheckOwnOrRent
                            },
                            {
                                optionName: "RENT",
                                optionState: checkOwnOrRent,
                                currentState: "rent",
                                optionSetStateDispathFun: setCheckOwnOrRent
                            },
                        ]}
                    />

                    <Divider />

                    <InputPaper label="Total Land (In Kathas)" maxLength={10} leftIcon='fence-electric' keyboardType="numeric" value={totalLand} onChangeText={(txt: any) => setTotalLand(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    {/* <View style={{
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
                            <Icon source="home-switch-outline" size={28} color={theme.colors.secondary} />
                            <Text variant='bodyLarge'>Own a TV?</Text>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5
                        }}>
                            <Text>YES</Text>
                            <RadioButton
                                value="own"
                                status={tvAvailable === 'yes' ? 'checked' : 'unchecked'}
                                onPress={() => setTvAvailable('yes')}
                            />
                            <Text>NO</Text>
                            <RadioButton
                                value="rent"
                                status={tvAvailable === 'no' ? 'checked' : 'unchecked'}
                                onPress={() => setTvAvailable('no')}
                            />
                        </View>
                    </View> */}

                    {/* [{
                        optionName: "YES",
                        optionState: tvAvailable,
                        currentState: "yes",
                        optionSetStateDispathFun: setTvAvailable
                    },] */}

                    <RadioComp
                        title="Own a TV?"
                        icon="television-classic"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: tvAvailable,
                                currentState: "yes",
                                optionSetStateDispathFun: setTvAvailable
                            },
                            {
                                optionName: "NO",
                                optionState: tvAvailable,
                                currentState: "no",
                                optionSetStateDispathFun: setTvAvailable
                            },
                        ]}
                    />
                    <RadioComp
                        title="Own a Bike?"
                        icon="motorbike"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: bikeAvailable,
                                currentState: "yes",
                                optionSetStateDispathFun: setBikeAvailable
                            },
                            {
                                optionName: "NO",
                                optionState: bikeAvailable,
                                currentState: "no",
                                optionSetStateDispathFun: setBikeAvailable
                            },
                        ]}
                    />
                    <RadioComp
                        title="Own a Fridge?"
                        icon="fridge-bottom"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: fridgeAvailable,
                                currentState: "yes",
                                optionSetStateDispathFun: setFridgeAvailable
                            },
                            {
                                optionName: "NO",
                                optionState: fridgeAvailable,
                                currentState: "no",
                                optionSetStateDispathFun: setFridgeAvailable
                            },
                        ]}
                    />
                    <RadioComp
                        title="Washing Machine?"
                        icon="washing-machine"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: washingMachineAvailable,
                                currentState: "yes",
                                optionSetStateDispathFun: setWashingMachineAvailable
                            },
                            {
                                optionName: "NO",
                                optionState: washingMachineAvailable,
                                currentState: "no",
                                optionSetStateDispathFun: setWashingMachineAvailable
                            },
                        ]}
                    />

                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMHouseholdDetailsForm

const styles = StyleSheet.create({})