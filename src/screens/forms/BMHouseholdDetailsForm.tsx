import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, List } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'
import ButtonPaper from '../../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import { loginStorage } from '../../storage/appStorage'
import { disableConditionExceptBasicDetails } from '../../utils/disableCondition'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'

interface BMOccupationDetailsFormProps {
    formNumber?: any
    branchCode?: any
    flag?: "CO" | "BM"
    approvalStatus?: "U" | "A" | "S"
    onSubmit?: any
}

const BMHouseholdDetailsForm = ({ formNumber, branchCode, flag = "BM", approvalStatus = "U", onSubmit = () => null }: BMOccupationDetailsFormProps) => {
    const theme = usePaperColorScheme()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    const navigation = useNavigation()

    const [loading, setLoading] = useState(() => false)

    const [houseTypes, setHouseTypes] = useState(() => [])

    const [formData, setFormData] = useState({
        noOfRooms: "",
        parentalAddress: "",
        parentalPhoneNumber: "",
        houseType: "",
        checkOwnOrRent: "",
        totalLand: "",
        politicallyActive: "",
        tvAvailable: "",
        bikeAvailable: "",
        fridgeAvailable: "",
        washingMachineAvailable: "",
    })

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    useEffect(() => {
        setHouseTypes([]);

        [{ type: "Asbestos", value: "Abestor" }, { type: "Concrete Roof", value: "Concrete Roof" }, { type: "Kaccha", value: "Kaccha" }]?.map((item, i) => (
            //@ts-ignore
            setHouseTypes(prev => [...prev, { title: item?.type, func: () => handleFormChange("houseType", item?.value) }])
        ))
    }, [])

    const fetchHouseholdDetails = async () => {
        setLoading(true)

        await axios.get(`${ADDRESSES.FETCH_HOUSEHOLD_DETAILS}?form_no=${formNumber}&branch_code=${branchCode}`).then(res => {
            console.log("HOUSEHOLD===FETCH", res?.data)
            setFormData({
                noOfRooms: res?.data?.msg[0]?.no_of_rooms || "",
                parentalAddress: res?.data?.msg[0]?.parental_addr || "",
                parentalPhoneNumber: res?.data?.msg[0]?.parental_phone || "",
                houseType: res?.data?.msg[0]?.house_type || "",
                checkOwnOrRent: res?.data?.msg[0]?.own_rent || "",
                totalLand: res?.data?.msg[0]?.land || "",
                politicallyActive: res?.data?.msg[0]?.poltical_flag || "",
                tvAvailable: res?.data?.msg[0]?.tv_flag || "",
                bikeAvailable: res?.data?.msg[0]?.bike_flag || "",
                fridgeAvailable: res?.data?.msg[0]?.fridge_flag || "",
                washingMachineAvailable: res?.data?.msg[0]?.wm_flag || "",
            })
        }).catch(err => {
            ToastAndroid.show("Something went wrong while fetching Household Details!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    useEffect(() => {
        fetchHouseholdDetails()
    }, [])

    const handleFormUpdate = async () => {
        setLoading(true)

        const creds = {
            form_no: formNumber,
            branch_code: branchCode,
            no_of_rooms: formData.noOfRooms,
            house_type: formData.houseType,
            own_rent: formData.checkOwnOrRent,
            land: formData.totalLand,
            tv_flag: formData.tvAvailable,
            bike_flag: formData.bikeAvailable,
            fridge_flag: formData.fridgeAvailable,
            wm_flag: formData.washingMachineAvailable,
            poltical_flag: formData.politicallyActive,
            parental_addr: formData.parentalAddress,
            parental_phone: formData.parentalPhoneNumber,
            modified_by: loginStore?.emp_id,
            created_by: loginStore?.emp_id
        }

        console.log("//////////////", creds, "///////////////")

        await axios.post(`${ADDRESSES.SAVE_HOUSEHOLD_DETAILS}`, creds).then(res => {
            console.log("HOUSEHOLD====RES", res?.data)

            if (res?.data?.suc === 1) {
                ToastAndroid.show("Household details updated.", ToastAndroid.SHORT)
                onSubmit()
            }
        }).catch(err => {
            console.log("ERRRRR=HOUSEHOLD", err)
            ToastAndroid.show("Something went wrong while updating Household Details!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    const handleFinalSubmit = async () => {
        setLoading(true)
        await handleFormUpdate()

        const creds = {
            modified_by: loginStore?.emp_id,
            form_no: formNumber,
            branch_code: branchCode,
            remarks: "",
        }

        await axios.post(`${ADDRESSES.FINAL_SUBMIT}`, creds).then(res => {
            console.log("FINAL SUBMIT RESSSSS=====", res?.data)
            ToastAndroid.show("Form sent to MIS Assistant.", ToastAndroid.SHORT)
            // navigation.dispatch(CommonActions.goBack())
            navigation.dispatch(
                CommonActions.navigate({
                    name: navigationRoutes.homeScreen,
                }),
            )
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting the final data.", ToastAndroid.SHORT)
        })
        setLoading(false)
    }


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

                    {/* <InputPaper label="No. of Rooms*" maxLength={5} leftIcon='greenhouse' keyboardType="numeric" value={formData.noOfRooms} onChangeText={(txt: any) => handleFormChange("noOfRooms", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} /> */}

                    <InputPaper label="Parental Address*" multiline leftIcon='form-textbox' value={formData.parentalAddress} onChangeText={(txt: any) => handleFormChange("parentalAddress", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    <InputPaper label="Parental Phone No." maxLength={10} leftIcon='phone' keyboardType="number-pad" value={formData.parentalPhoneNumber} onChangeText={(txt: any) => handleFormChange("parentalPhoneNumber", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    <List.Item
                        title="House Type*"
                        description={`Purpose: ${formData.houseType}`}
                        left={props => <List.Icon {...props} icon="office-building-cog-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={houseTypes} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <RadioComp
                        title="Own or Rent?*"
                        icon="home-switch-outline"
                        dataArray={[
                            {
                                optionName: "OWN",
                                optionState: formData.checkOwnOrRent,
                                currentState: "Own",
                                optionSetStateDispathFun: (e) => handleFormChange("checkOwnOrRent", e)
                            },
                            {
                                optionName: "RENT",
                                optionState: formData.checkOwnOrRent,
                                currentState: "Rent",
                                optionSetStateDispathFun: (e) => handleFormChange("checkOwnOrRent", e)
                            },
                        ]}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />

                    <Divider />

                    <InputPaper label="Total Land (In Kathas)" maxLength={10} leftIcon='fence-electric' keyboardType="numeric" value={formData.totalLand} onChangeText={(txt: any) => handleFormChange("totalLand", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    <RadioComp
                        title="Politically Active?"
                        icon="police-badge-outline"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: formData.politicallyActive,
                                currentState: "Y",
                                optionSetStateDispathFun: (e) => handleFormChange("politicallyActive", e)
                            },
                            {
                                optionName: "NO",
                                optionState: formData.politicallyActive,
                                currentState: "N",
                                optionSetStateDispathFun: (e) => handleFormChange("politicallyActive", e)
                            },
                        ]}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <RadioComp
                        title="Own a TV?"
                        icon="television-classic"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: formData.tvAvailable,
                                currentState: "Y",
                                optionSetStateDispathFun: (e) => handleFormChange("tvAvailable", e)
                            },
                            {
                                optionName: "NO",
                                optionState: formData.tvAvailable,
                                currentState: "N",
                                optionSetStateDispathFun: (e) => handleFormChange("tvAvailable", e)
                            },
                        ]}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <RadioComp
                        title="Own a Bike?"
                        icon="motorbike"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: formData.bikeAvailable,
                                currentState: "Y",
                                optionSetStateDispathFun: (e) => handleFormChange("bikeAvailable", e)
                            },
                            {
                                optionName: "NO",
                                optionState: formData.bikeAvailable,
                                currentState: "N",
                                optionSetStateDispathFun: (e) => handleFormChange("bikeAvailable", e)
                            },
                        ]}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <RadioComp
                        title="Own a Fridge?"
                        icon="fridge-bottom"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: formData.fridgeAvailable,
                                currentState: "Y",
                                optionSetStateDispathFun: (e) => handleFormChange("fridgeAvailable", e)
                            },
                            {
                                optionName: "NO",
                                optionState: formData.fridgeAvailable,
                                currentState: "N",
                                optionSetStateDispathFun: (e) => handleFormChange("fridgeAvailable", e)
                            },
                        ]}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <RadioComp
                        title="Washing Machine?"
                        icon="washing-machine"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: formData.washingMachineAvailable,
                                currentState: "Y",
                                optionSetStateDispathFun: (e) => handleFormChange("washingMachineAvailable", e)
                            },
                            {
                                optionName: "NO",
                                optionState: formData.washingMachineAvailable,
                                currentState: "N",
                                optionSetStateDispathFun: (e) => handleFormChange("washingMachineAvailable", e)
                            },
                        ]}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />

                    {/* <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={() => {
                        Alert.alert("Update Household Details", "Are you sure you want to update this?", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleFormUpdate() },
                        ])
                    }} 
                    // disabled={loading || !formData.noOfRooms || !formData.parentalAddress || !formData.houseType || !formData.checkOwnOrRent || !formData.politicallyActive || !formData.tvAvailable || !formData.fridgeAvailable || !formData.bikeAvailable || !formData.washingMachineAvailable || disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    disabled={loading || disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    loading={loading}>UPDATE</ButtonPaper> */}
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingTop: 10,
                    paddingBottom: 10
                }}>
                    {/* <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={() => {
                        Alert.alert("Update Family Members Details", "Are you sure you want to update this?", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleFormUpdate() },
                        ])
                    }} disabled={loading || disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                        loading={loading}>UPDATE</ButtonPaper> */}

                    <ButtonPaper mode='contained-tonal' icon="send-circle-outline" onPress={() => {
                        Alert.alert("Final Submit", "Are you sure you want to finalize the whole form and send to MIS Assistant? Make sure you updated all the details properly. The action is not revertable.", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleFinalSubmit() },
                        ])
                    }} disabled={loading || disableConditionExceptBasicDetails(approvalStatus, branchCode, flag) || !formData.parentalAddress || !formData.houseType || !formData.checkOwnOrRent}
                        loading={loading}>SEND</ButtonPaper>
                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMHouseholdDetailsForm

const styles = StyleSheet.create({})