import { StyleSheet, SafeAreaView, ScrollView, View, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import { Divider, Icon, IconButton, List, Searchbar, Text } from 'react-native-paper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'
import RadioComp from '../components/RadioComp'
import DatePicker from 'react-native-date-picker'
import ButtonPaper from '../components/ButtonPaper'
import { formattedDate } from '../utils/dateFormatter'

const SearchLoanRecoveryScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [openFromDate, setOpenFromDate] = useState(() => false);
    const [reportData, setReportData] = useState(() => [])
    const [fromDate, setFromDate] = useState(() => new Date());
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    const [loading, setLoading] = useState(() => false)
    const [isDisabled, setDisabled] = useState(() => false)
    const [search, setSearch] = useState(() => "")
    const [demand_click, setDemandClick] = useState(() => false)
    const [formsData, setFormsData] = useState<any[]>(() => [])
    const [group_code, setGroupCode] = useState([])
    const [alreadyRecovered, setAlreadyRecovered] = useState(() => false)

    // const [isApproved, setIsApproved] = useState<string>(() => "U")

    const onChangeSearch = (query: string) => {
        setSearch(query)
    }

    useEffect(() => {
        setSearch("")
        setFormsData(() => [])
    }, [isFocused])

    const handleSearch = async (src) => {
        setLoading(true)
        setDemandClick(false)
        const creds = {
            grp_dtls: src,
            get_date: new Date(),
            branch_code: loginStore?.brn_code
        }

        await axios.post(`${ADDRESSES.SEARCH_GROUP_RECOVERY}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg)
                console.log("===++=++====", res?.data)
            }
        }).catch(err => {
            ToastAndroid.show("Some error while searching groups!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }
    
    const getDemandReportData = () => {
        console.log("hello")
        setLoading(true)
        setDisabled(true)
        axios.post(`${ADDRESSES.DEMANDREPORT}`, { get_date: formattedDate(fromDate) }).then(res => {
            console.log('report_date', res?.data);
            setGroupCode(Object.keys(res?.data?.msg))
            setDisabled(false)
            setLoading(false)
            // setReportData(res?.data?.msg)
            // reportData.length=0
            setReportData([])
            for (let i of Object.keys(res?.data?.msg)) {
                var sum = 0, name = '', count = 0, t = []
                for (let j of res?.data?.msg[i]) {
                    sum += j.demand.demand.ld_demand
                    name = j.group_name
                    //   f=Object.keys(j).length
                    t.push({ mem_code: j.member_code, demand: j.demand.demand.ld_demand })
                    count++
                }

                // console.log(res?.data?.msg[i].length,count,'len')
                setReportData(prev => [...prev, {
                    code: i,
                    demand: sum,
                    name: name,
                    count: res?.data?.msg[i].length,
                    members: t
                    // members:res?.data?.msg[i]
                }])
                setDemandClick(true)

            }
            // setReportData(reportData)
            console.log('====================================')
            console.log(reportData[0].members, "dataaaaaaa")
            console.log('====================================')

            // setDemandClick(false)
        }).catch(err => console.log('error', err))
    }

    // const verifyRecovery = async (grpCode: string) => {
    //     await axios.post(ADDRESSES.VERIFY_RECOVERY, {
    //         "group_code": grpCode
    //     }).then(res => {
    //         console.log("VERIFY_RECOV", res?.data)
    //         if (res?.data?.suc === 1) {
    //             setAlreadyRecovered(true)
    //         } else {
    //             setAlreadyRecovered(false)
    //         }
    //     }).catch(err => {
    //         console.log("VERIFY_RECOV ERRRRRRRR", err)
    //     })
    // }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                minHeight: SCREEN_HEIGHT,
                height: 'auto',
            }} keyboardShouldPersistTaps="handled">
                <HeadingComp title="Loan Recovery" subtitle="Find group" />
                <View style={{
                    paddingHorizontal: 20
                }}>

                    {/* <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 15,
                        alignItems: "center",
                        backgroundColor: theme.colors.tertiary,
                        padding: 2,
                        borderRadius: 12,
                        marginVertical:15
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
                    {/* <View  style={{
                       
                        marginVertical:15,
                    }}>
                    <ButtonPaper
                        onPress={() => getDemandReportData()}
                        mode="contained-tonal"
                        buttonColor={theme.colors.secondary}
                        textColor={theme.colors.onSecondary}
                        loading={loading}
                        disabled={isDisabled}
                    >
                        SUBMIT
                    </ButtonPaper>
                </View> */}

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        gap: 5
                    }}>

                        <Searchbar
                            autoFocus
                            placeholder={"Search by Group Name/Code"}
                            onChangeText={onChangeSearch}
                            value={search}
                            elevation={search ? 2 : 0}
                            keyboardType={"default"}
                            maxLength={30}
                            style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                color: theme.colors.onTertiaryContainer,
                                width: "84%",
                                paddingVertical: 1,
                                alignItems: "center",
                                alignSelf: "center"
                            }}
                            loading={loading ? true : false}
                            onClearIconPress={() => {
                                setSearch(() => "")
                                setFormsData(() => [])
                            }}
                        />

                        {/* <ButtonPaper icon={"text-search"} mode='elevated' onPress={handleSearch} style={{
                            marginTop: 10
                        }}>
                            Search
                        </ButtonPaper> */}
                        <IconButton icon={"magnify"} mode='contained' onPress={() => search && handleSearch(search)} size={35} style={{
                            borderTopLeftRadius: 10
                        }} />
                    </View>
                </View>

                {!demand_click && <View style={{
                    padding: 20,
                    paddingBottom: 120
                }}>
                    {formsData?.map((item, i) => (
                        <React.Fragment key={i}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                key={i}
                                title={`${item?.group_name} - ${item?.group_code}`}
                                description={
                                    <View>
                                        {/* <Text>Group Code: {item?.group_code}</Text> */}
                                        {/* <Text style={{
                                            color: theme.colors.green
                                        }}>Principle Amount - {item?.total_prn_amt}{item?.total_prn_amt && "/-"}</Text> */}
                                        {/* <Text style={{
                                            color: theme.colors.error
                                        }}>Interest Amount - {item?.total_intt_amt}{item?.total_intt_amt && "/-"}</Text> */}
                                    </View>
                                }
                                onPress={async () => {
                                    if (item?.memb_dtls?.length === 0) {
                                        Alert.alert("Alert", "No members with ongoing outstanding found.")
                                        return
                                    }

                                    await axios.post(ADDRESSES.VERIFY_RECOVERY, {
                                        "group_code": item?.group_code
                                    }).then(res => {
                                        console.log("VERIFY_RECOV", res?.data)
                                        if (res?.data?.suc === 1) {
                                            Alert.alert("Alert", "Recovery already done today. Do you want to recover again?", [
                                                {
                                                    text: "YES", onPress: () => navigation.dispatch(CommonActions.navigate({
                                                        name: navigationRoutes.recoveryGroupScreen,
                                                        params: {
                                                            group_details: item,
                                                            // approvalFlag: isApproved
                                                        }
                                                    }))
                                                },
                                                { text: "NO", onPress: () => null },
                                            ])
                                        } else {
                                            navigation.dispatch(CommonActions.navigate({
                                                name: navigationRoutes.recoveryGroupScreen,
                                                params: {
                                                    group_details: item,
                                                    // approvalFlag: isApproved
                                                }
                                            }))
                                        }
                                    }).catch(err => {
                                        console.log("VERIFY_RECOV ERRRRRRRR", err)
                                    })
                                }}
                                left={props => <List.Icon {...props} icon="form-select" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                right={props => (
                                    <View style={{
                                        alignSelf: 'center'
                                    }}>
                                        <Icon
                                            source={item?.status === "U" ? "alpha-u-circle-outline" : "alpha-a-circle-outline"}
                                            size={28}
                                            color={item?.status === "U" ? theme.colors.error : theme.colors.green}
                                        />
                                    </View>
                                )}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>}
                {demand_click && <View style={{
                    padding: 20,
                    paddingBottom: 120
                }}>
                    {reportData.length > 0 && reportData?.map((item, i) => (
                        <React.Fragment key={i}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                key={i}
                                title={`${item.name}-${item.code}`}
                                description={
                                    <View>
                                        <Text style={{
                                            color: theme.colors.green
                                        }}>Demand Amount - {item.demand + '/-'}</Text>
                                        <Text style={{
                                            color: theme.colors.green
                                        }}>Members - {item.count}</Text>
                                        {item?.members?.map((mem, index) => (
                                            <React.Fragment key={index}>

                                                <View>
                                                    <Text style={{
                                                        color: theme.colors.secondary
                                                    }}>Member code - {mem.mem_code}, Demand - {mem.demand}/-</Text>
                                                </View>
                                            </React.Fragment>
                                        ))}

                                    </View>
                                }
                                onPress={() => {
                                    // navigation.dispatch(CommonActions.navigate({
                                    //     name: navigationRoutes.recoveryGroupScreen,
                                    //     params: {
                                    //         group_details: item.code,
                                    //         // approvalFlag: isApproved
                                    //     }
                                    // }))
                                    setSearch(item.name)
                                    handleSearch(item.name)
                                    setDemandClick(false)
                                }}
                                left={props => <List.Icon {...props} icon="form-select" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                right={props => (
                                    <View style={{
                                        alignSelf: 'center'
                                    }}>
                                        <Icon
                                            source={item?.status === "U" ? "alpha-u-circle-outline" : "alpha-a-circle-outline"}
                                            size={28}
                                            color={item?.status === "U" ? theme.colors.error : theme.colors.green}
                                        />
                                    </View>
                                )}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>}
            </ScrollView>
            {/* {loading && <LoadingOverlay />} */}
        </SafeAreaView>
    )
}

export default SearchLoanRecoveryScreen

const styles = StyleSheet.create({})