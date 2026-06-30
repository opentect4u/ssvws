import { SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, List, RadioButton, Text } from 'react-native-paper'
import MenuPaper from '../../components/MenuPaper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'

const BMOccupationDetailsForm = () => {
    const theme = usePaperColorScheme()

    const [loading, setLoading] = useState(() => false)

    const [selfOccupation, setSelfOccupation] = useState(() => "")
    const [selfMonthlyIncome, setSelfMonthlyIncome] = useState(() => "")
    const [spouseOccupation, setSpouseOccupation] = useState(() => "")
    const [spouseMonthlyIncome, setSpouseMonthlyIncome] = useState(() => "")
    const [purposesOfLoan, setPurposesOfLoan] = useState(() => [])
    const [purposeOfLoan, setPurposeOfLoan] = useState(() => "")
    const [purposeOfLoanName, setPurposeOfLoanName] = useState(() => "")
    const [subPurposesOfLoan, setSubPurposesOfLoan] = useState(() => [])
    const [subPurposeOfLoan, setSubPurposeOfLoan] = useState(() => "")
    const [subPurposeOfLoanName, setSubPurposeOfLoanName] = useState(() => "")
    const [amountApplied, setAmountApplied] = useState(() => "")
    const [checkOtherOngoingLoan, setCheckOtherOngoingLoan] = useState(() => 'yes')
    const [otherLoanAmount, setOtherLoanAmount] = useState(() => "")
    const [monthlyEmi, setMonthlyEmi] = useState(() => "")

    // useEffect(() => {
    //     setPurposesOfLoan([]);
    //     setSubPurposesOfLoan([]);

    //     [{ purpose: "Some Reason 1", value: "1" }, { purpose: "Some Reason 2", value: "2" }]?.map((item, i) => (
    //         //@ts-ignore
    //         setPurposesOfLoan(prev => [...prev, { title: item?.purpose, func: () => setPurposeOfLoan(item?.value) }])
    //     ));

    //     [{ purpose: "Some Sub Reason 1", value: "1" }, { purpose: "Some Sub Reason 2", value: "2" }]?.map((item, i) => (
    //         //@ts-ignore
    //         setSubPurposesOfLoan(prev => [...prev, { title: item?.purpose, func: () => setSubPurposeOfLoan(item?.value) }])
    //     ));

    // }, [])

    const fetchPurposeOfLoan = async () => {
        setPurposesOfLoan([]);
        setLoading(true)
        await axios.get(`${ADDRESSES.FETCH_PURPOSE_OF_LOAN}`).then(res => {
            // purp_id
            if (res?.data?.suc === 1) {
                res?.data?.msg?.map((item, _) => (
                    setPurposesOfLoan(prev => [...prev, { title: item?.purpose_id, func: () => { setPurposeOfLoan(item?.purp_id); setPurposeOfLoanName(item?.purpose_id) } }])
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
        await axios.get(`${ADDRESSES.FETCH_SUB_PURPOSE_OF_LOAN}?purp_id=${purposeOfLoan}`).then(res => {
            if (res?.data?.suc === 1) {
                res?.data?.msg?.map((item, _) => (
                    setSubPurposesOfLoan(prev => [...prev, { title: item?.sub_purp_name, func: () => { setSubPurposeOfLoan(item?.sub_purp_id); setSubPurposeOfLoanName(item?.sub_purp_name) } }])
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
    }, [purposeOfLoan])

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

                    <InputPaper label="Self Occupation" maxLength={50} leftIcon='bag-personal-outline' keyboardType="default" value={selfOccupation} onChangeText={(txt: any) => setSelfOccupation(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Self Monthly Income" maxLength={15} leftIcon='account-cash-outline' keyboardType="numeric" value={selfMonthlyIncome} onChangeText={(txt: any) => setSelfMonthlyIncome(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Spouse Occupation" maxLength={50} leftIcon='bag-personal-outline' keyboardType="default" value={spouseOccupation} onChangeText={(txt: any) => setSpouseOccupation(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Spouse Monthly Income" maxLength={15} leftIcon='account-cash-outline' keyboardType="numeric" value={spouseMonthlyIncome} onChangeText={(txt: any) => setSpouseMonthlyIncome(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    {/* <InputPaper label="Purpose of Loan" multiline leftIcon='form-textbox' value={purposeOfLoan} onChangeText={(txt: any) => setPurposeOfLoan(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} /> */}
                    <List.Item
                        title="Purpose of Loan"
                        description={`Purpose: ${purposeOfLoanName}`}
                        left={props => <List.Icon {...props} icon="progress-question" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={purposesOfLoan} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <List.Item
                        title="Sub Purpose"
                        description={`Purpose: ${subPurposeOfLoanName}`}
                        left={props => <List.Icon {...props} icon="file-question-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={subPurposesOfLoan} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <InputPaper label="Amount Applied" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={amountApplied} onChangeText={(txt: any) => setAmountApplied(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <RadioComp
                        title="Other Loans?"
                        icon="cash-multiple"
                        dataArray={[
                            {
                                optionName: "YES",
                                optionState: checkOtherOngoingLoan,
                                currentState: "yes",
                                optionSetStateDispathFun: setCheckOtherOngoingLoan
                            },
                            {
                                optionName: "NO",
                                optionState: checkOtherOngoingLoan,
                                currentState: "no",
                                optionSetStateDispathFun: setCheckOtherOngoingLoan
                            },
                        ]}
                    />

                    {checkOtherOngoingLoan === "yes" && <InputPaper label="Other Loan Amount" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={otherLoanAmount} onChangeText={(txt: any) => setOtherLoanAmount(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />}

                    <InputPaper label="Monthly EMI" maxLength={15} leftIcon='cash-check' keyboardType="numeric" value={monthlyEmi} onChangeText={(txt: any) => setMonthlyEmi(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMOccupationDetailsForm

const styles = StyleSheet.create({})