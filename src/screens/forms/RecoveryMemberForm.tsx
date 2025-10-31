import React, { useContext, useEffect, useState } from 'react'

import { Alert, Linking, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Chip, Surface, Text } from "react-native-paper"
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
import { formattedDate } from '../../utils/dateFormatter'
import DatePicker from 'react-native-date-picker'
import useGeoLocation from '../../hooks/useGeoLocation'
import RadioComp from '../../components/RadioComp'
// import LoadingOverlay from '../components/LoadingOverlay'
import ThermalPrinterModule from 'react-native-thermal-printer'
import { AppStore } from '../../context/AppContext'

const RecoveryMemberForm = ({ fetchedData, approvalStatus }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LOGIN DATAAA =============", loginStore)
    console.log("4444444444444444444ffffffffffffffff", fetchedData)
    console.log("LAT, LNG, ERR", location.latitude, location.longitude, error)
    const { handleLogout } = useContext<any>(AppStore)
    const [loading, setLoading] = useState(() => false)


    const [creditAmount, setCreditAmount] = useState(() => "")
    const [remainingTotalPrinciple, setRemainingTotalPrinciple] = useState(() => "")
    const [remainingTotalInterest, setRemainingTotalInterest] = useState(() => "")
    const [remainingTotalAmount, setRemainingTotalAmount] = useState(() => "")
    const [noOfInstallments, setNoOfInstallments] = useState(0);
    const [currentCreditAmtPrinciple, setCurrentCreditAmtPrinciple] = useState(() => "")
    const [currentCreditAmtInterest, setCurrentCreditAmtInterest] = useState(() => "")

    const [remainingTotalOutstandingRes, setRemainingTotalOutstandingRes] = useState(() => "")
    const [banks, setBanks] = useState([])

    const [formData, setFormData] = useState({
        clientName: "",
        installmentEndDate: "",
        installmentPaid: "0",
        installmentEMI: "",
        loanId: "",
        memberCode: "",
        roi: "",
        totalPrinciple: "",
        totalInterest: "",
        rateOfInterest: "",
        period: "",
        periodMode: "",
        principleEMI: "",
        totalEMI: "",
        tnxDate: new Date(),
        txnMode: "C",
        bankName: "",
        bankId: "",
        chequeId: "",
        chequeDate: new Date(),
    })

    const [openDate, setOpenDate] = useState(() => false)
    const [openDate2, setOpenDate2] = useState(() => false)
    const formattedTnxDate = formattedDate(formData?.tnxDate)

    // let recoveryResponse: Object = {}

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

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
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${location?.latitude},${location?.longitude}&api_key=DYdFc2y563IaPHDz5VCisFGjsspC6rkeIVHzg96e`,
            headers: {

                'Content-Type': 'application/json',
            }
        };

        await axios.request(config).then(res => {
            console.log("REVERSE GEO ENCODING RES =============", res?.data?.results[0])
            setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        }).catch(err => {
            console.log("REVERSE GEO ENCODING ERR =============", JSON.stringify(err))
            // ToastAndroid.show("Some error occurred while fetching geolocation address.", ToastAndroid.SHORT)
        })
        // await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyAhSuw5-ThQnJTZCGC4e_oBsL1iIUbJxts`).then(res => {
        //     setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        // })
    }

    useEffect(() => {
        // if (location?.latitude && location.longitude && approvalStatus === "A") {
        //     fetchGeoLocaltionAddress()
        // }
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

    useEffect(() => {
        setFormData({
            clientName: fetchedData?.client_name || "",
            installmentEndDate: new Date(fetchedData?.instl_end_dt).toLocaleDateString() || "",
            installmentPaid: fetchedData?.instl_paid || "0",
            installmentEMI: fetchedData?.intt_emi || "",
            loanId: fetchedData?.loan_id || "",
            memberCode: fetchedData?.member_code || "",
            roi: fetchedData?.curr_roi || "",
            totalPrinciple: fetchedData?.prn_amt || "",
            totalInterest: fetchedData?.intt_amt || "",
            rateOfInterest: fetchedData?.curr_roi || "",
            period: fetchedData?.period || "",
            periodMode: fetchedData?.period_mode || "",
            principleEMI: fetchedData?.prn_emi || "",
            totalEMI: fetchedData?.tot_emi || "",
            tnxDate: new Date(),
            txnMode: "C",
            bankName: "",
            bankId: "",
            chequeId: "",
            chequeDate: new Date(),
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

    const handlePrint = async (data: any) => {
        console.log("Called Printer...")
        setLoading(true)
        const text =
            `[C]SSVWS\n` +
            `[C]RECEIPT\n` +
            `[C]${data?.branch_name}\n` +
            `[C]=====================\n` +
            `[L]TXN. ID[C]:[R]${data?.tnx_id}\n` +
            `[L]TXN. DATE[C]:[R]${new Date(data?.tnx_date).toLocaleDateString("en-GB")}\n` +
            // `[L]RCPT DATE[C]:[R]${new Date().toLocaleDateString("en-GB")}\n` +
            `[L]RCPT TIME[C]:[R]${new Date().toLocaleTimeString("en-GB")}\n` +
            `[L]GROUP[C]:[R]${(data?.group_name as string)?.slice(0, 10)}\n` +
            // `[L]LOAN ID[C]:[R]${data?.loan_id}\n` +
            `[L]MEM. CODE[C]:[R]${data?.member_code}\n` +
            `[L]MEM. NAME[C]:[R]${(data?.client_name as string)?.slice(0, 10)}\n` +
            `[L]PREV. BAL[C]:[R]${data?.prev_balance}\n` +
            `[L]DEPOSIT[C]:[R]${data?.credit}\n` +
            `[L]CURR. BAL[C]:[R]${data?.curr_balance}\n` +
            `[C]==========X==========\n`;
        // `[L]BRANCH[C]:[R]\n` +
        await ThermalPrinterModule.printBluetooth({
            payload: text,
            printerNbrCharactersPerLine: 32,
            printerDpi: 120,
            printerWidthMM: 58,
            mmFeedPaper: 25,
        }).then(res => {
            console.log("RES", res)
        }).catch(err => {
            console.log("ERR", err)
        })

        console.log("Called Printer...2")
        setLoading(false)
    }

    const sendRecoveryEMI = async () => {
        setLoading(true)

        const creds = {
            branch_code: loginStore?.brn_code,
            loan_id: fetchedData?.loan_id,
            credit: creditAmount,
            balance: fetchedData?.balance,

            intt_cal_amt: fetchedData?.intt_cal_amt,
            intt_emi: Math.round(+currentCreditAmtInterest),
            prn_emi: Math.round(+currentCreditAmtPrinciple),

            tr_mode: formData?.txnMode || "",
            bank_name: formData?.bankId || "",
            cheque_id: formData?.chequeId || "",
            chq_dt: formattedDate(formData?.chequeDate) || "",

            last_trn_dt: formattedTnxDate,
            instl_paid: noOfInstallments,
            created_by: loginStore?.emp_id,
            modified_by: loginStore?.emp_id,
            trn_lat: location.latitude,
            trn_long: location.longitude,
            trn_addr: geolocationFetchedAddress
        }

        console.log("PAYLOAD---RECOVERY", creds)
        await axios.post(ADDRESSES.LOAN_RECOVERY_EMI, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {
            if (res?.data?.suc === 0) {
                handleLogout()
            }
            else {
                ToastAndroid.show("Loan recovery EMI installment done.", ToastAndroid.SHORT)
                console.log("Loan recovery EMI installment done.", res?.data)

                // navigation.goBack()
                // recoveryResponse = res?.data?.msg[0] as any

                handlePrint(res?.data?.msg[0])
                setRemainingTotalOutstandingRes(res?.data?.msg[0]?.outstanding)
                setCreditAmount(() => "")
            }
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
            console.log("Some error occurred while submitting EMI.", err)
        })

        setLoading(false)
    }

    const fetchBanks = async () => {
        setBanks([]);
        setLoading(true)
        await axios.get(`${ADDRESSES.GET_BANKS}`,{headers: {
                                Authorization: loginStore?.token, // example header
                                "Content-Type": "application/json", // optional
                            }
                        }).then(res => {
            console.log("LALALALLA", res?.data)
            if(res?.data?.suc === 0) {

                handleLogout()
                } else{
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

                    {/* <InputPaper label="Total Principle" leftIcon='cash-multiple' keyboardType="number-pad" value={formData.totalPrinciple} onChangeText={(txt: any) => handleFormChange("totalPrinciple", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total Interest" leftIcon='cash-plus' keyboardType="number-pad" value={formData.totalInterest} onChangeText={(txt: any) => handleFormChange("totalInterest", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled /> */}

                    <InputPaper label="Rate of Interest" leftIcon='percent-outline' keyboardType="number-pad" value={formData.roi} onChangeText={(txt: any) => handleFormChange("roi", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Outstanding (Rs.)" leftIcon='cash-fast' keyboardType="number-pad" value={+formData.totalInterest + +formData.totalPrinciple} onChangeText={() => null} customStyle={{
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

                    {/* <InputPaper label="Principle EMI" leftIcon='cash-lock' keyboardType="number-pad" value={formData.principleEMI} onChangeText={(txt: any) => handleFormChange("principleEMI", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Interst EMI" leftIcon='cash-plus' keyboardType="number-pad" value={formData.installmentEMI} onChangeText={(txt: any) => handleFormChange("installmentEMI", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled /> */}

                    <InputPaper label="EMI" leftIcon='account-cash-outline' keyboardType="number-pad" value={formData.totalEMI} onChangeText={(txt: any) => handleFormChange("totalEMI", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <View style={{
                        marginHorizontal: 3
                    }}>
                        <ButtonPaper
                            textColor={theme.colors.primary}
                            onPress={() => setOpenDate(true)}
                            mode="elevated"
                            icon="calendar"
                            disabled={inputDisableLogic()}>
                            {/* CHOOSE DOB: {formData.dob?.toLocaleDateString("en-GB")} */}
                            CHOOSE TXN. DATE: {formData.tnxDate?.toLocaleDateString("en-GB")}
                        </ButtonPaper>
                    </View>
                    <DatePicker
                        // maximumDate={new Date(new Date(fetchedData?.instl_end_dt))}
                        modal
                        mode="date"
                        minimumDate={new Date(fetchedData?.last_trn_dt)}
                        open={openDate}
                        date={formData.tnxDate}
                        onConfirm={date => {
                            setOpenDate(false)
                            handleFormChange("tnxDate", date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    />

                    <Divider />

                    <RadioComp
                        title="Txn. Mode"
                        icon="bank-transfer"
                        dataArray={[
                            {
                                optionName: "CASH",
                                optionState: formData.txnMode,
                                currentState: "C",
                                optionSetStateDispathFun: (e) => handleFormChange("txnMode", e)
                            },
                            {
                                optionName: "BANK",
                                optionState: formData.txnMode,
                                currentState: "B",
                                optionSetStateDispathFun: (e) => handleFormChange("txnMode", e)
                            },
                        ]}
                    />

                    {
                        formData?.txnMode === "B" &&
                        <>
                            <List.Item
                                title="Banks"
                                description={`Bank: ${formData.bankName}`}
                                left={props => <List.Icon {...props} icon="bank-outline" />}
                                right={props => {
                                    return <MenuPaper menuArrOfObjects={banks} />
                                }}
                                descriptionStyle={{
                                    color: theme.colors.tertiary,
                                }}
                            />

                            <InputPaper label="Cheque No." leftIcon='cash-fast' keyboardType="numeric" value={formData.chequeId} onChangeText={(txt: any) => handleFormChange("chequeId", txt)} customStyle={{
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
                                    {/* CHOOSE DOB: {formData.dob?.toLocaleDateString("en-GB")} */}
                                    CHEQUE DATE: {formData.chequeDate?.toLocaleDateString("en-GB")}
                                </ButtonPaper>
                            </View>
                            <DatePicker
                                // maximumDate={new Date(new Date(fetchedData?.instl_end_dt))}
                                modal
                                mode="date"
                                // minimumDate={new Date(fetchedData?.last_trn_dt)}
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
                    }

                    <InputPaper
                        label="Amount"
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
                        disabled={inputDisableLogic()}
                    />

                    {/* {creditAmount && (
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
                    )} */}

                    {remainingTotalOutstandingRes && (
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
                                }}>Total Outstanding</Text>
                                <Text variant='bodyLarge' style={{
                                    color: theme.colors.tertiary
                                }}>{remainingTotalOutstandingRes}/-</Text>
                            </View>

                            <View style={{
                                marginTop: 30
                            }}>
                                <ButtonPaper
                                    textColor={theme.colors.primary}
                                    onPress={() => navigation.dispatch(CommonActions.navigate(navigationRoutes.searchLoanRecoveryScreen))}
                                    mode="elevated"
                                    icon="arrow-left-bold-outline">
                                    Go Back
                                </ButtonPaper>
                            </View>
                        </Surface>
                    )}

                    {!remainingTotalOutstandingRes && <View style={{
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

                        }} loading={loading} disabled={!+creditAmount || +remainingTotalAmount < 0 || loading}>
                            {!loading ? "Collect Amount" : "DON'T CLOSE THIS PAGE..."}
                        </ButtonPaper>
                    </View>}

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