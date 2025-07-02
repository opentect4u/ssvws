import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Chip, Text } from "react-native-paper"
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../../components/InputPaper'
import MenuPaper from '../../components/MenuPaper'
import ButtonPaper from '../../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import { loginStorage } from '../../storage/appStorage'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
// import LoadingOverlay from '../components/LoadingOverlay'

const GroupFormExtended = ({ fetchedData, approvalStatus = "U" }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LOGIN DATAAA =============", loginStore)
    console.log("4444444444444444444ffffffffffffffff", fetchedData)

    const [loading, setLoading] = useState(() => false)


    const [groupBlocks, setGroupBlocks] = useState(() => [])

    const [formData, setFormData] = useState({
        groupName: "",
        groupType: "",
        groupTypeName: "",
        address: "",
        pin: "",
        phoneNo: "",
        phoneNo2: "",
        bankName: "",
        bankBranchName: "",
        ifscCode: "",
        micr: "",
        accNo1: "",
        accNo2: "",
        emailId: "",
        groupBlock: "",
        groupBlockName: "",
        groupOpenDate: new Date()?.toLocaleString("en-GB")
    })

    const [memberDetailsArray, setMemberDetailsArray] = useState(() => [])

    const groupTypes = [
        {
            title: "SHG",
            func: () => {
                handleFormChange("groupType", "S");
                handleFormChange("groupTypeName", "SHG")
            }
        },
        {
            title: "JLG",
            func: () => {
                handleFormChange("groupType", "J");
                handleFormChange("groupTypeName", "JLG")
            }
        }
    ]

    const handleFetchBlocks = async () => {
        setGroupBlocks(() => [])
        await axios.get(`${ADDRESSES.GET_BLOCKS}?dist_id=${loginStore?.dist_code}`).then(res => {
            res?.data?.msg?.map((item, i) => (
                //@ts-ignore
                setGroupBlocks(prev => [...prev, { title: item?.block_name, func: () => { handleFormChange("groupBlock", item?.block_id); handleFormChange("groupBlockName", item?.block_name) } }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchBlocks}!", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        handleFetchBlocks()
    }, [])

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleFetchMembers = async () => {
        const creds = {
            branch_code: loginStore?.brn_code,
            grp_code: fetchedData?.group_code,
            flag: fetchedData?.approval_status
        }
        console.log("+++++===++++++++++++++++", creds)
        await axios.post(`${ADDRESSES.MEMBER_DETAILS}`, creds).then(res => {
            console.log("JJJJJJJSADDDASDSAD", res?.data)
            setMemberDetailsArray(res?.data?.msg)
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchMembers}!", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        handleFetchMembers()
    }, [fetchedData])

    useEffect(() => {
        setFormData({
            groupName: fetchedData?.group_name || "",
            groupType: fetchedData?.group_type || "",
            groupTypeName: fetchedData?.group_type === "S" ? "SHG" : fetchedData?.group_type === "J" ? "JLG" : "",
            address: fetchedData?.grp_addr || "",
            pin: fetchedData?.pin_no || "",
            phoneNo: fetchedData?.phone1 || "",
            phoneNo2: fetchedData?.phone2 || "",
            bankName: fetchedData?.bank_name || "",
            bankBranchName: fetchedData?.branch_name || "",
            ifscCode: fetchedData?.ifsc || "",
            micr: fetchedData?.micr || "",
            accNo1: fetchedData?.acc_no1 || "",
            accNo2: fetchedData?.acc_no2 || "",
            emailId: fetchedData?.email_id || "",
            groupBlock: fetchedData?.block || "",
            groupBlockName: fetchedData?.block_name || "",
            groupOpenDate: new Date(fetchedData?.grp_open_dt)?.toLocaleString("en-GB") || new Date().toLocaleString()
        })
    }, [])

    const handleSubmitGroupDetails = async () => {
        console.log("Group updated!")
        setLoading(true)
        const creds = {
            "phone1": formData?.phoneNo,
            "phone2": formData?.phoneNo2,
            "email_id": formData?.emailId,
            "grp_addr": formData?.address,
            // "disctrict": formData?.,
            "block": formData?.groupBlock,
            "pin_no": formData?.pin,
            "bank_name": formData?.bankName,
            "branch_name": formData?.bankBranchName,
            "ifsc": formData?.ifscCode,
            "micr": formData?.micr,
            "acc_no1": formData?.accNo1,
            "acc_no2": formData?.accNo2,
            // "ac_open_dt": fetchedData?.ac_open_dt,
            "modified_by": loginStore?.emp_id,
            "group_code": fetchedData?.group_code,
            "branch_code": fetchedData?.branch_code,
            "co_id": loginStore?.emp_id
        }

        // console.log("GROUPPPP-----CREDSSSS", creds)

        await axios.post(`${ADDRESSES.EDIT_GROUP}`, creds).then(res => {
            console.log("GROUP EDIT ==============", res?.data)

            ToastAndroid.show("Group updated successfully!", ToastAndroid.SHORT)


            navigation.dispatch(CommonActions.goBack())
        }).catch(err => {
            ToastAndroid.show("Some error occurred while updating group.", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background,
            }}>
                <View style={{
                    paddingBottom: 10,
                    gap: 14
                }}>
                    <Divider />

                    <InputPaper label="Group Name*" leftIcon='account-group-outline' keyboardType="default" value={formData.groupName} onChangeText={(txt: any) => handleFormChange("groupName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <List.Item
                        title="Choose Group Type*"
                        description={`Group Type: ${formData.groupTypeName}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupTypes} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <Divider />

                    <InputPaper label="Address*" multiline leftIcon='card-account-phone-outline' keyboardType="default" value={formData.address} onChangeText={(txt: any) => handleFormChange("address", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="PIN No.*" maxLength={10} leftIcon='map-legend' keyboardType="numeric" value={formData.pin} onChangeText={(txt: any) => handleFormChange("pin", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <List.Item
                        title="Choose Block*"
                        description={`Group Block: ${formData.groupBlockName}`}
                        left={props => <List.Icon {...props} icon="map-marker-distance" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupBlocks} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <Divider />

                    <InputPaper label="Mobile No. 1*" maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={formData.phoneNo} onChangeText={(txt: any) => handleFormChange("phoneNo", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="Mobile No. 2*" maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={formData.phoneNo2} onChangeText={(txt: any) => handleFormChange("phoneNo2", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="Email Id.*" leftIcon='email-outline' keyboardType="email-address" value={formData.emailId} onChangeText={(txt: any) => handleFormChange("emailId", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="Bank Name*" leftIcon='bank-outline' keyboardType="default" value={formData.bankName} onChangeText={(txt: any) => handleFormChange("bankName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="Bank Branch*" leftIcon='bank-transfer-in' keyboardType="default" value={formData.bankBranchName} onChangeText={(txt: any) => handleFormChange("bankBranchName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="IFSC*" leftIcon='numeric' keyboardType="default" value={formData.ifscCode} onChangeText={(txt: any) => handleFormChange("ifscCode", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="MICR Code*" leftIcon='nfc' keyboardType="default" value={formData.micr} onChangeText={(txt: any) => handleFormChange("micr", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="Account No. 1*" maxLength={20} leftIcon='numeric-1-circle-outline' keyboardType="numeric" value={formData.accNo1} onChangeText={(txt: any) => handleFormChange("accNo1", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <InputPaper label="Account No. 2*" maxLength={20} leftIcon='numeric-2-circle-outline' keyboardType="numeric" value={formData.accNo2} onChangeText={(txt: any) => handleFormChange("accNo2", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code} />

                    <View>
                        <Divider />
                    </View>

                    <View>
                        <Text variant='labelLarge' style={{
                            marginBottom: 10,
                            color: theme.colors.primary
                        }}>Members</Text>
                        <View style={{
                            flexDirection: "row",
                            gap: 8,
                            flexWrap: "wrap"
                        }}>
                            {memberDetailsArray?.map((item, i) => (
                                <Chip key={i} icon="account-circle-outline" onPress={() => {
                                    navigation.dispatch(CommonActions.navigate({
                                        name: navigationRoutes.memberDetailsAllFormScreen,
                                        params: {
                                            member_details: item,
                                            formNumber: item?.form_no,
                                            branchCode: item?.branch_code,
                                            userFlag: loginStore?.id === 1 ? "CO" : loginStore?.id === 2 ? "BM" : ""
                                        }
                                    }))
                                }}
                                    disabled={approvalStatus === "A" || fetchedData.branch_code !== loginStore?.brn_code}>{item?.client_name}</Chip>
                            ))}
                        </View>
                    </View>

                    <View>
                        <Divider />
                    </View>

                    <View style={{
                        flexDirection: "row",
                        // marginBottom: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="arrow-up-bold" mode="contained" onPress={() => {
                            Alert.alert(`Update group ${formData.groupName}?`, `Are you sure, you want to create this group?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: () => handleSubmitGroupDetails(),
                                text: "Yes"
                            }])

                        }} disabled={
                            loading
                            || !formData.groupName
                            || !formData.groupType
                            || !formData.address
                            || !formData.groupBlock
                            || !formData.phoneNo
                            || !formData.pin
                            || !formData.bankName
                            || !formData.bankBranchName
                            || !formData.accNo1
                            // || !formData.accNo2
                            || !formData.ifscCode
                            || approvalStatus === "A"
                            || fetchedData.branch_code !== loginStore?.brn_code
                        } loading={loading}>
                            UPDATE GROUP
                        </ButtonPaper>

                        {/* disabled={!groupName || !groupType || !address || !groupBlock || !phoneNo} */}

                        {/* <ButtonPaper icon="arrow-right-bottom-bold" mode="contained-tonal" onPress={() => navigation.dispatch(CommonActions.navigate({
                            name: "GRT"
                        }))}>
                            GO TO GRT
                        </ButtonPaper> */}
                    </View>

                </View>
                {/* <ButtonPaper mode='contained' onPress={() => setVisible(true)}>Click me</ButtonPaper> */}
            </ScrollView>

            {/* <DialogBox
                visible={visible}
                title="Group Details"
                hide={hideDialog}
                titleStyle={{ textAlign: "center" }}
                btnSuccess={"OK"}
                // onFailure={onDialogFailure}
                onSuccess={onDialogSuccess}>
                <View>
                    <Text variant='bodyLarge'>GROUP CODE: {resGroupCode}</Text>
                    <Text variant='bodyLarge'>GROUP NAME: {resGroupName}</Text>
                    <Text variant='bodyLarge'>OPENING DATETIME: {formData.groupOpenDate}</Text>
                </View>
            </DialogBox> */}

        </SafeAreaView>
    )
}

export default GroupFormExtended

const styles = StyleSheet.create({})