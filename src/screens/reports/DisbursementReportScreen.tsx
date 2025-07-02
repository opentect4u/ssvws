import { StyleSheet, SafeAreaView, View, ScrollView, TextStyle, ViewStyle } from 'react-native'
import { DataTable, Text } from "react-native-paper"
import React, { useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import HeadingComp from "../../components/HeadingComp"
import CollectionButtonsWrapper from "../../components/CollectionButtonsWrapper"
import CollectionButton from "../../components/CollectionButton"
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
import { loginStorage } from '../../storage/appStorage'
import ButtonPaper from '../../components/ButtonPaper'
import SurfacePaper from '../../components/SurfacePaper'
import DatePicker from 'react-native-date-picker'
import { formattedDate } from '../../utils/dateFormatter'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import RadioComp from '../../components/RadioComp'

const DisbursementReportScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [isLoading, setIsLoading] = useState(() => false)
    const [isDisabled, setIsDisabled] = useState(() => false)

    const [fromDate, setFromDate] = useState(() => new Date())
    const [toDate, setToDate] = useState(() => new Date())
    const [openFromDate, setOpenFromDate] = useState(() => false)
    const [openToDate, setOpenToDate] = useState(() => false)

    const formattedFromDate = formattedDate(fromDate)
    const formattedToDate = formattedDate(toDate)

    // const [checkUser, setCheckUser] = useState(() => "O")
    const [txnMode, setTxnMode] = useState(() => "C")

    const [reportData, setReportData] = useState(() => [])

    const titleTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer
    }

    const titleStyle: ViewStyle = {
        backgroundColor: theme.colors.primaryContainer
    }

    const fetchDisbursementReport = async () => {
        setIsLoading(true)
        setIsDisabled(true)
        const creds = {
            "from_dt": formattedFromDate,
            "to_dt": formattedToDate,
            "tr_mode": txnMode,
            "emp_id": loginStore?.emp_id,
        }
        await axios.post(`${ADDRESSES.MEMBERWISE_DISBURSEMENT_REPORT}`, creds).then(res => {
            console.log(">>>>>>", res?.data)
            setReportData(res?.data?.msg)
        }).catch(err => {
            console.log("<<<<<<", err)
        })
        setIsLoading(false)
        setIsDisabled(false)
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Disbursement Report" subtitle="View disbursement report" isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    gap: 10
                }}>
                    <View style={{
                        backgroundColor: theme.colors.onSecondary,
                        gap: 10,
                        padding: 10,
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20
                    }}>
                        <View>
                            <RadioComp
                                title={txnMode === "B" ? `Mode Bank` : `Mode Cash`}
                                titleColor={theme.colors.tertiary}
                                color={theme.colors.tertiary}
                                radioButtonColor={theme.colors.tertiary}
                                icon={txnMode === "C" ? "cash" : "bank"}
                                dataArray={[
                                    {
                                        optionName: "CASH",
                                        optionState: txnMode,
                                        currentState: "C", // bm emp_id -> 
                                        optionSetStateDispathFun: (e) => setTxnMode(e)
                                    },
                                    {
                                        optionName: "BANK",
                                        optionState: txnMode,
                                        currentState: "B", // emp_id -> 0
                                        optionSetStateDispathFun: (e) => setTxnMode(e)
                                    },
                                ]}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingHorizontal: 15,
                                alignItems: "center",
                                backgroundColor: theme.colors.tertiaryContainer,
                                padding: 2,
                                borderRadius: 12
                            }}>
                            <ButtonPaper
                                textColor={theme.colors.onTertiaryContainer}
                                onPress={() => setOpenFromDate(true)}
                                mode="text">
                                FROM: {fromDate?.toLocaleDateString("en-GB")}
                            </ButtonPaper>
                            <ButtonPaper
                                textColor={theme.colors.onTertiaryContainer}
                                onPress={() => setOpenToDate(true)}
                                mode="text">
                                TO: {toDate?.toLocaleDateString("en-GB")}
                            </ButtonPaper>

                            <DatePicker
                                modal
                                mode="date"
                                // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
                                open={openFromDate}
                                date={fromDate}
                                onConfirm={date => {
                                    setOpenFromDate(false)
                                    setFromDate(date)
                                }}
                                onCancel={() => {
                                    setOpenFromDate(false)
                                }}
                            />
                            <DatePicker
                                modal
                                mode="date"
                                open={openToDate}
                                date={toDate}
                                onConfirm={date => {
                                    setOpenToDate(false)
                                    setToDate(date)
                                }}
                                onCancel={() => {
                                    setOpenToDate(false)
                                }}
                            />
                        </View>

                        <View>
                            <ButtonPaper
                                onPress={() => fetchDisbursementReport()}
                                mode="contained-tonal"
                                buttonColor={theme.colors.secondaryContainer}
                                textColor={theme.colors.onSecondaryContainer}
                                loading={isLoading}
                                disabled={isDisabled}
                            >
                                SUBMIT
                            </ButtonPaper>
                        </View>
                    </View>

                    <View>
                        <SurfacePaper backgroundColor={theme.colors.surface}>
                            {/* <ScrollView horizontal> */}
                            <DataTable>
                                <DataTable.Header style={titleStyle}>
                                    <DataTable.Title textStyle={titleTextStyle}>Sl. No.</DataTable.Title>
                                    <DataTable.Title textStyle={titleTextStyle}>Group</DataTable.Title>
                                    <DataTable.Title textStyle={titleTextStyle}>Member</DataTable.Title>
                                    <DataTable.Title textStyle={titleTextStyle} numeric>Debit</DataTable.Title>
                                </DataTable.Header>

                                {reportData?.map((item, index) => {
                                    return (
                                        <DataTable.Row key={index}>
                                            <DataTable.Cell>
                                                {index + 1}
                                            </DataTable.Cell>
                                            <DataTable.Cell>
                                                {item?.group_name
                                                    ?.toString()
                                                }
                                            </DataTable.Cell>
                                            <DataTable.Cell>
                                                {item?.client_name
                                                    ?.toString()
                                                }
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {item?.debit}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    )
                                })}
                            </DataTable>
                            {/* </ScrollView> */}
                            {/* <View style={{ padding: normalize(10) }}>
                                <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                                    TOTAL NET: {212112?.toFixed(2)}  CANCELLED: ₹{12021?.toFixed(2)}
                                </Text>
                            </View> */}
                        </SurfacePaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DisbursementReportScreen

const styles = StyleSheet.create({})