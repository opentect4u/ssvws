import { Alert, Linking, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Checkbox, Chip, Icon, Text, TextInput } from "react-native-paper"
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
// import LoadingOverlay from '../components/LoadingOverlay'
import ThermalPrinterModule from 'react-native-thermal-printer'
// import PRNTMSG from '../../../assets/msg.png'
import { CONSTANTS } from "../../utils/constants"
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer'

const RecoveryGroupForm = ({ fetchedData, approvalStatus = "U" }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")

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
    const formattedTnxDate = formattedDate(formData?.txnDate)

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
        // await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyAhSuw5-ThQnJTZCGC4e_oBsL1iIUbJxts`).then(res => {
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
    }

    useEffect(() => {
        if (location?.latitude && location.longitude && approvalStatus === "A") {
            fetchGeoLocaltionAddress()
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
        let currentPrincipal = ((creditAmt / (roi + 100)) * 100);
        // return currentPrincipal?.toFixed(2)
        return Math.round(currentPrincipal)
    }

    const currentInterestCalculate = (creditAmt: number) => {
        let roi = +fetchedData?.memb_dtls[0]?.curr_roi;

        let currentPrincipal = ((creditAmt / (roi + 100)) * 100);
        let currentInterest = creditAmt - currentPrincipal;

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
        // if (!txt) {
        //     memberDetailsArray?.forEach((item, i) => {
        //         console.log("UUUUUUU", item?.credit)
        //         return(
        //         handleEMIChange(item?.credit, i)
        //     )
        // })
        // }

        console.log(memberDetailsArray.map(e => e.instl_paid), txt, "member details")
        // setMemberDetailsArray(prevArray =>
        //     prevArray.map((member, index) =>
        //         index === i ? { ...member, credit: txt, intt_emi: currentInterestCalculate(+txt), prn_emi: currentPrincipalCalculate(+txt), instl_paid: countNoOfInstallments(+txt,index) } : member
        //     )
        // )


        console.log("TTTTTXXXXXXXTTTTTTTTT", txt)
        console.log("TTTTTXXXXXXXTTTTTTTTT IIIIIIIIIIII", currentInterestCalculate(+txt))
        console.log("TTTTTXXXXXXXTTTTTTTTT PPPPPPPPPPPP", currentPrincipalCalculate(+txt))
        setMemberDetailsArray(prevArray =>
            prevArray.map((member, index) =>
                index === i ? { ...member, credit: txt, intt_emi: currentInterestCalculate(+txt), prn_emi: currentPrincipalCalculate(+txt), instl_paid: 0 } : member
            )
        )
    }

    // useEffect(() => {
    //     if (!initialized) {
    //         memberDetailsArray.forEach((item, i) => {
    //             handleEMIChange(item?.credit, i);
    //         });
    //         setInitialized(true);
    //     }
    // }, [initialized, memberDetailsArray]);

    // const remainingLoanCalculation = (creditAmt: number) => {
    //     let remainingInterest = +fetchedData?.intt_amt;
    //     let remainingPrinciple = +fetchedData?.prn_amt;
    //     let roi = +fetchedData?.curr_roi;
    //     let updatedInterest: number;
    //     let updatedPrinciple: number;
    //     let updatedTotalAmount: number;

    //     let currentPrinciple = ((creditAmt / (roi + 100)) * 100);
    //     let currentInterest = creditAmt - currentPrinciple;

    //     updatedInterest = Math.round(remainingInterest - currentInterest);
    //     updatedPrinciple = Math.round(remainingPrinciple - currentPrinciple);

    //     updatedTotalAmount = updatedInterest + updatedPrinciple;

    //     // Update state with calculated values
    //     setCurrentCreditAmtPrinciple(currentPrinciple.toString());
    //     setCurrentCreditAmtInterest(currentInterest.toString());

    //     // setRemainingTotalPrinciple(updatedPrinciple.toString());
    //     // setRemainingTotalInterest(updatedInterest.toString());
    //     // setRemainingTotalAmount(updatedTotalAmount.toString());
    // };

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

    const sendRecoveryEMI = async () => {
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
        }));


        const creds = {
            "branch_code": loginStore?.brn_code,
            "created_by": loginStore?.emp_id,
            "modified_by": loginStore?.emp_id,
            "trn_lat": location.latitude,
            "trn_long": location.longitude,
            "trn_addr": geolocationFetchedAddress,
            "tr_mode": formData.txnMode,
            "bank_name": formData?.bankName || "",
            "cheque_id": formData?.chequeId || 0,
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
        await axios.post(ADDRESSES.LOAN_RECOVERY_EMI, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
).then(res => {
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

            // navigation.goBack()
            // recoveryResponse = res?.data?.msg[0] as any


            handlePrint(res?.data?.msg)
            // setRemainingTotalOutstandingRes(res?.data?.msg[0]?.outstanding)
            // setCreditAmount(() => "")
            navigation.goBack()
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
            console.log("Some error occurred while submitting EMI.", err)
        })
        // বিঃ দ্রঃ - দোয়া করে এই রিসিটটির একটি ফটোকপি রাখবেন। 

        // console.log("JJJJJJJJJJJJJJJJJJJJ", transformedObj)
        setLoading(false)
    }

    const handlePrint = async (data: any) => {
        // let tot_amt = 0
        // console.log('dataaaaaaaaaaaaaa', data)
        // console.log("Called Printer...")
        // setLoading(true)
        // let text =
        //     `[C]SSVWS\n` +
        //     `[C]RECEIPT\n` +
        //     `[C]${data[0]?.branch_name}\n` +
        //     `[C]=====================\n` +
        //     // `[L]TXN. ID[C]:[R]${data?.tnx_id}\n` +
        //     `[L]DATE[C]:[R]${new Date(data[0]?.tnx_date).toLocaleDateString("en-GB")}\n` +
        //     // `[L]RCPT DATE[C]:[R]${new Date().toLocaleDateString("en-GB")}\n` +
        //     `[L]TIME[C]:[R]${new Date().toLocaleTimeString("en-GB")}\n` +
        //     `[L]GROUP[C]:[R]${(data[0]?.group_name as string)?.slice(0, 10)}\n` +
        //     `[L]CODE[C]:[R]${data[0]?.group_code}\n` +
        //     `[L]MODE[C]:[R]${data[0]?.tr_mode == 'B' ? 'UPI' : 'CASH'}\n`;
        // if (data[0]?.tr_mode == 'B')
        //     text +=
        //         `[L]ID[C]:[R]${data[0]?.cheque_id?.slice(-6)}\n` +

        //         // `[L]LOAN ID[C]:[R]${data?.loan_id}\n` +
        //         // `[L]MEM. CODE[C]:[R]${data?.member_code}\n` +
        //         // `[L]MEM. NAME[C]:[R]${(data?.client_name as string)?.slice(0, 10)}\n` +
        //         // `[L]PREV. BAL[C]:[R]${data?.prev_balance}\n` +
        //         // `[L]DEPOSIT[C]:[R]${data?.credit}\n` +
        //         // `[L]CURR. BAL[C]:[R]${data?.curr_balance}\n` +
        //         // `বিঃ দ্রঃ - দোয়া করে এই রশিদটির একটি ফটোকপি রাখবেন। `+
        //         `[C]**************X*************\n` +

        //         `[L]MEMBER[C]:[R]AMOUNT\n`;

        // for (const item of data) {
        //     tot_amt += item.credit
        //     text += `[L]${item?.client_name?.slice(0, 10)}[C]:[R]${+item?.credit}\n`
        // }
        // text +=
        //     `[L]TOTAL[C]:[R]${tot_amt}\n` +
        //     `[L]OUTSTANDING[C]:[R]${data[0]?.outstanding}\n` +
        //     `[L]COLLECTOR[C]:[R]${data[0]?.collec_name}\n` +
        //     `[L]CODE[C]:[R]${data[0]?.collec_code}\n` +
        //     `[C]================================\n` +
        //     `[C]HELPLINE: ${CONSTANTS.helplineNumeber}\n` +
        //     // `[C]\n<img>file:///android_asset/msg.png</img>\n\n`+
        //     `[C]================X===============\n` +
        //     `[C]                                \n`;
        // // `[L]BRANCH[C]:[R]\n` +
        // await ThermalPrinterModule.printBluetooth({
        //     payload: text,
        //     printerNbrCharactersPerLine: 32,
        //     // printerNbrCharactersPerLine: ,
        //     printerDpi: 120,
        //     printerWidthMM: 58,
        //     mmFeedPaper: 25,
        // }).then(res => {
        //     console.log("RES", res)
        // }).catch(err => {
        //     console.log("ERR", err)
        // })

        // console.log("Called Printer...2")
        // setLoading(false)





        ////////////////////////////////////////////
        ////////////////////////////////////////////
        ////////////////////////////////////////////

        // 12 1 19


        try {
            let tot_amt = 0
            console.log('dataaaaaaaaaaaaaa', data)
            console.log("Called Printer...")
            setLoading(true)

            let columnSingleRow = [32]
            let columnWidths = [12, 1, 19]

            // await BluetoothEscposPrinter.printText(
            //     "SSVWS\r\n",
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`SSVWS`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`RECEIPT`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     "RECEIPT\r\n",
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`${data[0]?.branch_name}`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `${data[0]?.branch_name}\r\n`,
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`======================`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `======================\r\n`,
            //     { align: "center" },
            // )

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['DATE', ":", `${new Date(data[0]?.tnx_date).toLocaleDateString("en-GB")}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['TIME', ":", `${new Date().toLocaleTimeString("en-GB")}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['GROUP', ":", `${(data[0]?.group_name as string)?.slice(0, 10)}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['CODE', ":", `${data[0]?.group_code}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['MODE', ":", `${data[0]?.tr_mode == 'B' ? 'UPI' : 'CASH'}`],
                {},
            );

            if (data[0]?.tr_mode == 'B') {
                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ['ID', ":", `${data[0]?.cheque_id?.slice(-6)}`],
                    {},
                );
                await BluetoothEscposPrinter.printText(
                    `**************X*************\r\n`,
                    { align: "center" },
                );
                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    ['MEMBER', ":", `AMOUNT`],
                    {},
                );
            }

            for (const item of data) {
                console.log("===========++++++++++++++++>>>>>>>>>>>", data)
                tot_amt += item.credit
                await BluetoothEscposPrinter.printColumn(
                    columnWidths,
                    [
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.CENTER,
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [`${item?.client_name?.slice(0, 10)}`, ":", `${+item?.credit}`],
                    {},
                );
            }

            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['TOTAL', ":", `${tot_amt}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['OUTSTANDING', ":", `${data[0]?.outstanding}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['COLLECTOR', ":", `${data[0]?.collec_name}`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['CODE', ":", `${data[0]?.collec_code}`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `======================\r\n`,
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`======================`],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['HELPLINE', ":", `${CONSTANTS.helplineNumeber}`],
                {},
            );
            // await BluetoothEscposPrinter.printText(
            //     `===========X==========\r\n\r\n\r\n`,
            //     { align: "center" },
            // )
            await BluetoothEscposPrinter.printColumn(
                columnSingleRow,
                [BluetoothEscposPrinter.ALIGN.CENTER],
                [`===========X==========`],
                {},
            );
            await BluetoothEscposPrinter.printText(
                `\r\n\r\n`,
                { align: "center" },
            )

            console.log("Called Printer...2")
            setLoading(false)
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    // const handlePrint = async (data: any) => {
    //     let tot_amt = 0
    //     console.log('dataaaaaaaaaaaaaa', data)
    //     console.log("Called Printer...")
    //     setLoading(true)
    //     let text =
    //         `[C]SSVWS\n` +
    //         `[C]RECEIPT\n` +
    //         `[C]${data[0]?.branch_name}\n` +
    //         `[C]=====================\n` +
    //         // `[L]TXN. ID[C]:[R]${data?.tnx_id}\n` +
    //         `[L]DATE[C]:[R]${new Date(data[0]?.tnx_date).toLocaleDateString("en-GB")}\n` +
    //         // `[L]RCPT DATE[C]:[R]${new Date().toLocaleDateString("en-GB")}\n` +
    //         `[L]TIME[C]:[R]${new Date().toLocaleTimeString("en-GB")}\n` +
    //         `[L]GROUP[C]:[R]${(data[0]?.group_name as string)?.slice(0, 10)}\n` +
    //         `[L]CODE[C]:[R]${data[0]?.group_code}\n` +
    //         `[L]MODE[C]:[R]${data[0]?.tr_mode == 'B' ? 'UPI' : 'CASH'}\n`;
    //     if (data[0]?.tr_mode == 'B')
    //         text +=
    //             `[L]ID[C]:[R]${data[0]?.cheque_id?.slice(-6)}\n` +

    //             // `[L]LOAN ID[C]:[R]${data?.loan_id}\n` +
    //             // `[L]MEM. CODE[C]:[R]${data?.member_code}\n` +
    //             // `[L]MEM. NAME[C]:[R]${(data?.client_name as string)?.slice(0, 10)}\n` +
    //             // `[L]PREV. BAL[C]:[R]${data?.prev_balance}\n` +
    //             // `[L]DEPOSIT[C]:[R]${data?.credit}\n` +
    //             // `[L]CURR. BAL[C]:[R]${data?.curr_balance}\n` +
    //             // `বিঃ দ্রঃ - দোয়া করে এই রশিদটির একটি ফটোকপি রাখবেন। `+
    //             `[C]**************X*************\n` +

    //             `[L]MEMBER[C]:[R]AMOUNT\n`;

    //     for (const item of data) {
    //         tot_amt += item.credit
    //         text += `[L]${item?.client_name?.slice(0, 10)}[C]:[R]${+item?.credit}\n`
    //     }
    //     text +=
    //         `[L]TOTAL[C]:[R]${tot_amt}\n` +
    //         `[L]OUTSTANDING[C]:[R]${data[0]?.outstanding}\n` +
    //         `[L]COLLECTOR[C]:[R]${data[0]?.collec_name}\n` +
    //         `[L]CODE[C]:[R]${data[0]?.collec_code}\n` +
    //         `[C]================================\n` +
    //         `[C]HELPLINE: ${CONSTANTS.helplineNumeber}\n` +
    //         // `[C]\n<img>file:///android_asset/msg.png</img>\n\n`+
    //         `[C]================X===============\n` +
    //         `[C]                                \n`;
    //     // `[L]BRANCH[C]:[R]\n` +
    //     await ThermalPrinterModule.printBluetooth({
    //         payload: text,
    //         printerNbrCharactersPerLine: 32,
    //         // printerNbrCharactersPerLine: ,
    //         printerDpi: 120,
    //         printerWidthMM: 58,
    //         mmFeedPaper: 25,
    //     }).then(res => {
    //         console.log("RES", res)
    //     }).catch(err => {
    //         console.log("ERR", err)
    //     })

    //     console.log("Called Printer...2")
    //     setLoading(false)
    // }

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

                    {
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
                                    {/* CHOOSE DOB: {formData.dob?.toLocaleDateString("en-GB")} */}
                                    TXN. DATE: {formData.chequeDate?.toLocaleDateString("en-GB")}
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
                        // maximumDate={new Date()}
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

                        }} loading={loading} disabled={loading || memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0) === 0 || memberDetailsArray.filter((item, _) => +item.credit > (+item.prn_amt + +item.intt_amt)).length > 0}>
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