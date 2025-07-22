import { Alert, Linking, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Checkbox, Icon, Text } from "react-native-paper"
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../../components/InputPaper'
import MenuPaper from '../../components/MenuPaper'
import ButtonPaper from '../../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import { loginStorage } from '../../storage/appStorage'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
import useGeoLocation from '../../hooks/useGeoLocation'
import RadioComp from '../../components/RadioComp'
import DatePicker from 'react-native-date-picker'
import { formattedDate } from '../../utils/dateFormatter'
import { useEscPosPrint } from "../../hooks/useEscPosPrint"
import { BASE_URL } from '../../config/config'
import dayjs from 'dayjs'

const RecoveryGroupForm = ({ fetchedData, approvalStatus = "U" }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [hasBeforeUpnapproveTransDate, setHasBeforeUpnapproveTransDate] = useState(false);
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")
    const [errMsg, setErrMsg] = useState(() => "")
    const { handlePrint } = useEscPosPrint()

    console.log("LOGIN DATAAA =============", loginStore)
    console.log("4444444444444444444ffffffffffffffff", fetchedData)
    console.log("tr_dt", fetchedData.memb_dtls[0].last_trn_dt)
    console.log("membbbbbbbbbbbbb", fetchedData.memb_dtls[0])

    const [loading, setLoading] = useState(() => false)

    const [formData, setFormData] = useState({
        last_trn_dt: "",
        groupName: "",
        groupType: "",
        groupTypeName: "",
        totalPrincipleAmount: "",
        totalInterestAmount: "",
        totalAmount: "",
        // //////////////////////
        // prn_amt: "",
        roi: "",
        period: "",
        periodMode: "",
        txnMode: "C",
        txnDate: new Date(),
        chequeDate: new Date(),
        bankName: "",
        chequeId: "",
    })

    const [memberDetailsArray, setMemberDetailsArray] = useState<any[]>(() => [])
    const [banks, setBanks] = useState([])
    const [last_trn_dt, setLastTrnDt] = useState(fetchedData.memb_dtls[0].last_trn_dt)
    const [openDate, setOpenDate] = useState(() => false)
    const [openDate2, setOpenDate2] = useState(() => false)
    // const formattedTnxDate = formattedDate(formData?.txnDate)
    const [canTxnCheckFlag, setCanTxnCheckFlag] = useState<"D" | "F">(() => "F")

    const groupTypes = [
        {
            title: "SHG",
            func: () => {
                handleFormChange("groupType", "S");
                handleFormChange("groupTypeName", "SHG")
            }
        },
        {
            title: "JLG",
            func: () => {
                handleFormChange("groupType", "J");
                handleFormChange("groupTypeName", "JLG")
            }
        }
    ]

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }
    useEffect(()=>{
            console.log("Recovery Group Form useEffect called")
    },[])
    useEffect(() => {
        if (error) {
            Alert.alert("Turn on Geolocation", "Give access to Location or Turn on GPS from app settings.", [{
                text: "Go to Settings",
                onPress: () => { navigation.dispatch(CommonActions.goBack()); Linking.openSettings() }
            }])
        }
    }, [isFocused, error])

    console.log("LOcAtion", location)
    console.log("LOcAtion ERRR", error)

    const fetchGeoLocaltionAddress = async () => {
        console.log("REVERSE GEO ENCODING API CALLING...")
        // await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyDdA5VPRPZXt3IiE3zP15pet1Nn200CRzg`).then(res => {
        //     setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        // })
        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${location?.latitude},${location?.longitude}&api_key=DYdFc2y563IaPHDz5VCisFGjsspC6rkeIVHzg96e`,
        //     headers: {
                
        //         'Content-Type': 'application/json',
        //     }
        // };

        // await axios.request(config).then(res => {
        //     console.log("REVERSE GEO ENCODING RES =============", res?.data?.results[0])
        //     setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        // }).catch(err => {
        //     console.log("REVERSE GEO ENCODING ERR =============", JSON.stringify(err))
        //     // ToastAndroid.show("Some error occurred while fetching geolocation address.", ToastAndroid.SHORT)
        // })
        // await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyAhSuw5-ThQnJTZCGC4e_oBsL1iIUbJxts`).then(res => {
        //     setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        // })
    }

    useEffect(() => {
        console.log("APPROVAL STATUS", approvalStatus)
        if (location?.latitude && location.longitude && approvalStatus === "A") {
            console.log("LOCATION CHANGED, FETCHING GEO ADDRESS...")
            // fetchGeoLocaltionAddress()
        }
    }, [location])

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                if (
                    granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Bluetooth permissions granted.');
                } else {
                    console.log('Bluetooth permissions denied.');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const requestNearbyDevicesPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Nearby devices permission granted.');
                } else {
                    console.log('Nearby devices permission denied.');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const requestPermissions = async () => {
        await requestBluetoothPermissions();
        await requestNearbyDevicesPermission();
    };

    useEffect(() => {
        requestPermissions()
    }, [])

    const countNoOfInstallments = (creditAmt: number, index: number) => {
        console.log("tot_emi_func", fetchedData.memb_dtls[index]?.tot_emi, creditAmt)
        if (creditAmt / +fetchedData.memb_dtls[index]?.tot_emi <= 1) {
            console.log("in 1")
            return 1
        }

        // return Math.trunc(creditAmt / +fetchedData.memb_dtls[index]?.tot_emi)
        else {
            return 0
        }
    };

    const currentPrincipalCalculate = (creditAmt: number) => {
        let roi = +fetchedData?.memb_dtls[0]?.curr_roi;
        // let currentPrincipal = ((creditAmt / (roi + 100)) * 100);
        let currentPrincipal = ((creditAmt / ((roi * +fetchedData?.memb_dtls[0]?.factor) + 100)) * 100);
        // return currentPrincipal?.toFixed(2)
        return Math.round(currentPrincipal)
    }

    const currentInterestCalculate = (creditAmt: number) => {
        // let roi = +fetchedData?.memb_dtls[0]?.curr_roi;

        // let currentPrincipal = ((creditAmt / (roi + 100)) * 100);
        // let currentPrincipal = ((creditAmt / ((roi * +fetchedData?.memb_dtls[0]?.factor) + 100)) * 100);

        // let currentInterest = creditAmt - currentPrincipal;
        let currentInterest = creditAmt - currentPrincipalCalculate(creditAmt);

        // return currentInterest?.toFixed(2)
        return Math.round(currentInterest)
    }

    useEffect(() => {
        setFormData({
            groupName: fetchedData?.group_name || "",
            groupType: fetchedData?.group_type || "",
            groupTypeName: fetchedData?.group_type === "S" ? "SHG" : fetchedData?.group_type === "J" ? "JLG" : "",
            totalPrincipleAmount: fetchedData?.total_prn_amt,
            totalInterestAmount: fetchedData?.total_intt_amt,
            totalAmount: `${+fetchedData?.total_prn_amt + +fetchedData?.total_intt_amt}`,
            last_trn_dt: fetchedData?.memb_dtls[0].last_trn_dt,
            roi: fetchedData?.memb_dtls[0]?.curr_roi,
            period: fetchedData?.memb_dtls[0]?.period,
            periodMode: fetchedData?.memb_dtls[0]?.period_mode,
            txnMode: formData.txnMode,
            txnDate: formData.txnDate || new Date(),
            chequeDate: formData.chequeDate || new Date(),
            bankName: formData.bankName || "",
            chequeId: formData.chequeId || "",
        })
        if (memberDetailsArray.length === 0) {
            setMemberDetailsArray((fetchedData?.memb_dtls as any[])?.map((item, i) => {
                handleEMIChange(item?.demand?.demand?.ld_demand || 0, i)
                return ({
                    ...item,
                    isChecked: true,
                    prn_amt: item?.prn_amt,

                    credit: item?.demand?.demand?.ld_demand ? item?.demand?.demand?.ld_demand : 0,
                    // credit: item?.tot_emi,
                    intt_emi: currentInterestCalculate(+item?.demand?.demand?.ld_demand || 0),
                    prn_emi: currentPrincipalCalculate(+item?.demand?.demand?.ld_demand || 0),
                })
            }))
            // setTotalEMI(memberDetailsArray.reduce((sum, item) => sum + item.creditAmount, 0))
        }
        // setMemberDetailsArray((fetchedData?.memb_dtls as any[])?.map((item, i) => {
        //     handleEMIChange(item?.tot_emi, i)
        //     return ({
        //     ...item,
        //     isChecked: true,
        //     credit: item?.demand?.demand?.ld_demand ? item?.demand?.demand?.ld_demand : 0,
        //     // credit: item?.tot_emi,
        //     intt_emi: currentInterestCalculate(+item?.tot_emi),
        //     prn_emi: currentPrincipalCalculate(+item?.tot_emi),
        // })}))

        console.log("MEMB_DTLS", fetchedData?.memb_dtls)
        console.log("MEMB_DTLS UPDATEDDDDD", memberDetailsArray)
    }, [memberDetailsArray])

    // const [totalEMI, setTotalEMI] = useState(() => "")

    const handleEMIChange = (txt: string, i: any) => {
        console.log(memberDetailsArray.map(e => e.instl_paid), txt, "member details")
        console.log("TTTTTXXXXXXXTTTTTTTTT", txt)
        console.log("TTTTTXXXXXXXTTTTTTTTT IIIIIIIIIIII", currentInterestCalculate(+txt))
        console.log("TTTTTXXXXXXXTTTTTTTTT PPPPPPPPPPPP", currentPrincipalCalculate(+txt))

        setMemberDetailsArray(prevArray =>
            prevArray.map((member, index) =>
                index === i ? { ...member, credit: txt, intt_emi: currentInterestCalculate(+txt), prn_emi: currentPrincipalCalculate(+txt), instl_paid: 0 } : member
            )
        )
    }

    const fetchBanks = async () => {
        setBanks([]);
        setLoading(true)
        await axios.get(`${ADDRESSES.GET_BANKS}`).then(res => {
            console.log("LALALALLA", res?.data)
            if (res?.data?.suc === 1) {
                res?.data?.msg?.map((item, _) => (
                    setBanks(prev => [...prev, { title: item?.bank_name, func: () => { handleFormChange("bankName", item?.bank_name); handleFormChange("bankId", item?.bank_code) } }])
                ))
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching Sub Purposes of Loan!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    useEffect(() => {
        fetchBanks()
    }, [])

    const checkCanTxn = async () => {
        setLoading(true);
        setHasBeforeUpnapproveTransDate(false);
        const payload = {
            branch_code:loginStore?.brn_code,
            transaction_date: dayjs(formData?.txnDate).format('YYYY-MM-DD'),
          }
          axios.post(`${BASE_URL}/admin/fetch_unapprove_dtls_before_trns_dt`, payload).then((res) => {
                console.log('res?.data?.msg');

                console.log(res?.data?.msg);
               if(res?.data?.suc === 1){
                    if(res?.data?.msg?.length > 0){
                        const hasNonZero = res?.data?.msg.some(item =>Object.values(item).some(value => value != 0));
                        setHasBeforeUpnapproveTransDate(hasNonZero);
                          if(hasNonZero){
                                setLoading(false);
                                let txt = `${res?.data?.msg[0]?.transactions > 0 ? 'transaction(s),' : ''} ${res?.data?.msg[0]?.group_migrate > 0 ? 'group migrate(s),' : ''} ${res?.data?.msg[0]?.member_migrate > 0 ? 'member migrate(s)' : ''} `;
                                setErrMsg(txt);
                                 Alert.alert(`Cannot proceed`, `There are unapproved ${txt}before this date. Please check and try again.`, [
                                    {
                                        text: "OK", onPress: () => null
                                    }
                                ])
                                // ToastAndroid.show(`There are unapproved ${txt} before this date. Please check and try again.`, ToastAndroid.SHORT)
                          }
                          else{
                                    const transformedObj = memberDetailsArray.filter((item, i) => item.isChecked && item.credit > 0).map((item) => ({
                                        loan_id: item.loan_id,
                                        last_trn_dt: formattedDate(formData.txnDate),
                                    }));
                                    
                                    axios.post(`${ADDRESSES.CHECK_CAN_TXN}`, {
                                        checkdatedtls: transformedObj,
                                    }).then(res => {
                                        setLoading(false);
                                        // console.log("CAN TXN", res?.data)
                                        setCanTxnCheckFlag(res?.data?.tr_flag)
                                        if (res?.data?.tr_flag === "F") {
                                            Alert.alert("Cannot proceed", "Some future transactions found! You cannot proceed this transaction. Try changing Txn Date instead.", [
                                                {
                                                    text: "OK", onPress: () => null
                                                }
                                            ])
                                        } else if (res?.data?.tr_flag === "D") {
                                            Alert.alert("Approved", "Now you can collect amount.", [
                                                {
                                                    text: "OK", onPress: () => null
                                                }
                                            ])
                                        }
                                    }
                                ).catch(err => {
                                    setLoading(false);
                                    console.log("CAN TXN ERR", err)
                                    setCanTxnCheckFlag("F")
                                })
                          }
                    }
               }
          }).
            catch((err) => {
            setLoading(false);
             Alert.alert("Cannot proceed", "We are unable to process your request!! Please try again later", [
                {
                    text: "OK", onPress: () => null
                }
            ])
        })

        //
      
        //
    }

    useEffect(() => {
        setCanTxnCheckFlag('F')
    }, [memberDetailsArray, formData.txnDate])

    const sendRecoveryEMI = async () => {
        if(hasBeforeUpnapproveTransDate){
            ToastAndroid.show(`There are unapproved ${errMsg} before this date. Please check and try again.`, ToastAndroid.SHORT)
            return;
        }
        setLoading(true)
        const transformedObj = memberDetailsArray.filter((item, i) => item.isChecked && item.credit > 0).map((item) => ({
            loan_id: item.loan_id,
            credit: item.credit,
            intt_cal_amt: item.intt_cal_amt,
            prn_emi: item.prn_emi,
            intt_emi: item.intt_emi,
            instl_paid: item.instl_paid,
            // balance:item.balance,
            group_code: fetchedData.group_code,
            prn_amt: item?.prn_amt,
            intt_amt: item?.intt_amt,
            last_trn_dt: formattedDate(formData.txnDate),
            upload_on: new Date().toLocaleTimeString("en-GB")
        }));


        const creds = {
            "branch_code": loginStore?.brn_code,
            "created_by": loginStore?.emp_id,
            "modified_by": loginStore?.emp_id,
            // "trn_lat": location.latitude,
            // "trn_long": location.longitude,
            // "trn_addr": geolocationFetchedAddress,
            "trn_lat": 0,
            "trn_long":0,
            "trn_addr": "",
            "tr_mode": formData.txnMode,
            "bank_name": formData?.bankName || "",
            "cheque_id": formData?.chequeId || 0,
            // "cheque_id": 0,
            "chq_dt": formattedDate(formData?.chequeDate) || "",
            "group_code": fetchedData?.group_code,
            // "prn_amt":formData?.prn_amt,
            // "balance": fetchedData?.balance,
            // "recovdtls": [{
            //     "loan_id": "",
            //     "credit": "",
            //     "balance": "",
            //     "intt_cal_amt": "",
            //     "prn_emi": "",
            //     "intt_emi": "",
            //     "instl_paid": "",
            //     "last_trn_dt": ""
            // }],
            "recovdtls": transformedObj
        }

        console.log("PAYLOAD---RECOVERY", creds)
        await axios.post(ADDRESSES.LOAN_RECOVERY_EMI, creds).then(async res => {
            console.log("RESSSSS", res?.data)
            if (res?.data?.suc === 0) {
                Alert.alert("Alert", res?.data?.msg, [
                    { text: "Back", onPress: () => navigation.goBack() }
                ], {
                    cancelable: false
                })
                return
            }
            ToastAndroid.show("Loan recovery EMI installment done.", ToastAndroid.SHORT)
            console.log("Loan recovery EMI installment done.", res?.data)

            await handlePrint(res?.data?.msg)

            navigation.goBack()
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
            console.log("Some error occurred while submitting EMI.", err)
        })
        // বিঃ দ্রঃ - দোয়া করে এই রিসিটটির একটি ফটোকপি রাখবেন। 

        console.log("JJJJJJJJJJJJJJJJJJJJ", transformedObj)
        setLoading(false)
    }

    const inputDisableLogic = () => {
        return approvalStatus === "U"
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
                    <InputPaper label="Last Transaction Date" leftIcon='account-group-outline' keyboardType="default" value={new Date(last_trn_dt).toLocaleDateString("en-GB")} onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />
                    <Divider />

                    <InputPaper label="Group Name*" leftIcon='account-group-outline' keyboardType="default" value={formData.groupName} onChangeText={(txt: any) => handleFormChange("groupName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <List.Item
                        title="Group Type*"
                        description={`Group Type: ${formData.groupTypeName}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupTypes} disabled />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <Divider />

                    {/* <InputPaper label="Total Principle Amount" maxLength={15} leftIcon='cash' keyboardType="numeric" value={formData.totalPrincipleAmount} onChangeText={(txt: any) => handleFormChange("totalPrincipleAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total Interest Amount" maxLength={15} leftIcon='cash-plus' keyboardType="numeric" value={formData.totalInterestAmount} onChangeText={(txt: any) => handleFormChange("totalInterestAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled /> */}

                    <InputPaper label="Total Outstanding (Rs.)*" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.totalAmount} onChangeText={(txt: any) => handleFormChange("totalAmount", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Rate of Interest*" leftIcon='percent-outline' keyboardType="number-pad" value={formData.roi} onChangeText={(txt: any) => handleFormChange("roi", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Period*" leftIcon='clock-time-five-outline' keyboardType="number-pad" value={formData.period} onChangeText={(txt: any) => handleFormChange("period", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Period Mode*" leftIcon='camera-timer' keyboardType="default" value={formData.periodMode} onChangeText={(txt: any) => handleFormChange("periodMode", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <Divider />

                    <RadioComp
                        title="Txn. Mode*"
                        icon="bank-transfer"
                        dataArray={[
                            {
                                optionName: "CASH",
                                optionState: formData.txnMode,
                                currentState: "C",
                                optionSetStateDispathFun: (e) => handleFormChange("txnMode", e)
                            },
                            {
                                optionName: "UPI",
                                optionState: formData.txnMode,
                                currentState: "B",
                                optionSetStateDispathFun: (e) => handleFormChange("txnMode", e)
                            },
                        ]}
                    />

                    {/* {
                        formData?.txnMode === "B" &&
                        <>
                            <List.Item
                                title="Banks*"
                                description={`Bank: ${formData.bankName}`}
                                left={props => <List.Icon {...props} icon="bank-outline" />}
                                right={props => {
                                    return <MenuPaper menuArrOfObjects={banks} />
                                }}
                                descriptionStyle={{
                                    color: theme.colors.tertiary,
                                }}
                            />

                            <InputPaper label="Txn. ID*" leftIcon='cash-fast' keyboardType="numeric" value={formData.chequeId} onChangeText={(txt: any) => handleFormChange("chequeId", txt)} customStyle={{
                                backgroundColor: theme.colors.background,
                            }} />

                            <View style={{
                                marginHorizontal: 3
                            }}>
                                <ButtonPaper
                                    textColor={theme.colors.primary}
                                    onPress={() => setOpenDate2(true)}
                                    mode="elevated"
                                    icon="calendar">
                                    TXN. DATE: {formData.chequeDate?.toLocaleDateString("en-GB")}
                                </ButtonPaper>
                            </View>
                            <DatePicker
                                modal
                                mode="date"
                                open={openDate2}
                                date={formData.chequeDate}
                                onConfirm={date => {
                                    setOpenDate2(false)
                                    handleFormChange("chequeDate", date)
                                }}
                                onCancel={() => {
                                    setOpenDate2(false)
                                }}
                            />
                        </>
                    } */}

                    <View style={{
                        marginHorizontal: 3
                    }}>
                        <ButtonPaper
                            textColor={theme.colors.primary}
                            onPress={() => setOpenDate(true)}
                            mode="elevated"
                            icon="calendar"
                        // disabled={inputDisableLogic()}
                        >
                            {/* CHOOSE DOB: {formData.dob?.toLocaleDateString("en-GB")} */}
                            CHOOSE TXN. DATE: {formData.txnDate?.toLocaleDateString("en-GB")}
                        </ButtonPaper>
                    </View>
                    <DatePicker
                        // maximumDate={new Date(new Date(fetchedData?.instl_end_dt))}
                        maximumDate={new Date()}
                        // minimumDate={new Date(new Date().setDate(1))}
                        modal
                        mode="date"
                        // minimumDate={new Date(new Date())}
                        open={openDate}
                        date={formData.txnDate}
                        onConfirm={date => {
                            setOpenDate(false)
                            handleFormChange("txnDate", date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    />

                    <ButtonPaper icon="alert-circle-check-outline" mode="contained" style={{
                        backgroundColor: theme.colors.tertiary,
                    }} onPress={async () => await checkCanTxn()} loading={loading} 
                    disabled={loading || memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0) === 0 || memberDetailsArray.filter((item, _) => +item.credit > (+item.prn_amt + +item.intt_amt)).length > 0}>
                        {"Check TXN Availability"}
                    </ButtonPaper>

                    <View style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: 3,
                        width: "100%",
                    }}>
                        <Icon source={"information-outline"} size={20} color={theme.colors.tertiary} />
                        <Text variant='bodySmall' style={{
                            color: theme.colors.onTertiaryContainer,
                            fontStyle: "italic",
                        }}>
                            Always click above button to check if you can proceed the transaction, even after changing the members or txn date. If not, please change the Txn Date and re-check.
                        </Text>
                    </View>

                    <View>
                        <Text variant="labelLarge" style={{
                            marginBottom: 10,
                            color: theme.colors.primary
                        }}>Members</Text>
                        <View style={{
                            flexDirection: "column",
                            gap: 8,
                            flexWrap: "wrap"
                        }}>
                            {memberDetailsArray?.map((item, i) => (
                                <View key={i} style={{ width: "100%" }}>
                                    <List.Item
                                        titleStyle={{
                                            color: theme.colors.primary,
                                        }}
                                        descriptionStyle={{
                                            color: theme.colors.secondary,
                                        }}
                                        key={i}
                                        title={<Text style={{
                                            color: theme.colors.primary,
                                            textDecorationLine: !item?.isChecked ? "line-through" : "none"
                                        }}>{item?.client_name}</Text>}
                                        description={
                                            <View>
                                                <Text style={{
                                                    color: theme.colors.green,
                                                    textDecorationLine: !item?.isChecked ? "line-through" : "none"
                                                }}>Outstanding - {+item?.intt_amt + +item?.prn_amt}{(+item?.intt_amt + +item?.prn_amt) && "/-"}</Text>
                                                <Text style={{
                                                    color: theme.colors.secondary,
                                                    textDecorationLine: !item?.isChecked ? "line-through" : "none"
                                                }}>Last Txn - {new Date(item?.last_trn_dt).toLocaleDateString("en-GB")}</Text>
                                            </View>
                                        }
                                        // onPress={() => {
                                        //     navigation.dispatch(CommonActions.navigate({
                                        //         name: navigationRoutes.recoveryMemberScreen,
                                        //         params: {
                                        //             member_details: item,
                                        //         }
                                        //     }))
                                        // }}
                                        left={() => (
                                            <View style={{
                                                alignSelf: "center"
                                            }}>
                                                <Checkbox
                                                    status={item?.isChecked ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        setMemberDetailsArray(prevArray =>
                                                            // prevArray.map((member, index) =>
                                                            //     index === i ? { ...member, isChecked: !member.isChecked, credit: member?.isChecked ? 0 : member.demand.demand.ld_demand?member.demand.demand.ld_demand:member?.tot_emi } : member
                                                            prevArray.map((member, index) =>
                                                                index === i ? { ...member, isChecked: !member.isChecked, credit: member?.isChecked ? 0 : member.demand.demand.ld_demand ? member.demand.demand.ld_demand : 0 } : member
                                                            )
                                                        );
                                                        // setMemberDetailsArray(prevArray =>
                                                        //     prevArray.map((member, index) =>
                                                        //         index === i ? { ...member, isChecked: !member.isChecked, credit: member?.isChecked ? 0 : member?.tot_emi } : member
                                                        //     )
                                                        // );
                                                    }}
                                                />
                                            </View>
                                        )}
                                        right={() => {
                                            //    console.log("@@@@@@@@@@@@@@", item?.credit)
                                            return (
                                                <InputPaper selectTextOnFocus label="EMI" maxLength={8} leftIcon='cash-100' keyboardType="numeric" value={item?.credit}
                                                    onBlur={() => {
                                                        if (memberDetailsArray.filter((item, _) => +item.credit > (+item.prn_amt + +item.intt_amt)).length > 0) {
                                                            ToastAndroid.show('Entered amount cannot be greater than the outstanding amount', ToastAndroid.SHORT)
                                                        }
                                                    }}
                                                    onChangeText={(txt: string) => {
                                                        // handleEMIChange(item?.credit, i)
                                                        handleEMIChange(txt, i)
                                                    }} customStyle={{
                                                        backgroundColor: theme.colors.background,
                                                    }} disabled={!item?.isChecked} />
                                            )
                                        }}
                                    />
                                    <Divider />
                                </View>
                            ))}





                            {/* Total Calculated EMI */}
                            {/* <View style={{ width: "100%" }}>
                                <List.Item
                                    titleStyle={{
                                        color: theme.colors.primary,
                                    }}
                                    descriptionStyle={{
                                        color: theme.colors.secondary,
                                    }}
                                    title={`TOTAL AMOUNT`}
                                    // left={props => <List.Icon {...props} icon="account-circle-outline" />}
                                    right={() => (
                                        <Text>fdgfdgdfg/-</Text>
                                    )}
                                />
                                <Divider />
                            </View> */}
                        </View>
                        <View style={{ width: "100%" }}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                title={`TOTAL AMOUNT`}
                                // left={props => <List.Icon {...props} icon="account-circle-outline" />}
                                right={() => (
                                    <Text variant='titleMedium'>{memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0)}/-</Text>
                                )}
                            />
                            <Divider />
                        </View>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="cash-register" mode="contained" onPress={() => {
                            Alert.alert(`Collect EMI Amount ${memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0)}/-?`, `Are you sure, you want to credit this amount?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: async () => await sendRecoveryEMI(),
                                text: "Yes"
                            }])

                        }} loading={loading} disabled={loading || canTxnCheckFlag === "F" || memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0) === 0 || memberDetailsArray.filter((item, _) => +item.credit > (+item.prn_amt + +item.intt_amt)).length > 0}>
                            {!loading ? "Collect Amount" : "DON'T CLOSE THIS PAGE..."}
                        </ButtonPaper>
                    </View>
                       
                    <View>
                        <Divider />
                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default RecoveryGroupForm

const styles = StyleSheet.create({})