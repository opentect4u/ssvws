import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Chip, Surface, Text } from "react-native-paper"
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

const RecoveryMemberForm = ({ fetchedData, approvalStatus = "U" }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LOGIN DATAAA =============", loginStore)
    console.log("4444444444444444444ffffffffffffffff", fetchedData)

    const [loading, setLoading] = useState(() => false)


    const [creditAmount, setCreditAmount] = useState(() => "")
    const [remainingTotalPrinciple, setRemainingTotalPrinciple] = useState(() => "")
    const [remainingTotalInterest, setRemainingTotalInterest] = useState(() => "")
    const [remainingTotalAmount, setRemainingTotalAmount] = useState(() => "")
    const [noOfInstallments, setNoOfInstallments] = useState(0);
    const [currentCreditAmtPrinciple, setCurrentCreditAmtPrinciple] = useState(() => "")
    const [currentCreditAmtInterest, setCurrentCreditAmtInterest] = useState(() => "")

    const [formData, setFormData] = useState({
        clientName: "",
        installmentEndDate: "",
        installmentPaid: "",
        installmentEMI: "",
        loanId: "",
        memberCode: "",
        totalPrinciple: "",
        totalInterest: "",
        rateOfInterest: "",
        period: "",
        periodMode: "",
        principleEMI: "",
        totalEMI: "",
    })

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    useEffect(() => {
        setFormData({
            clientName: fetchedData?.client_name || "",
            installmentEndDate: new Date(fetchedData?.instl_end_dt).toLocaleDateString() || "",
            installmentPaid: fetchedData?.instl_paid || "",
            installmentEMI: fetchedData?.intt_emi || "",
            loanId: fetchedData?.loan_id || "",
            memberCode: fetchedData?.member_code || "",
            totalPrinciple: fetchedData?.prn_amt || "",
            totalInterest: fetchedData?.intt_amt || "",
            rateOfInterest: fetchedData?.curr_roi || "",
            period: fetchedData?.period || "",
            periodMode: fetchedData?.period_mode || "",
            principleEMI: fetchedData?.prn_emi || "",
            totalEMI: fetchedData?.tot_emi || ""
        })
    }, [])

    // const remainingLoanCalculation = (creditAmt: number): void => {
    //     const totalInterest = parseFloat(formData.totalInterest) || 0;
    //     const totalPrinciple = parseFloat(formData.totalPrinciple) || 0;

    //     const updatedInterest = Math.max(totalInterest - creditAmt, 0);
    //     const remainingCredit = Math.max(creditAmt - totalInterest, 0);
    //     const updatedPrinciple = Math.max(totalPrinciple - remainingCredit, 0);
    //     const updatedTotalAmount = updatedInterest + updatedPrinciple;

    //     // Update states in a single call for efficiency
    //     setRemainingTotalPrinciple(updatedPrinciple.toString());
    //     setRemainingTotalInterest(updatedInterest.toString());
    //     setRemainingTotalAmount(updatedTotalAmount.toString());
    // };

    // const remainingLoanCalculation = (creditAmt: number) => {
    //     let remainingInterest = +formData.totalInterest;
    //     let remainingPrinciple = +formData.totalPrinciple;
    //     let updatedInterest: number;
    //     let updatedPrinciple: number;

    //     // Subtract creditAmt from totalInterest first
    //     if (creditAmt <= remainingInterest) {
    //         updatedInterest = remainingInterest - creditAmt;
    //         updatedPrinciple = remainingPrinciple;
    //     } else {
    //         // If creditAmt is greater than remaining interest, reduce principle with the remaining amount
    //         updatedInterest = 0;
    //         updatedPrinciple = remainingPrinciple - (creditAmt - remainingInterest);
    //     }

    //     // Calculate remaining total amount
    //     const updatedTotalAmount = updatedPrinciple + updatedInterest;

    //     // Update state with calculated values
    //     setRemainingTotalPrinciple(updatedPrinciple.toString());
    //     setRemainingTotalInterest(updatedInterest.toString());
    //     setRemainingTotalAmount(updatedTotalAmount.toString());
    // };

    const remainingLoanCalculation = (creditAmt: number) => {
        let remainingInterest = +formData.totalInterest;
        let remainingPrinciple = +formData.totalPrinciple;
        let roi = +formData.rateOfInterest;
        let updatedInterest: number;
        let updatedPrinciple: number;
        let updatedTotalAmount: number;

        let currentPrinciple = ((creditAmt / (roi + 100)) * 100);
        let currentInterest = creditAmt - currentPrinciple;

        updatedInterest = Math.round(remainingInterest - currentInterest);
        updatedPrinciple = Math.round(remainingPrinciple - currentPrinciple);

        updatedTotalAmount = updatedInterest + updatedPrinciple;

        // Update state with calculated values
        setCurrentCreditAmtPrinciple(currentPrinciple.toString());
        setCurrentCreditAmtInterest(currentInterest.toString());

        setRemainingTotalPrinciple(updatedPrinciple.toString());
        setRemainingTotalInterest(updatedInterest.toString());
        setRemainingTotalAmount(updatedTotalAmount.toString());
    };

    const countNoOfInstallments = (creditAmt: number) => {
        if (Math.trunc(creditAmt / +formData.totalEMI) === 0) {
            return 1
        }

        return Math.trunc(creditAmt / +formData.totalEMI)
    };

    useEffect(() => {
        if (formData.totalInterest && formData.totalPrinciple) {
            remainingLoanCalculation(+creditAmount);
            setNoOfInstallments(countNoOfInstallments(+creditAmount));
            console.log("NO OF INSTALLMENTS =", countNoOfInstallments(+creditAmount));
        }
    }, [creditAmount, formData.totalInterest, formData.totalPrinciple]);

    const sendRecoveryEMI = async () => {
        setLoading(true)

        // const creds = {
        //     instl_paid: noOfInstallments,
        //     modified_by: loginStore?.emp_id,
        //     loan_id: formData.loanId,
        //     branch_code: loginStore?.brn_code,
        //     credit: creditAmount,
        //     prn_recov: remainingTotalPrinciple,
        //     intt_recov: remainingTotalInterest,
        //     balance: "0", //! change in some time EEEEEEEERRRRRRRRRRRRR
        //     intt_balance: "0", //! change in some time EEEEEEEERRRRRRRRRRRRR
        //     // tr_type: "R",
        //     created_by: loginStore?.emp_id,
        // }

        const creds = {
            branch_code: loginStore?.brn_code,
            loan_id: fetchedData?.loan_id,
            credit: creditAmount,
            balance: fetchedData?.balance,
            intt_balance: fetchedData?.intt_balance,
            intt_emi: (+currentCreditAmtInterest)?.toFixed(2),
            prn_emi: (+currentCreditAmtPrinciple)?.toFixed(2),
            prn_recov: remainingTotalPrinciple,
            intt_recov: remainingTotalInterest,
            rem_outstanding: remainingTotalAmount,
            instl_paid: noOfInstallments,
            created_by: loginStore?.emp_id,
            modified_by: loginStore?.emp_id
        }

        console.log("PAYLOAD---RECOVERY", creds)
        await axios.post(ADDRESSES.LOAN_RECOVERY_EMI, creds).then(res => {
            ToastAndroid.show("Loan recovery EMI installment done.", ToastAndroid.SHORT)
            console.log("Loan recovery EMI installment done.", res?.data)

            navigation.goBack()
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
            console.log("Some error occurred while submitting EMI.", err)
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
                    <Text variant='labelLarge' style={{
                        marginBottom: 10,
                        color: theme.colors.primary
                    }}>Member Details</Text>

                    <InputPaper label="Member Code" leftIcon='numeric' keyboardType="number-pad" value={formData.memberCode} onChangeText={(txt: any) => handleFormChange("memberCode", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Member Name" leftIcon='account-circle-outline' keyboardType="default" value={formData.clientName} onChangeText={(txt: any) => handleFormChange("clientName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />


                    <Text variant='labelLarge' style={{
                        marginBottom: 10,
                        color: theme.colors.primary
                    }}>Loan Details</Text>

                    {/* <Divider /> */}

                    <InputPaper label="Loan ID" leftIcon='order-numeric-ascending' keyboardType="number-pad" value={formData.loanId} onChangeText={(txt: any) => handleFormChange("loanId", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total Principle" leftIcon='cash-multiple' keyboardType="number-pad" value={formData.totalPrinciple} onChangeText={(txt: any) => handleFormChange("totalPrinciple", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total Interest" leftIcon='cash-plus' keyboardType="number-pad" value={formData.totalInterest} onChangeText={(txt: any) => handleFormChange("totalInterest", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Net Total (Rs.)" leftIcon='cash-fast' keyboardType="number-pad" value={+formData.totalInterest + +formData.totalPrinciple} onChangeText={() => null} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Period" leftIcon='clock-time-five-outline' keyboardType="number-pad" value={formData.period} onChangeText={(txt: any) => handleFormChange("period", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Period Mode" leftIcon='camera-timer' keyboardType="default" value={formData.periodMode} onChangeText={(txt: any) => handleFormChange("periodMode", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    {/* <Divider /> */}

                    <Text variant='labelLarge' style={{
                        marginBottom: 10,
                        color: theme.colors.primary
                    }}>Installment Details</Text>

                    <InputPaper label="Installment End Date" leftIcon='calendar-month-outline' keyboardType="default" value={formData.installmentEndDate} onChangeText={(txt: any) => handleFormChange("installmentEndDate", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Installment Paid" leftIcon='cash-check' keyboardType="number-pad" value={formData.installmentPaid} onChangeText={(txt: any) => handleFormChange("installmentPaid", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Principle EMI" leftIcon='cash-lock' keyboardType="number-pad" value={formData.principleEMI} onChangeText={(txt: any) => handleFormChange("principleEMI", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Interst EMI" leftIcon='cash-plus' keyboardType="number-pad" value={formData.installmentEMI} onChangeText={(txt: any) => handleFormChange("installmentEMI", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total EMI" leftIcon='account-cash-outline' keyboardType="number-pad" value={formData.totalEMI} onChangeText={(txt: any) => handleFormChange("totalEMI", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <Divider />

                    <InputPaper
                        label="Credit Amount"
                        leftIcon='cash-check'
                        keyboardType="decimal-pad"
                        value={creditAmount}
                        onChangeText={(txt: string) => {
                            const numericValue = txt.replace(/[^0-9.]/g, '');
                            const validValue = numericValue.split('.').length > 2
                                ? numericValue.slice(0, numericValue.lastIndexOf('.'))
                                : numericValue;
                            setCreditAmount(validValue);
                        }}
                        customStyle={{
                            backgroundColor: theme.colors.background,
                        }}
                        selectTextOnFocus
                    />

                    {creditAmount && (
                        <Surface style={{
                            padding: 10,
                            margin: 5,
                            borderRadius: 15,
                        }} elevation={1}>
                            <Text variant='titleLarge' style={{
                                color: theme.colors.primary,
                                marginBottom: 5
                            }}>Remaining Amounts</Text>
                            <Divider />
                            <View style={styles.surfaceTextSpace}>
                                <Text variant='bodyLarge' style={{
                                    marginTop: 5
                                }}>Total Principle</Text>
                                <Text variant='bodyLarge' style={{
                                    color: theme.colors.tertiary
                                }}>{remainingTotalPrinciple}/-</Text>
                            </View>

                            <View style={styles.surfaceTextSpace}>
                                <Text variant='bodyLarge' style={{
                                    marginTop: 5
                                }}>Total Interest</Text>
                                <Text variant='bodyLarge' style={{
                                    color: theme.colors.tertiary
                                }}>{remainingTotalInterest}/-</Text>
                            </View>

                            <View style={styles.surfaceTextSpace}>
                                <Text variant='bodyLarge' style={{
                                    marginTop: 5
                                }}>Total Outstanding</Text>
                                <Text variant='bodyLarge' style={{
                                    color: theme.colors.tertiary
                                }}>{remainingTotalAmount}/-</Text>
                            </View>
                        </Surface>
                    )
                    }

                    <View style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="cash-register" mode="contained" onPress={() => {
                            Alert.alert(`Collect EMI Amount ${creditAmount}/-?`, `Are you sure, you want to credit this EMI for ${formData.clientName}?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: async () => await sendRecoveryEMI(),
                                text: "Yes"
                            }])

                        }} loading={loading} disabled={!+creditAmount || +remainingTotalAmount < 0}>
                            Collect Amount
                        </ButtonPaper>
                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default RecoveryMemberForm

const styles = StyleSheet.create({
    surfaceTextSpace: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
})