import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, List, Text } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import ButtonPaper from '../../components/ButtonPaper'
import { loginStorage } from '../../storage/appStorage'
import { disableConditionExceptBasicDetails } from '../../utils/disableCondition'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface BMOccupationDetailsFormProps {
    formNumber?: any
    branchCode?: any
    flag?: "CO" | "BM"
    approvalStatus?: "U" | "A" | "S"
    onSubmit?: any
}

var appliedDefaultAmt = 50000

const BMOccupationDetailsForm = ({ formNumber, branchCode, flag = "BM", approvalStatus = "U", onSubmit = () => null }: BMOccupationDetailsFormProps) => {
    const theme = usePaperColorScheme()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    const [purposesOfLoan, setPurposesOfLoan] = useState(() => [])
    const [subPurposesOfLoan, setSubPurposesOfLoan] = useState(() => [])
    const [defaultAmt, setDefaultAmt] = useState('')

    const [formData, setFormData] = useState({
        selfOccupation: "",
        selfMonthlyIncome: "",
        spouseOccupation: "",
        spouseMonthlyIncome: "",
        purposeOfLoan: "",
        purposeOfLoanName: "",
        subPurposeOfLoan: "",
        subPurposeOfLoanName: "",
        // amountApplied: "",
        amountApplied: defaultAmt.length > 0 ? defaultAmt : appliedDefaultAmt,
        checkOtherOngoingLoan: "N",
        otherLoanAmount: "",
        monthlyEmi: "",
    })



    const handleFormChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const fetchOccupationDetails = async () => {
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_OCCUPATION_DETAILS}?form_no=${formNumber}&branch_code=${branchCode}`).then(res => {
            if (res?.data?.msg?.length === 0) {
                ToastAndroid.show("No data found!", ToastAndroid.SHORT)
                return
            }
            console.log("FETCHHHHHH=====", res?.data)
            if (res?.data?.suc === 1) {
                setFormData({
                    selfOccupation: res?.data?.msg[0]?.self_occu || "",
                    selfMonthlyIncome: res?.data?.msg[0]?.self_income || "",
                    spouseOccupation: res?.data?.msg[0]?.spouse_occu || "",
                    spouseMonthlyIncome: res?.data?.msg[0]?.spouse_income || "",
                    purposeOfLoan: res?.data?.msg[0]?.loan_purpose || "",
                    purposeOfLoanName: res?.data?.msg[0]?.purpose_id || "",
                    subPurposeOfLoan: res?.data?.msg[0]?.sub_pupose || "",
                    subPurposeOfLoanName: res?.data?.msg[0]?.sub_purp_name || "",
                    amountApplied: res?.data?.msg[0]?.applied_amt || "",
                    // amountApplied: res?.data?.msg[0]?.applied_amt == "" ? appliedDefaultAmt : res?.data?.msg[0]?.applied_amt,
                    checkOtherOngoingLoan: res?.data?.msg[0]?.other_loan_flag || "",
                    otherLoanAmount: res?.data?.msg[0]?.other_loan_amt || "",
                    monthlyEmi: res?.data?.msg[0]?.other_loan_emi || "",
                })

                setDefaultAmt(res?.data?.msg[0]?.applied_amt)
            }
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching occupation details!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    useEffect(() => {
        fetchOccupationDetails()
    }, [])

    const fetchPurposeOfLoan = async () => {
        setPurposesOfLoan([]);
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_PURPOSE_OF_LOAN}`).then(res => {
            // purp_id
            if (res?.data?.suc === 1) {
                res?.data?.msg?.map((item, _) => (
                    setPurposesOfLoan(prev => [...prev, { title: item?.purpose_id, func: () => { handleFormChange("purposeOfLoan", item?.purp_id); handleFormChange("purposeOfLoanName", item?.purpose_id) } }])
                ))
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching Purposes of Loan!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const fetchSubPurposeOfLoan = async () => {
        setSubPurposesOfLoan([]);
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_SUB_PURPOSE_OF_LOAN}?purp_id=${formData.purposeOfLoan}`).then(res => {
            if (res?.data?.suc === 1) {
                res?.data?.msg?.map((item, _) => (
                    setSubPurposesOfLoan(prev => [...prev, { title: item?.sub_purp_name, func: () => { handleFormChange("subPurposeOfLoan", item?.sub_purp_id); handleFormChange("subPurposeOfLoanName", item?.sub_purp_name) } }])
                ))
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching Sub Purposes of Loan!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    useEffect(() => {
        fetchPurposeOfLoan()
    }, [])

    useEffect(() => {
        fetchSubPurposeOfLoan()
    }, [formData.purposeOfLoan])

    const handleFormUpdate = async () => {
        setLoading(true)
        const creds = {
            form_no: formNumber,
            branch_code: branchCode,
            self_occu: formData.selfOccupation,
            self_income: formData.selfMonthlyIncome,
            spouse_occu: formData.spouseOccupation,
            spouse_income: formData.spouseMonthlyIncome,
            loan_purpose: formData.purposeOfLoan,
            sub_pupose: formData.subPurposeOfLoan,
            applied_amt: formData.amountApplied,
            other_loan_flag: formData.checkOtherOngoingLoan,
            other_loan_amt: formData.otherLoanAmount,
            other_loan_emi: formData.monthlyEmi, // check
            modified_by: loginStore?.emp_id,
            created_by: loginStore?.emp_id,
        }
        await axios.post(`${ADDRESSES.SAVE_OCCUPATION_DETAILS}`, creds).then(res => {
            console.log("occccccuuuuuppppppddddd save", res?.data)
            if (res?.data?.suc === 1) {
                ToastAndroid.show("Occupation details saved.", ToastAndroid.SHORT)
                onSubmit()
            }
        }).catch(err => {
            console.log("OCUCUUUCUCUCUC ERRR", err)
            ToastAndroid.show("Some error occurred while saving occupation details!", ToastAndroid.SHORT)
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

                    <InputPaper label="Self Occupation*" maxLength={50} leftIcon='bag-personal-outline' keyboardType="default" value={formData.selfOccupation} onChangeText={(txt: any) => handleFormChange("selfOccupation", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    <InputPaper label="Self Monthly Income*" maxLength={15} leftIcon='account-cash-outline' keyboardType="numeric" value={formData.selfMonthlyIncome} onChangeText={(txt: any) => handleFormChange("selfMonthlyIncome", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    <InputPaper label="Spouse Occupation*" maxLength={50} leftIcon='bag-personal-outline' keyboardType="default" value={formData.spouseOccupation} onChangeText={(txt: any) => handleFormChange("spouseOccupation", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    <InputPaper label="Spouse Monthly Income*" maxLength={15} leftIcon='account-cash-outline' keyboardType="numeric" value={formData.spouseMonthlyIncome} onChangeText={(txt: any) => handleFormChange("spouseMonthlyIncome", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    {/* <InputPaper label="Purpose of Loan" multiline leftIcon='form-textbox' value={purposeOfLoan} onChangeText={(txt: any) => setPurposeOfLoan(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} /> */}
                    <List.Item
                        title="Purpose of Loan*"
                        description={`Purpose: ${formData.purposeOfLoanName}`}
                        left={props => <List.Icon {...props} icon="progress-question" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={purposesOfLoan} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    {/* {formData.purposeOfLoan && <List.Item
                        title="Sub Purpose*"
                        description={`Purpose: ${formData.subPurposeOfLoanName}`}
                        left={props => <List.Icon {...props} icon="file-question-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={subPurposesOfLoan} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />} */}

                    <InputPaper label="Amount Applied*" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.amountApplied} onChangeText={(txt: any) => handleFormChange("amountApplied", txt)}
                        // customStyle={{
                        //     backgroundColor: theme.colors.background,
                        // }} 
                        customStyle={{
                            backgroundColor: theme.colors.tertiaryContainer,
                            // borderWidth: 2, // Highlight border
                            borderColor: formData.amountApplied ? "green" : "red", // Change color dynamically
                        }}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />

                    {/* <>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>JSON Data:</Text>
                    <Text style={{ fontSize: 14, color: "blue", marginTop: 10 }}>
                    {JSON.stringify(formData.amountApplied, null, 2)}
                    </Text>
                    </> */}

                    <RadioComp
                        title="Other Loans?*"
                        icon="cash-multiple"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: formData.checkOtherOngoingLoan,
                                currentState: "Y",
                                optionSetStateDispathFun: (e) => handleFormChange("checkOtherOngoingLoan", e)
                            },
                            {
                                optionName: "NO",
                                optionState: formData.checkOtherOngoingLoan,
                                currentState: "N",
                                optionSetStateDispathFun: (e) => handleFormChange("checkOtherOngoingLoan", e)
                            },
                        ]}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />

                    {formData.checkOtherOngoingLoan === "Y" && <InputPaper label="Other Loan Amount*" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.otherLoanAmount} onChangeText={(txt: any) => handleFormChange("otherLoanAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />}

                    {formData.checkOtherOngoingLoan === "Y" && <InputPaper label="Monthly EMI*" maxLength={15} leftIcon='cash-check' keyboardType="numeric" value={formData.monthlyEmi} onChangeText={(txt: any) => handleFormChange("monthlyEmi", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />}

                    <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={() => {
                        Alert.alert("Update Occupation Details", "Are you sure you want to update this?", [
                            { text: "No", onPress: () => null },
                            { text: "Yes", onPress: () => handleFormUpdate() },
                        ])
                    }} disabled={loading || !formData.selfOccupation || !formData.selfMonthlyIncome || !formData.purposeOfLoan || !formData.amountApplied || disableConditionExceptBasicDetails(approvalStatus, branchCode, flag) || formData.checkOtherOngoingLoan === "Y" && (!formData.otherLoanAmount || !formData.monthlyEmi)}
                        loading={loading}>UPDATE</ButtonPaper>

                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMOccupationDetailsForm

const styles = StyleSheet.create({})