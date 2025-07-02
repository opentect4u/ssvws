import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, List } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import ButtonPaper from '../../components/ButtonPaper'
import { loginStorage } from '../../storage/appStorage'
import { disableConditionExceptBasicDetails } from '../../utils/disableCondition'
import { SCREEN_WIDTH } from 'react-native-normalize'

interface BMOccupationDetailsFormProps {
    formNumber?: any
    branchCode?: any
    flag?: "CO" | "BM"
    approvalStatus?: "U" | "A" | "S"
    onSubmit?: any
    onUpdateDisabledChange?: (disabled: boolean) => void
}

var appliedDefaultAmt = 50000

const BMOccupationDetailsForm = forwardRef(({
    formNumber,
    branchCode,
    flag = "BM",
    approvalStatus = "U",
    onSubmit = () => null,
    onUpdateDisabledChange = () => { }
}: BMOccupationDetailsFormProps, ref) => {
    const theme = usePaperColorScheme()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(false)
    const [purposesOfLoan, setPurposesOfLoan] = useState([])
    // const [subPurposesOfLoan, setSubPurposesOfLoan] = useState([])
    const [defaultAmt, setDefaultAmt] = useState('')

    const [formData, setFormData] = useState({
        selfOccupation: "",
        selfMonthlyIncome: "",
        spouseOccupation: "",
        spouseMonthlyIncome: "",
        purposeOfLoan: "",
        purposeOfLoanName: "",
        // subPurposeOfLoan: "",
        subPurposeOfLoanName: "",
        amountApplied: defaultAmt.length > 0 ? defaultAmt : appliedDefaultAmt,
        checkOtherOngoingLoan: "N",
        otherLoanAmount: "",
        monthlyEmi: "",
    })

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const fetchOccupationDetails = async () => {
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_OCCUPATION_DETAILS}?form_no=${formNumber}&branch_code=${branchCode}`)
            .then(res => {
                if (res?.data?.msg?.length === 0) {
                    ToastAndroid.show("No data found!", ToastAndroid.SHORT)
                    return
                }
                if (res?.data?.suc === 1) {
                    setFormData({
                        selfOccupation: res?.data?.msg[0]?.self_occu || "",
                        selfMonthlyIncome: res?.data?.msg[0]?.self_income || "",
                        spouseOccupation: res?.data?.msg[0]?.spouse_occu || "",
                        spouseMonthlyIncome: res?.data?.msg[0]?.spouse_income || "",
                        purposeOfLoan: res?.data?.msg[0]?.loan_purpose || "",
                        purposeOfLoanName: res?.data?.msg[0]?.purpose_id || "",
                        // subPurposeOfLoan: res?.data?.msg[0]?.sub_pupose || "",
                        subPurposeOfLoanName: res?.data?.msg[0]?.sub_purp_name || "",
                        amountApplied: res?.data?.msg[0]?.applied_amt || "",
                        checkOtherOngoingLoan: res?.data?.msg[0]?.other_loan_flag || "",
                        otherLoanAmount: res?.data?.msg[0]?.other_loan_amt || "",
                        monthlyEmi: res?.data?.msg[0]?.other_loan_emi || "",
                    })
                    setDefaultAmt(res?.data?.msg[0]?.applied_amt)
                }
            }).catch(err => {
                ToastAndroid.show("Error fetching occupation details!", ToastAndroid.SHORT)
            })
        setLoading(false)
    }

    useEffect(() => {
        fetchOccupationDetails()
    }, [])

    const fetchPurposeOfLoan = async () => {
        setPurposesOfLoan([])
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_PURPOSE_OF_LOAN}`)
            .then(res => {
                console.log("FETCH_PURPOSE_OF_LOAN", res?.data)
                if (res?.data?.suc === 1) {
                    res?.data?.msg?.forEach((item) => {
                        setPurposesOfLoan(prev => [
                            ...prev,
                            {
                                title: item?.purpose_id,
                                func: () => {
                                    handleFormChange("purposeOfLoan", item?.purp_id)
                                    handleFormChange("purposeOfLoanName", item?.purpose_id)
                                }
                            }
                        ])
                    })
                }
            }).catch(err => {
                ToastAndroid.show("Error fetching Purposes of Loan!", ToastAndroid.SHORT)
            })
        setLoading(false)
    }

    // const fetchSubPurposeOfLoan = async () => {
    //     setSubPurposesOfLoan([])
    //     setLoading(true)
    //     await axios.get(`${ADDRESSES.FETCH_SUB_PURPOSE_OF_LOAN}?purp_id=${formData.purposeOfLoan}`)
    //         .then(res => {
    //             if (res?.data?.suc === 1) {
    //                 res?.data?.msg?.forEach((item) => {
    //                     setSubPurposesOfLoan(prev => [
    //                         ...prev,
    //                         {
    //                             title: item?.sub_purp_name,
    //                             func: () => {
    //                                 handleFormChange("subPurposeOfLoan", item?.sub_purp_id)
    //                                 handleFormChange("subPurposeOfLoanName", item?.sub_purp_name)
    //                             }
    //                         }
    //                     ])
    //                 })
    //             }
    //         }).catch(err => {
    //             ToastAndroid.show("Error fetching Sub Purposes of Loan!", ToastAndroid.SHORT)
    //         })
    //     setLoading(false)
    // }

    useEffect(() => {
        fetchPurposeOfLoan()
    }, [])

    // useEffect(() => {
    //     fetchSubPurposeOfLoan()
    // }, [formData.purposeOfLoan])

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
            // sub_pupose: formData.subPurposeOfLoan,
            applied_amt: formData.amountApplied,
            other_loan_flag: formData.checkOtherOngoingLoan,
            other_loan_amt: formData.otherLoanAmount,
            other_loan_emi: formData.monthlyEmi,
            modified_by: loginStore?.emp_id,
            created_by: loginStore?.emp_id,
        }
        await axios.post(`${ADDRESSES.SAVE_OCCUPATION_DETAILS}`, creds)
            .then(res => {
                if (res?.data?.suc === 1) {
                    ToastAndroid.show("Occupation details saved.", ToastAndroid.SHORT)
                    onSubmit()
                }
            }).catch(err => {
                ToastAndroid.show("Error saving occupation details!", ToastAndroid.SHORT)
            })
        setLoading(false)
    }

    // Compute the disabled condition exactly as used for the UPDATE button.
    const updateDisabled =
        loading ||
        !formData.selfOccupation ||
        !formData.selfMonthlyIncome ||
        !formData.purposeOfLoan ||
        !formData.amountApplied ||
        disableConditionExceptBasicDetails(approvalStatus, branchCode, flag) ||
        (formData.checkOtherOngoingLoan === "Y" && (!formData.otherLoanAmount || !formData.monthlyEmi));

    // Inform parent about the current disabled state.
    useEffect(() => {
        onUpdateDisabledChange(updateDisabled)
    }, [updateDisabled, onUpdateDisabledChange])

    // This function is triggered when NEXT is pressed on BMPendingLoanFormScreen.
    // Here we assume that if updateDisabled is false, we want to show the confirmation alert.
    const triggerUpdateButton = () => {
        if (updateDisabled) {
            // Should not happen because parent's NEXT would be disabled.
            return;
        }
        Alert.alert("Update Occupation Details", "Are you sure you want to update this?", [
            { text: "No", onPress: () => null },
            { text: "Yes", onPress: () => handleFormUpdate() },
        ])
    }

    // Expose the triggerUpdateButton function via ref.
    useImperativeHandle(ref, () => ({
        updateAndNext: triggerUpdateButton
    }))

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: theme.colors.background }}>
                <View style={{ paddingTop: 10, gap: 10 }}>
                    <Divider />
                    <InputPaper
                        label="Self Occupation*"
                        maxLength={50}
                        leftIcon='bag-personal-outline'
                        keyboardType="default"
                        value={formData.selfOccupation}
                        onChangeText={(txt) => handleFormChange("selfOccupation", txt)}
                        customStyle={{ backgroundColor: theme.colors.background }}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <InputPaper
                        label="Self Monthly Income*"
                        maxLength={15}
                        leftIcon='account-cash-outline'
                        keyboardType="numeric"
                        value={formData.selfMonthlyIncome}
                        onChangeText={(txt) => handleFormChange("selfMonthlyIncome", txt)}
                        customStyle={{ backgroundColor: theme.colors.background }}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <InputPaper
                        label="Spouse Occupation"
                        maxLength={50}
                        leftIcon='bag-personal-outline'
                        keyboardType="default"
                        value={formData.spouseOccupation}
                        onChangeText={(txt) => handleFormChange("spouseOccupation", txt)}
                        customStyle={{ backgroundColor: theme.colors.background }}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <InputPaper
                        label="Spouse Monthly Income"
                        maxLength={15}
                        leftIcon='account-cash-outline'
                        keyboardType="numeric"
                        value={formData.spouseMonthlyIncome}
                        onChangeText={(txt) => handleFormChange("spouseMonthlyIncome", txt)}
                        customStyle={{ backgroundColor: theme.colors.background }}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
                    <List.Item
                        title="Purpose of Loan*"
                        description={`Purpose: ${formData.purposeOfLoanName}`}
                        left={props => <List.Icon {...props} icon="progress-question" />}
                        right={props =>
                            <MenuPaper menuArrOfObjects={purposesOfLoan} disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)} />
                        }
                        descriptionStyle={{ color: theme.colors.tertiary }}
                    />
                    {/* <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={[styles.placeholderStyle, { color: theme.colors.onBackground }]}
                        selectedTextStyle={[styles.selectedTextStyle, { color: theme.colors.primary }]}
                        inputSearchStyle={[styles.inputSearchStyle, { borderRadius: 10 }]}
                        containerStyle={{
                            width: SCREEN_WIDTH / 1.1,
                            alignSelf: "center",
                            borderRadius: 10
                        }}
                        iconStyle={styles.iconStyle}
                        data={purposesOfLoan}
                        search
                        maxHeight={300}
                        labelField="purpose_id"
                        valueField="purp_id"
                        placeholder="Select Purpose*"
                        searchPlaceholder="Search Purpose..."
                        value={formData.purposeOfLoanName}
                        onChange={item => {
                            console.log("jjj")
                            console.log("??????????????????????", item)
                            // setValue(item.value);
                            handleFormChange("groupCode", item?.value);
                            // handleFormChange("groupCodeName", item?.label);
                        }}
                        renderLeftIcon={() => (
                            <Icon size={25} source={"account-group-outline"} />
                        )}
                    /> */}
                    <InputPaper
                        label="Amount Applied*"
                        maxLength={15}
                        leftIcon='cash-100'
                        keyboardType="numeric"
                        value={formData.amountApplied}
                        onChangeText={(txt) => handleFormChange("amountApplied", txt)}
                        customStyle={{
                            backgroundColor: theme.colors.tertiaryContainer,
                            borderColor: formData.amountApplied ? "green" : "red",
                        }}
                        disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                    />
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
                    {formData.checkOtherOngoingLoan === "Y" && (
                        <InputPaper
                            label="Other Loan Amount*"
                            maxLength={15}
                            leftIcon='cash-100'
                            keyboardType="numeric"
                            value={formData.otherLoanAmount}
                            onChangeText={(txt) => handleFormChange("otherLoanAmount", txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                            disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                        />
                    )}
                    {formData.checkOtherOngoingLoan === "Y" && (
                        <InputPaper
                            label="Monthly EMI*"
                            maxLength={15}
                            leftIcon='cash-check'
                            keyboardType="numeric"
                            value={formData.monthlyEmi}
                            onChangeText={(txt) => handleFormChange("monthlyEmi", txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                            disabled={disableConditionExceptBasicDetails(approvalStatus, branchCode, flag)}
                        />
                    )}
                    {/* The existing UPDATE button remains for manual updates */}
                    {/* <ButtonPaper
                        mode='text'
                        icon="cloud-upload-outline"
                        onPress={triggerUpdateButton}
                        disabled={updateDisabled}
                        loading={loading}
                    >
                        UPDATE
                    </ButtonPaper> */}
                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
})

export default BMOccupationDetailsForm

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 30,
        width: SCREEN_WIDTH,
        alignSelf: "center",
        paddingHorizontal: 35,
        borderRadius: 10
    },
    // icon: {
    //     marginLeft: -150,
    // },
    placeholderStyle: {
        fontSize: 16,
        marginLeft: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})
