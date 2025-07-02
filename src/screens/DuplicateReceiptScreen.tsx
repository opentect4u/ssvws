import { StyleSheet, SafeAreaView, ScrollView, View, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import { Divider, IconButton, List, MD2Colors, Searchbar, Text } from 'react-native-paper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { loginStorage } from '../storage/appStorage'
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker'
import ButtonPaper from '../components/ButtonPaper'
import { formattedDate } from '../utils/dateFormatter'
import { BASE_URL } from '../config/config'
import { useEscPosPrint } from '../hooks/useEscPosPrint'

const DuplicateReceiptScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    const [startDate, setStartDate] = useState<DateType>(undefined)
    const [endDate, setEndDate] = useState<DateType>(undefined)
    const [search, setSearch] = useState(() => "")
    const [formsData, setFormsData] = useState<any[]>(() => [])
    const [filteredDataArray, setFilteredDataArray] = useState(() => [])

    const defaultStyles = useDefaultStyles();
    const { handlePrint } = useEscPosPrint();

    const onChangeSearch = (query: string) => {
        setSearch(query)
        const filteredData = formsData.filter((item) => {
            return item?.group_name?.toString()?.toLowerCase().includes(query?.toLowerCase()) ||
                item?.group_code?.toString()?.toLowerCase().includes(query?.toLowerCase())
        })
        setFilteredDataArray(filteredData)
    }

    useEffect(() => {
        setFilteredDataArray(formsData)
    }, [formsData])

    const countDays = (a: DateType, b: DateType) => {
        const d1 = new Date(a.toString())
        const d2 = new Date(b.toString())

        return Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
    }

    const handleChangeDateRange = ({
        startDate: newStart,
        endDate: newEnd,
    }: {
        startDate: DateType,
        endDate: DateType
    }) => {
        if (newStart && newEnd) {
            const span = countDays(newStart, newEnd)
            if (span > 31) {
                Alert.alert(
                    'Range Too Long',
                    `You selected ${span} days. Please pick up to 31 days.`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setStartDate(undefined)
                                setEndDate(undefined)
                            },
                        },
                    ],
                    { cancelable: false }
                )
                return
            }
        }

        setStartDate(newStart)
        setEndDate(newEnd)
    }

    const handleSearch = async () => {
        setLoading(true)

        const creds = {
            "branch_code": loginStore?.brn_code,
            "from_date": formattedDate(new Date(startDate.toString())),
            "to_date": formattedDate(new Date(endDate.toString())),
            "created_by": loginStore?.emp_id
        }

        console.log(">>>>>>>>>>>>>>", creds)

        await axios.post(`${ADDRESSES.DUPLICATE_PRINT}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg?.msg)
                console.log("===++=++====", res?.data?.msg?.msg)
            }
        }).catch(err => {
            ToastAndroid.show("Some error while searching!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const handleFetchDuplicateReceipt = async (data) => {
        setLoading(true)
        const creds = {
            "group_code": data["group_code"],
            "from_date": formattedDate(new Date(startDate.toString())),
            "to_date": formattedDate(new Date(endDate.toString())),
            "upload_on": data["upload_on"],
        }

        await axios.post(`${BASE_URL}/fetch_grpwise_member_collec`, creds).then(async res => {
            console.log("handleFetchDuplicateReceipt RESSSS", res?.data)
            await handlePrint(res?.data?.msg, true)
        }).catch(err => {
            console.log("handleFetchDuplicateReceipt ERRRRR", err)
        })
        setLoading(false)
    }

    const duplicatePrint = async (data: any) => {
        console.log("dataa dupp", data)
        await handleFetchDuplicateReceipt(data)
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                minHeight: SCREEN_HEIGHT,
                height: 'auto',
            }} keyboardShouldPersistTaps="handled">
                <HeadingComp title="Duplicate Receipt" subtitle="Find duplicate receipts" isBackEnabled />
                <View style={{
                    paddingHorizontal: 20
                }}>
                    <View style={{
                        backgroundColor: MD2Colors.amber50,
                        padding: 10,
                        marginBottom: -30,
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20,
                    }}>
                        <DateTimePicker
                            styles={{
                                ...defaultStyles,
                                selected: {
                                    backgroundColor: theme.colors.secondary,
                                    borderRadius: 8
                                },
                                range_end: {
                                    backgroundColor: MD2Colors.teal800,
                                    borderRadius: 13
                                },
                                range_start: {
                                    backgroundColor: MD2Colors.teal800,
                                    borderRadius: 13
                                },
                                range_fill: {
                                    backgroundColor: MD2Colors.teal50,
                                },
                                button_prev: {
                                    backgroundColor: theme.colors.primaryContainer,
                                    color: theme.colors.onPrimaryContainer,
                                    padding: 15,
                                    borderRadius: 100
                                },
                                button_next: {
                                    backgroundColor: theme.colors.primaryContainer,
                                    color: theme.colors.onPrimaryContainer,
                                    padding: 15,
                                    borderRadius: 100
                                },
                                header: {
                                    paddingVertical: -10
                                }
                            }}
                            mode="range"
                            multiRangeMode
                            startDate={startDate}
                            endDate={endDate}
                            minDate={new Date("2025-05-26")}
                            // max={30}
                            // onChange={({ startDate: newStart, endDate: newEnd }) => {
                            //     setStartDate(newStart);
                            //     setEndDate(newEnd);
                            //     console.log('START DT - END DT', startDate, endDate);
                            // }}
                            onChange={handleChangeDateRange}
                        />
                    </View>
                    <ButtonPaper
                        textColor={theme.colors.tertiary}
                        onPress={handleSearch}
                        mode="elevated"
                        icon="magnify"
                        disabled={!startDate || !endDate || loading}
                        loading={loading}>
                        Find
                    </ButtonPaper>
                    {formsData.length !== 0 && <View style={{
                        paddingTop: 20
                    }}>
                        <Searchbar
                            placeholder={"Find by Group Name"}
                            onChangeText={onChangeSearch}
                            value={search}
                            elevation={search ? 2 : 0}
                            keyboardType={"default"}
                            maxLength={18}
                            style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                color: theme.colors.onTertiaryContainer,
                            }}
                        />
                    </View>}
                </View>

                <View style={{
                    padding: 20,
                    paddingBottom: 120
                }}>
                    {filteredDataArray?.map((item, i) => (
                        <React.Fragment key={i}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                key={i}
                                title={`${item?.group_name}`}
                                description={
                                    <View>
                                        {/* <Text>Member Code: {item?.member_code}</Text> */}
                                        <Text style={{
                                            fontStyle: 'italic'
                                        }}>Group code - {item?.group_code || "Nil"}</Text>
                                        <Text style={{
                                            fontStyle: 'italic'
                                        }}>Txn. Date - {new Date(item?.payment_date).toLocaleDateString("en-GB") || "Nil"}</Text>
                                        <Text style={{
                                            fontStyle: 'italic'
                                        }}>Txn. Time - {item?.upload_on || "Nil"}</Text>
                                        {/* <Text style={{
                                            color: item?.branch_code !== loginStore?.brn_code ? theme.colors.error : theme.colors.green
                                        }}>PIN No. {item?.pin_code || "Nil"}</Text> */}
                                    </View>
                                }
                                onPress={() => {
                                    // navigation.dispatch(CommonActions.navigate({
                                    //     name: navigationRoutes.formsAgainstCOScreen,
                                    //     params: {
                                    //         grp_details: item,
                                    //     }
                                    // }))
                                    null
                                }}
                                left={props => <List.Icon {...props} icon="account-arrow-right-outline" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                // grp_code, txn_dt, txn_time
                                right={props => (
                                    <View style={{
                                        // alignSelf: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 5
                                    }}>
                                        {/* <Icon
                                        source={item?.approval_status === "U" ? "alpha-u-circle-outline" : item?.approval_status === "A" ? "alpha-a-circle-outline" : item?.approval_status === "S" ? "alpha-s-circle-outline" : "Err"}
                                        size={28}
                                        color={item?.approval_status === "U" ? theme.colors.error : theme.colors.green}
                                    /> */}
                                        <Text variant='bodyLarge' style={{
                                            color: theme.colors.green
                                        }}>₹{item?.tot_collection}</Text>
                                        <IconButton icon={"cloud-print-outline"} iconColor={theme.colors.onTertiaryContainer} style={{
                                            backgroundColor: theme.colors.tertiaryContainer,
                                        }} onPress={() => duplicatePrint(item)} />
                                    </View>
                                )}
                                disabled
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DuplicateReceiptScreen

const styles = StyleSheet.create({})