import React, { useEffect, useState } from 'react';
import { usePaperColorScheme } from '../../theme/theme';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { loginStorage } from '../../storage/appStorage';
import { Alert, SafeAreaView, TextStyle, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native';
import HeadingComp from '../../components/HeadingComp';
import { View } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize';
import DatePicker from 'react-native-date-picker';
import { Button, DataTable, MD2Colors, RadioButton, Text, TextInput } from 'react-native-paper';
import ButtonPaper from '../../components/ButtonPaper';
import CollectionButton from '../../components/CollectionButton';
import navigationRoutes from '../../routes/routes';
import CollectionButtonsWrapper from '../../components/CollectionButtonsWrapper';
import axios from 'axios';
import { ADDRESSES } from '../../config/api_list';
import { formattedDate } from '../../utils/dateFormatter';
import SurfacePaper from '../../components/SurfacePaper';

import MonthPicker from "react-native-month-year-picker";
import moment from "moment";
import InputPaper from '../../components/InputPaper';
import { Dropdown } from 'react-native-element-dropdown';

const paymentOption = [
    {
        label: "All",
        value: "A",
    },
    {
        label: "Cash",
        value: "C",
    },
    {
        label: "UPI",
        value: "B",
    }
]



function PaymentStatusReport() {
    const theme = usePaperColorScheme();
    const navigation = useNavigation();
    const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '');
    const [isLoading, setIsLoading] = useState(() => false);
    const [isDisabled, setIsDisabled] = useState(() => true);
    
    const [reportData, setReportData] = useState(() => [])

    const [openFromDate, setOpenFromDate] = useState(() => false);
    const [fromDate, setFromDate] = useState(() => new Date());

    const [openToDate, setOpenToDate] = useState(() => false);
    const [toDate, setToDate] = useState(() => new Date());

    const [group_code, setGroupCode] = useState([])

    const [date, setDate] = useState(null);
    const [show, setShow] = useState(false);
    const isFocused = useIsFocused()

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);

    // const [FromDay, setFromDay] = useState('');
    // const [ToDay, setToDay] = useState('');
    // const [weekOfRecovery, setWeekOfRecovery] = useState("")

    const from = page * numberOfItemsPerPage;
    // const to = Math.min((page + 1) * numberOfItemsPerPage, reportData.length);



    const [PaymentStatusValue, setPaymentStatusValue] = useState(() => "A")
    const [searchGroupName, setSearchGroupName] = useState("");

    const onChange2 = (e) => {
        console.log("radio1 checked", e)
        setPaymentStatusValue(e)
        // setFromDay("")
        // setToDay("")
        // setFromTouched(false)
        // setToTouched(false)
    }


    const titleTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer, fontSize: 12,

        justifyContent: "flex-start",
        paddingHorizontal: 11,
        minWidth: 130,

        textAlign: "left",
        // width: "100%",
    }



    const SLTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer, fontSize: 12,

        justifyContent: "flex-start",
        paddingHorizontal: 11,
        minWidth: 30,

        textAlign: "left",
        // width: "100%",
    }

    const titleStyle: ViewStyle = {
        backgroundColor: theme.colors.primaryContainer
    }




    useEffect(() => {
        setReportData([]);
    }, [isFocused])

    useEffect(() => {
        setPage(0);
    }, [numberOfItemsPerPage]);


    useEffect(() => {

        setReportData([]);

    }, [PaymentStatusValue, fromDate, toDate]);



    const getDemandReportData_CO = async () => {
        setReportData([])
        const creds = {
            branch_code: loginStore?.brn_code,
            co_id: loginStore?.emp_id,
            from_dt: moment(fromDate).format("YYYY-MM-DD"),
            to_dt: moment(toDate).format("YYYY-MM-DD"),
            tr_mode:PaymentStatusValue
            
        }

        await axios.post(`${ADDRESSES.PAYMENTREPORT_CO}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {

            console.log(res?.data?.coll_data_cowise?.msg, 'gggggggggggggg', creds);
            
            const apiData = res?.data?.coll_data_cowise?.msg || [];

            const formattedData = apiData.map((item, index) => ({
                id: index + 1,
                // group_name: item.group_name,
                // client_name: item.client_name,
                // dmd_amt: item.dmd_amt,
                // period_mode: item.period_mode,
                // recovery_day: item.recovery_day,
                // week_no: item.week_no,

                bank_branch_name: item.bank_branch_name,
                bank_name: item.bank_name,
                client_name: item.client_name,
                credit: item.credit,
                curr_balance: item.curr_balance,
                group_code: item.group_code,
                group_name: item.group_name,
                intt_recov: item.intt_recov,
                loan_account: item.loan_account,
                member_code: item.member_code,
                prn_recov: item.prn_recov,
                sb_account: item.sb_account,
                scheme_id: item.scheme_id,
                scheme_name: item.scheme_name,
                tr_mode: item.tr_mode,

                

            }));

            setReportData(formattedData);

        })
    }

    const getDemandReportData_BM = async () => {
        setReportData([])
        const creds = {
            branch_code: loginStore?.brn_code,
            from_dt: moment(fromDate).format("YYYY-MM-DD"),
            to_dt: moment(toDate).format("YYYY-MM-DD"),
            tr_mode:PaymentStatusValue
        }

        await axios.post(`${ADDRESSES.PAYMENTREPORT_BM}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {

            console.log('utsabStart', res?.data?.coll_data_bmwise?.msg[0], 'report_data___22');

            const apiData = res?.data?.coll_data_bmwise?.msg || [];

            const formattedData = apiData.map((item, index) => ({
                id: index + 1,
                // branch_name: item.branch_name,
                // area_code: item.area_code,
                // co_name: item.co_name,
                // demand_date: item.demand_date,
                // group_name: item.group_name,
                // client_name: item.client_name,
                // dmd_amt: item.dmd_amt,
                // period_mode: item.period_mode,
                // recovery_day: item.recovery_day,
                // week_no: item.week_no,

                bank_branch_name: item.bank_branch_name,
                bank_name: item.bank_name,
                client_name: item.client_name,
                credit: item.credit,
                curr_balance: item.curr_balance,
                group_code: item.group_code,
                group_name: item.group_name,
                intt_recov: item.intt_recov,
                loan_account: item.loan_account,
                member_code: item.member_code,
                prn_recov: item.prn_recov,
                sb_account: item.sb_account,
                scheme_id: item.scheme_id,
                scheme_name: item.scheme_name,
                tr_mode: item.tr_mode,
                co_name: item.co_name,
                co_id: item.co_id,
                
            }));

            setReportData(formattedData);

        })
    }



    const totalDemand = reportData.reduce(
        (sum, item) => sum + Number(item.dmd_amt || 0), 0
    );

    const filteredReportData = reportData?.filter((item) =>
        (item.group_name || "")
            .toLowerCase()
            .includes(searchGroupName.toLowerCase())
    );

    const to = Math.min((page + 1) * numberOfItemsPerPage, filteredReportData.length);



    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Payment Status Report" subtitle={`Payment Status Report`} isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    gap: 10
                }}>
                    <View style={{
                        backgroundColor: theme.colors.onSecondary,
                        gap: 10, padding: 10,
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20
                    }}>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >

                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: theme.colors.secondary,
                                    padding: 2,
                                    borderRadius: 12,
                                }}
                            >
                                <ButtonPaper
                                    textColor={theme.colors.onTertiary}
                                    onPress={() => setOpenFromDate(true)}
                                    mode="text">
                                    FROM: {fromDate?.toLocaleDateString("en-GB")}
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
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: theme.colors.secondary,
                                    padding: 2,
                                    borderRadius: 12,
                                }}
                            >
                                <ButtonPaper
                                    textColor={theme.colors.onTertiary}
                                    onPress={() => setOpenToDate(true)}
                                    mode="text">
                                    TO: {toDate?.toLocaleDateString("en-GB")}
                                </ButtonPaper>
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
                        </View>
                        <>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "nowrap",
                                }}
                            >
                                {paymentOption.map((item, index) => {

                                    const isChecked = PaymentStatusValue === item.value;

                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                marginRight: 10,
                                            }}
                                        >

                                            <RadioButton
                                                color={theme.colors.primary}
                                                value={item.value}
                                                status={isChecked ? "checked" : "unchecked"}
                                                onPress={() => {
                                                    onChange2(item.value);
                                                }}
                                            />

                                            <Text
                                                onPress={() => {
                                                    onChange2(item.value);
                                                }}
                                            >
                                                {item.label}
                                            </Text>

                                        </View>
                                    );
                                })}
                            </View>

                            {/* <View>
                            <Text>{JSON.stringify(fromDate, null, 2)} //fromDate, toDate {JSON.stringify(toDate, null, 2)}
                            toDate {JSON.stringify(PaymentStatusValue, null, 2)}</Text>
                            <Text>ddddddddddddddddd</Text>
                            </View> */}

                                <View>
                                    <ButtonPaper
                                        onPress={() => {
                                            if(loginStore?.id == '1'){
                                            getDemandReportData_CO()
                                            }

                                            if(loginStore?.id == '2' || loginStore?.id == '13'){
                                            getDemandReportData_BM()
                                            }
                                        }
                                        }
                                        mode="contained-tonal"
                                        buttonColor={theme.colors.secondary}
                                        textColor={theme.colors.onSecondary}
                                        loading={isLoading}
                                        // disabled={isDisabled}
                                    >
                                        Search
                                    </ButtonPaper>
                                </View>
                           


                        </>
                        {/* )} */}

                    </View>


                    <View>

                        <TextInput
                            mode="outlined"
                            label="Search Group"
                            value={searchGroupName}
                            onChangeText={setSearchGroupName}
                            dense
                            style={{ minWidth: '100%' }}
                        />
                    </View>

                    <View>
                        <SurfacePaper backgroundColor={theme.colors.surface}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={true}
                            >

                                <DataTable>

                                <DataTable.Header style={titleStyle}>
                                <DataTable.Title textStyle={SLTextStyle}>
                                Sl No.
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Group Name
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Member Name
                                </DataTable.Title>

                                {(loginStore?.id == '2' || loginStore?.id == '13') && (
                                <>
                                <DataTable.Title textStyle={titleTextStyle}>
                                CO Name
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                CO ID
                                </DataTable.Title>
                                </>
                                )}

                                <DataTable.Title textStyle={titleTextStyle}>
                                Bank Name
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Branch Name
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Loan Account
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Principal Recovery
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Interest Recovery
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Credit
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Current Balance
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Scheme Name
                                </DataTable.Title>

                                <DataTable.Title textStyle={titleTextStyle}>
                                Transaction Mode
                                </DataTable.Title>
                                </DataTable.Header>

                                {filteredReportData
                                ?.slice(from, to)
                                ?.map((item, index) => (

                                <DataTable.Row key={index}>

                                <DataTable.Cell textStyle={SLTextStyle}>
                                {from + index + 1}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.group_name}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.client_name}
                                </DataTable.Cell>

                                {(loginStore?.id == '2' || loginStore?.id == '13') && (
                                <>
                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.co_name}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.co_id}
                                </DataTable.Cell>
                                </>
                                )}

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.bank_name}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.bank_branch_name}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.loan_account}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.prn_recov}/-
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.intt_recov}/-
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.credit}/-
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.curr_balance}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.scheme_name}
                                </DataTable.Cell>

                                <DataTable.Cell textStyle={titleTextStyle}>
                                {item.tr_mode == "C" ? 'Cash' : item.tr_mode == "B" ? 'UPI' : null}
                                </DataTable.Cell>

                                </DataTable.Row>
                                ))}

                                    <DataTable.Pagination
                                        page={page}
                                        // numberOfPages={Math.ceil(reportData.length / numberOfItemsPerPage)}
                                        numberOfPages={Math.ceil(filteredReportData.length / numberOfItemsPerPage)}
                                        onPageChange={page => setPage(page)}
                                        // label={`${from + 1}-${to} of ${reportData.length}`}
                                        label={`${from + 1}-${to} of ${filteredReportData.length}`}
                                        numberOfItemsPerPageList={[5, 10, 20, 50]}
                                        numberOfItemsPerPage={numberOfItemsPerPage}
                                        onItemsPerPageChange={setNumberOfItemsPerPage}
                                        showFastPaginationControls
                                        selectPageDropdownLabel={'Rows per page'}
                                    />



                                </DataTable>



                            </ScrollView>
                        </SurfacePaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


export default PaymentStatusReport
