import { StyleSheet, SafeAreaView, View, ScrollView} from 'react-native'
import { DataTable, MD2Colors, MD2DarkTheme, MD2LightTheme, MD3LightTheme, Text } from "react-native-paper"
import React, { useEffect, useState } from 'react'
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
import RadioComp from '../../components/RadioComp'
import { formattedDate } from '../../utils/dateFormatter'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'

function GroupwiseRecovery() {
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
    const [tot_credit,setTotCredit] = useState(()=>0)

    const [checkUser, setCheckUser] = useState(() => "O")
    const [txnMode, setTxnMode] = useState(() => "C")

    const [reportData, setReportData] = useState(() => [])

    const titleTextStyle = {
        color: theme.colors.onPrimaryContainer
    }

    const titleStyle = {
        backgroundColor: theme.colors.primaryContainer,
    }
    const colStyle = {
    paddingHorizontal:25,width:10
    }
    


    const fetchRecoveryReport = async () => {
        setIsLoading(true)
        setIsDisabled(true)
        const creds = {
            "user_id": loginStore?.id,
            "from_dt": formattedFromDate,
            "to_dt": formattedToDate,
            "tr_mode": txnMode,
            "emp_id": loginStore?.emp_id,
            "flag": checkUser,
            "branch_code": loginStore?.brn_code,
        }
        await axios.post(`${ADDRESSES.GROUPWISERECOVERYREPORT}`, creds).then(res => {
            console.log(">>>>>>", res?.data)
            setReportData(res?.data?.msg)
            setTotCredit(res?.data?.msg.reduce((n, {credit}) => n + credit, 0))
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
                <HeadingComp title="Groupwise Recovery Report" subtitle="View recovery report" isBackEnabled />
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
                        {/* {loginStore?.id === 2 && 
                        <View>
                            <RadioComp
                                title={checkUser === "O" ? `Your Data` : `All User`}
                                titleColor={theme.colors.primary}
                                color={theme.colors.primary}
                                radioButtonColor={theme.colors.primary}
                                icon="account-convert-outline"
                                dataArray={[
                                    {
                                        optionName: "OWN",
                                        optionState: checkUser,
                                        currentState: "O", // bm emp_id -> 
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                    {
                                        optionName: "ALL",
                                        optionState: checkUser,
                                        currentState: "A", // emp_id -> 0
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                ]}
                            />
                        </View>}*/}

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
                                backgroundColor: theme.colors.tertiary,
                                padding: 2,
                                borderRadius: 12
                            }}>
                            <ButtonPaper
                                textColor={theme.colors.onTertiary}
                                onPress={() => setOpenFromDate(true)}
                                mode="text">
                                FROM: {fromDate?.toLocaleDateString("en-GB")}
                            </ButtonPaper>
                            <ButtonPaper
                                textColor={theme.colors.onTertiary}
                                onPress={() => setOpenToDate(true)}
                                mode="text">
                                TO: {toDate?.toLocaleDateString("en-GB")}
                            </ButtonPaper>

                            <DatePicker
                                modal
                                mode="date"
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
                                onPress={() => fetchRecoveryReport()}
                                mode="contained-tonal"
                                buttonColor={theme.colors.secondary}
                                textColor={theme.colors.onSecondary}
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
                                    {/* <DataTable.Title textStyle={titleTextStyle}>Member</DataTable.Title> */}
                                    <DataTable.Title textStyle={titleTextStyle} numeric>Credit</DataTable.Title>
                                    <DataTable.Title textStyle={titleTextStyle} numeric>Balance</DataTable.Title>
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
                                            {/* <DataTable.Cell>
                                                {item?.client_name
                                                    ?.toString()
                                                }
                                            </DataTable.Cell> */}
                                            <DataTable.Cell numeric>
                                                {item?.credit}/-
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {item?.balance}/-
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    )
                                })}
                            </DataTable>
                            {/* </ScrollView> */}
                            <View style={{ padding: normalize(10) }}>
                                <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                                    TOTAL CREDIT: {tot_credit?.toFixed(2)}/- 
                                </Text>
                            </View>
                        </SurfacePaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GroupwiseRecovery

const styles = StyleSheet.create({})