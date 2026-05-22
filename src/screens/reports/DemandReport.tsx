import React, { useEffect, useState } from 'react';
import { usePaperColorScheme } from '../../theme/theme';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { loginStorage } from '../../storage/appStorage';
import { SafeAreaView, TextStyle, ViewStyle } from 'react-native';
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

const daywiseOption = [
    {
        label: "All",
        value: "All",
    },
    {
        label: "Monthly",
        value: "Monthly",
    },
    {
        label: "Weekly",
        value: "Weekly",
    },
    {
        label: "Fortnight",
        value: "Fortnight",
    },
]

	const Fortnight = [
	{
		code: "1",
		name: "Week (1-3)",
	},
	{
		code: "2",
		name: "Week (2-4)",
	}
	]

function DemandReport() {
    const theme = usePaperColorScheme();
    const navigation = useNavigation();
    const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '');
    const [isLoading, setIsLoading] = useState(() => false);
    const [isDisabled, setIsDisabled] = useState(() => true);
    const [openFromDate, setOpenFromDate] = useState(() => false);
    const [reportData, setReportData] = useState(() => [])
    const [fromDate, setFromDate] = useState(() => new Date());
    const [group_code, setGroupCode] = useState([])

    const [date, setDate] = useState(null);
    const [show, setShow] = useState(false);
    const isFocused = useIsFocused()

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);

    const [FromDay, setFromDay] = useState('');
    const [ToDay, setToDay] = useState('');
    const [weekOfRecovery, setWeekOfRecovery] = useState("")

    const from = page * numberOfItemsPerPage;
    // const to = Math.min((page + 1) * numberOfItemsPerPage, reportData.length);

    

    const [DayWiseValue, setDayWiseValue] = useState(() => "All")
    const [searchGroupName, setSearchGroupName] = useState("");

    const onChange2 = (e) => {
        console.log("radio1 checked", e)
        setDayWiseValue(e)
        // setFromDay("")
        // setToDay("")
        // setFromTouched(false)
        // setToTouched(false)
    }

    const onValueChange = (event, newDate) => {
        setShow(false);

        if (newDate) {
            setDate(newDate);
        }
    };

    const titleTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer, fontSize:12,

        justifyContent: "flex-start",
        paddingHorizontal: 11,
        minWidth: 130,

        textAlign: "left",
        // width: "100%",
    }

    const SearchFieldStyle: TextStyle = {
        // color: theme.colors.onPrimaryContainer, fontSize:12,

        // justifyContent: "flex-start",
        // paddingHorizontal: 11,
        // minWidth: 130,

        // textAlign: "left",
        // // width: "100%",
        // padding:5
    }

        const SLTextStyle: TextStyle = {
        color: theme.colors.onPrimaryContainer, fontSize:12,

        justifyContent: "flex-start",
        paddingHorizontal: 11,
        minWidth: 50,

        textAlign: "left",
        // width: "100%",
    }

    const titleStyle: ViewStyle = {
        backgroundColor: theme.colors.primaryContainer
    }

    const SearchFieldStyleHead: ViewStyle = {
        backgroundColor: theme.colors.secondary,
        paddingTop:2, paddingBottom:8
    }

  

    useEffect(() => {
        // setSearch("")
        // setFormsData(() => [])
        // getDemandReportData()
        if(DayWiseValue == "All"){
            if(loginStore?.id == '1'){
                getDemandReportData_CO()
            }

            if(loginStore?.id == '2' || loginStore?.id == '13'){
                getDemandReportData_BM()
            }

        } else {
            setReportData([]);
        }

        console.log(loginStore?.id, 'ggggggggggggggg');
        
        
    }, [isFocused])

    useEffect(() => {
        setPage(0);
    }, [numberOfItemsPerPage]);

    useEffect(() => {
        setFromDay("")
        setToDay("")
        setWeekOfRecovery("");
        

        if(DayWiseValue == "All"){
            if(loginStore?.id == '1'){
                getDemandReportData_CO()
            }

            if(loginStore?.id == '2' || loginStore?.id == '13'){
                getDemandReportData_BM()
            }
            
        } else {
            setReportData([]);
        }

        // if(DayWiseValue === "Monthly" || DayWiseValue === "Weekly" || DayWiseValue === "Fortnight"){
        // if(DayWiseValue === "Weekly"){
        //     if(FromDay < ToDay && ToDay >= '7')
        //     setIsDisabled(true)
        //     }

    }, [DayWiseValue]);

    useEffect(() => {
    if (DayWiseValue === "Monthly") {

        const from = Number(FromDay);
        const to = Number(ToDay);

        // FromDay must be less than ToDay
        // ToDay must not be greater than 7

        if ( from && to && from <= to && to <= 31) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }

    if (DayWiseValue === "Fortnight") {

        const from = Number(FromDay);
        const to = Number(ToDay);

        // FromDay must be less than ToDay
        // ToDay must not be greater than 7

        if ( from && to && from <= to && to <= 7) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }

    if (DayWiseValue === "Fortnight") {

        const from = Number(FromDay);
        const to = Number(ToDay);

        // FromDay must be less than ToDay
        // ToDay must not be greater than 7

        if ( from && to && from <= to && to <= 7 && weekOfRecovery) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }

}, [DayWiseValue, FromDay, ToDay, weekOfRecovery]);

    

    const getDemandReportData_CO = async () => {
        console.log("hello")
        setReportData([])
        const creds = {
            branch_code: loginStore?.brn_code,
            send_month: moment(new Date()).format("M"),
            send_year: moment(new Date()).format("YYYY"),
            co_id: loginStore?.emp_id,

        }


        await axios.post(`${ADDRESSES.DEMANDREPORT_NEW_CO}`,  creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {
            // console.log(creds, 'report_data');
            // console.log(Object.keys(res?.data?.msg),'keys')
            // return;
            //   setGroupCode(Object.keys(res?.data?.cowise_demand_data?.msg))
            //   reportData.length=0
            //   setReportData([])
            //     for(let i of Object.keys(res?.data?.cowise_demand_data?.msg)){
            //         var sum = 0,name='',count=0,t=[]
            //         for(let j of res?.data?.cowise_demand_data?.msg[i]){
            //           sum+=j.demand.demand.ld_demand
            //           name=j.group_name
            //         //   f=Object.keys(j).length
            //           t.push({mem_code:j.member_code, demand:j.demand.demand.ld_demand})
            //           count++
            //         }
            //         setReportData(prev => [...prev, {
            //             code:i,
            //             demand:sum,
            //             name:name,
            //         }])
            // }
            // setReportData(res?.data?.cowise_demand_data?.msg)

            const apiData = res?.data?.cowise_demand_data?.msg || [];

            const formattedData = apiData.map((item, index) => ({
                id: index + 1,
                group_name: item.group_name,
                client_name: item.client_name,
                dmd_amt: item.dmd_amt,
                period_mode: item.period_mode,
                recovery_day: item.recovery_day,
                week_no: item.week_no,
            }));

            setReportData(formattedData);

        })
    }

    const getDemandReportData_BM = async () => {
        console.log("hello")
        setReportData([])
        const creds = {
            send_year: moment(new Date()).format("YYYY"),
            send_month: moment(new Date()).format("M"),
            branch_code: loginStore?.brn_code,
            // co_id: loginStore?.emp_id,
        }


        await axios.post(`${ADDRESSES.DEMANDREPORT_NEW_BM}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {
            // console.log(creds, 'report_data');
            // console.log(Object.keys(res?.data?.msg),'keys')
            // return;
            //   setGroupCode(Object.keys(res?.data?.cowise_demand_data?.msg))
            //   reportData.length=0
            //   setReportData([])
            //     for(let i of Object.keys(res?.data?.cowise_demand_data?.msg)){
            //         var sum = 0,name='',count=0,t=[]
            //         for(let j of res?.data?.cowise_demand_data?.msg[i]){
            //           sum+=j.demand.demand.ld_demand
            //           name=j.group_name
            //         //   f=Object.keys(j).length
            //           t.push({mem_code:j.member_code, demand:j.demand.demand.ld_demand})
            //           count++
            //         }
            //         setReportData(prev => [...prev, {
            //             code:i,
            //             demand:sum,
            //             name:name,
            //         }])
            // }
            // setReportData(res?.data?.cowise_demand_data?.msg)

            // console.log('utsabStart', res?.data?.bmwise_demand_data?.msg, 'report_data___22');

            const apiData = res?.data?.bmwise_demand_data?.msg || [];

            const formattedData = apiData.map((item, index) => ({
                id: index + 1,
                branch_name: item.branch_name,
                area_code: item.area_code,
                co_name: item.co_name,
                demand_date: item.demand_date,
                group_name: item.group_name,
                client_name: item.client_name,
                dmd_amt: item.dmd_amt,
                period_mode: item.period_mode,
                recovery_day: item.recovery_day,
                week_no: item.week_no,
            }));

            setReportData(formattedData);

        })
    }

    const filter_ReportData_CO = async () => {
        // console.log("hello")

        const creds= {
            send_year: moment(new Date()).format("YYYY"),
            send_month: moment(new Date()).format("M"),
            period_mode: DayWiseValue,
            from_day: FromDay,
            to_day: ToDay,
            week_no: weekOfRecovery,
            branch_code: loginStore?.brn_code,
        }
        setReportData([])

        await axios.post(`${ADDRESSES.DEMANDREPORT_NEW_FILTER_CO}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {
            // console.log(creds_CO, 'report_dataFilter', res?.data?.cowise_demand_data_day?.msg, 'utsabbbbbbbbbbbbbbbbb');
            const apiData = res?.data?.cowise_demand_data_day?.msg || [];
            const formattedData = apiData.map((item, index) => ({
                id: index + 1,
                group_name: item.group_name,
                client_name: item.client_name,
                dmd_amt: item.dmd_amt,
                period_mode: item.period_mode,
                recovery_day: item.recovery_day,
                week_no: item.week_no,
            }));

            setReportData(formattedData);

        })
    }

    const filter_ReportData_BM = async () => {
        // console.log("hello")

        const creds = {
            send_year: moment(new Date()).format("YYYY"),
            send_month: moment(new Date()).format("M"),
            period_mode: DayWiseValue,
            from_day: FromDay,
            to_day: ToDay,
            week_no: weekOfRecovery,
            branch_code: loginStore?.brn_code,
        }
        setReportData([])

        await axios.post(`${ADDRESSES.DEMANDREPORT_NEW_FILTER_BM}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {
            // console.log(creds, res?.data?.bmwise_demand_data_day?.msg[0], 'utsabbbbbbbbbbbbbbbbb');
            const apiData = res?.data?.bmwise_demand_data_day?.msg || [];
            const formattedData = apiData.map((item, index) => ({
                id: index + 1,
                branch_name: item.branch_name,
                area_code: item.area_code,
                co_name: item.co_name,
                demand_date: item.demand_date,
                group_name: item.group_name,
                client_name: item.client_name,
                dmd_amt: item.dmd_amt,
                period_mode: item.period_mode,
                recovery_day: item.recovery_day,
                week_no: item.week_no,
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

    const to = Math.min((page + 1) * numberOfItemsPerPage,filteredReportData.length);



    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Demand Report" subtitle={`Report Show For (` + moment(new Date()).format("MMMM YYYY")+')' } isBackEnabled />
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
                        {/* <View
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
                  </View> */}

                        {/* <View>
                            <Text>{moment(new Date()).format("MMMM YYYY")} </Text>
                            <Button
                                mode="contained"
                                onPress={() => setShow(true)}
                            >
                                Select Month & Year {date ? '(' + moment(date).format("MMMM YYYY") + ')' : ""}
                            </Button>
                            <Text>{moment(date).format("MMMM YYYY")}</Text>

                            {show && (
                                <MonthPicker
                                    onChange={onValueChange}
                                    value={date || new Date()}
                                    locale="en"
                                />
                            )}
                        </View> */}

                        {/* <View>
                            <ButtonPaper
                                onPress={() => getDemandReportData()}
                                mode="contained-tonal"
                                buttonColor={theme.colors.secondary}
                                textColor={theme.colors.onSecondary}
                                loading={isLoading}
                                disabled={isDisabled}
                            >
                                SUBMIT
                            </ButtonPaper>
                        </View> */}

                        {/* {reportData?.length > 0 && ( */}
                        <>
                        
                    {/* <View>
                    <Text>{JSON.stringify(filteredReportData[0], null, 2)} // {JSON.stringify(weekOfRecovery, null, 2)}</Text>
                </View> */}

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "nowrap",
                            }}
                        >
                            {daywiseOption.map((item, index) => {

                                const isChecked = DayWiseValue === item.value;

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
                        
                        {(DayWiseValue === "Monthly" || DayWiseValue === "Weekly") && (
                            <>
                        <View
                        style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        }}
                        >

                        <View style={{ flex: 1 }}>
                        <InputPaper
                        label="From Day"
                        leftIcon="calendar-today"
                        keyboardType="number-pad"
                        value={FromDay}
                        onChangeText={(txt: any) => setFromDay(txt)}
                        customStyle={{
                        backgroundColor: theme.colors.background,
                        }}
                        />
                        {/* <span style={{ fontWeight: "bold" }}>* Day of Recovery</span> */}

                        <Text style={{ color: "red", fontSize: 12, paddingTop: 8 }}>
                            {FromDay.length < 1 &&(
                            <>
                            {DayWiseValue == 'Monthly' ? '* Days between 1 to 31' : '* Days between 1 to 7'} 
                            </>
                            )}
                        </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                        <InputPaper
                        label="To Day"
                        leftIcon="calendar-today"
                        keyboardType="number-pad"
                        value={ToDay}
                        onChangeText={(txt: any) => setToDay(txt)}
                        customStyle={{
                        backgroundColor: theme.colors.background,
                        }}
                        />
                        <Text style={{ color: "red", fontSize: 12, paddingTop: 8 }}>
                            {ToDay.length < 1 &&(
                            <>
                            {DayWiseValue == 'Monthly' ? '* Days between 1 to 31' : '* Days between 1 to 7'} 
                            </>
                            )}
                        </Text>
                        </View>

                        </View>
                            {/* <Text>{FromDay} {ToDay}</Text> */}
                        </>
                        )}

                        {/* {DayWiseValue === "Weekly" && (
                            <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
                                * Weekly of Recovery
                            </Text>
                        )} */}

                        {DayWiseValue === "Fortnight" && (
                            <>

                        <Dropdown
                        style={{
                        height: 50,
                        borderWidth: 1,
                        borderColor: theme.colors.outline,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        backgroundColor: theme.colors.background,
                        }}
                        placeholderStyle={{
                        color: "gray",
                        }}
                        selectedTextStyle={{
                        color: theme.colors.onBackground,
                        }}
                        data={Fortnight}
                        labelField="name"
                        valueField="code"
                        placeholder="Select Weekday"
                        value={weekOfRecovery}
                        onChange={(item) => {
                        setWeekOfRecovery(item?.code);
                        }}
                        />

                        <View
                        style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        }}
                        >

                        <View style={{ flex: 1 }}>
                        <InputPaper
                        label="From Day"
                        leftIcon="calendar-today"
                        keyboardType="number-pad"
                        value={FromDay}
                        onChangeText={(txt: any) => setFromDay(txt)}
                        customStyle={{
                        backgroundColor: theme.colors.background,
                        }}
                        />
                        {/* <span style={{ fontWeight: "bold" }}>* Day of Recovery</span> */}

                        <Text style={{ color: "red", fontSize: 12, paddingTop: 8 }}>
                           {FromDay.length < 1 ? 'Days between 1 to 7' : ''}
                        </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                        <InputPaper
                        label="To Day"
                        leftIcon="calendar-today"
                        keyboardType="number-pad"
                        value={ToDay}
                        onChangeText={(txt: any) => setToDay(txt)}
                        customStyle={{
                        backgroundColor: theme.colors.background,
                        }}
                        />
                        <Text style={{ color: "red", fontSize: 12, paddingTop: 8 }}>
                           {ToDay.length < 1 ? 'Days between 1 to 7' : ''}
                        </Text>
                        </View>

                        </View>


                            {/* <Text>{FromDay} {ToDay} {weekOfRecovery}</Text> */}
                        </>
                        )}

                        {(DayWiseValue === "Monthly" || DayWiseValue === "Weekly" || DayWiseValue === "Fortnight") && (
                        <View>
                            <ButtonPaper
                                onPress={() => {
                                    if(loginStore?.id == '1'){
                                    filter_ReportData_CO()
                                    }

                                    if(loginStore?.id == '2' || loginStore?.id == '13'){
                                    filter_ReportData_BM()
                                    }
                                    
                                }
                                }
                                mode="contained-tonal"
                                buttonColor={theme.colors.secondary}
                                textColor={theme.colors.onSecondary}
                                loading={isLoading}
                                disabled={isDisabled}
                            >
                                Filter
                            </ButtonPaper>
                        </View>
                        )}


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

                                {/* Search Row */}
                                {/* <DataTable.Row style={SearchFieldStyleHead}>
                                    <DataTable.Cell textStyle={SearchFieldStyle}>
                                        <TextInput
                                            mode="outlined"
                                            label="Search Group Name"
                                            value={searchGroupName}
                                            onChangeText={setSearchGroupName}
                                            dense
                                            style={{ minWidth: '100%' }}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row> */}
                                
                                <DataTable.Header style={titleStyle}>
                                    <DataTable.Title textStyle={SLTextStyle}>
                                        Sl No.
                                    </DataTable.Title>
                                    
                                    {(loginStore?.id == '2' || loginStore?.id == '13') && (
                                        <>
                                        <DataTable.Title textStyle={titleTextStyle}>
                                        Branch Name
                                    </DataTable.Title>

                                    <DataTable.Title textStyle={titleTextStyle}>
                                        Division Name
                                    </DataTable.Title>

                                    <DataTable.Title textStyle={titleTextStyle}>
                                        CO Name
                                    </DataTable.Title>

                                    <DataTable.Title textStyle={titleTextStyle}>
                                        Demand Date
                                    </DataTable.Title>
                                        </>
                                    )}

                                    <DataTable.Title textStyle={titleTextStyle}>
                                        Group Name
                                    </DataTable.Title>

                                    <DataTable.Title textStyle={titleTextStyle}>
                                        Member Name
                                    </DataTable.Title>

                                    <DataTable.Title textStyle={titleTextStyle}>
                                        Demand Amount
                                    </DataTable.Title>

                                    {/* <DataTable.Title textStyle={titleTextStyle}>
                                        Period Mode
                                    </DataTable.Title> */}

                                    {DayWiseValue != "Fortnight" && (
                                    <DataTable.Title textStyle={titleTextStyle}>
                                        Recovery Day
                                    </DataTable.Title>
                                    )}
                                    {(DayWiseValue != "Monthly" && DayWiseValue != "Weekly")&& (
                                    <DataTable.Title textStyle={titleTextStyle}>
                                        Week of Recovery
                                    </DataTable.Title>
                                    )}
                                </DataTable.Header>


                                {/* {reportData
                                    ?.slice(from, to)
                                    ?.map((item, index) => ( */}

                                {filteredReportData
                                ?.slice(from, to)
                                ?.map((item, index) => (

                                        <DataTable.Row key={index}>

                                            <DataTable.Cell textStyle={SLTextStyle}>
                                                {from + index + 1}
                                            </DataTable.Cell>

                                            {(loginStore?.id == '2' || loginStore?.id == '13') && (
                                        <>
                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.branch_name}
                                            </DataTable.Cell>

                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.area_code}
                                            </DataTable.Cell>

                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.co_name}
                                            </DataTable.Cell>

                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.demand_date}
                                            </DataTable.Cell>
                                            </>
                                            )}


                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.group_name}
                                            </DataTable.Cell>

                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.client_name}
                                            </DataTable.Cell>

                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.dmd_amt}/-
                                            </DataTable.Cell>

                                            {/* <DataTable.Cell>
                                                {item.period_mode}
                                            </DataTable.Cell> */}

                                            {DayWiseValue != "Fortnight" && (
                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.recovery_day}
                                            </DataTable.Cell>
                                            )}

                                            {(DayWiseValue != "Monthly" && DayWiseValue != "Weekly")&& (
                                            <DataTable.Cell textStyle={titleTextStyle}>
                                                {item.week_no}
                                            </DataTable.Cell>
                                            )}
                                            

                                        </DataTable.Row>
                                    ))}

                                <DataTable.Row
                                    style={{
                                        backgroundColor: theme.colors.primaryContainer,
                                    }}
                                >

                                    <DataTable.Cell>
                                        <Text style={{ fontWeight: "bold" }}>
                                            Total Demand Amount: {totalDemand.toFixed(2)}/-
                                        </Text>
                                    </DataTable.Cell>

                                    <DataTable.Cell>&nbsp;</DataTable.Cell>
                                    <DataTable.Cell>&nbsp;</DataTable.Cell>

                                    <DataTable.Cell>&nbsp;</DataTable.Cell>

                                    {/* <DataTable.Cell>&nbsp;</DataTable.Cell> */}
                                    {DayWiseValue != "Fortnight" && (
                                    <DataTable.Cell>&nbsp;</DataTable.Cell>
                                    )}
                                    {(DayWiseValue != "Monthly" && DayWiseValue != "Weekly")&& (
                                    <DataTable.Cell>&nbsp;</DataTable.Cell>
                                    )}

                                </DataTable.Row>

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


export default DemandReport
