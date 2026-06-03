import React, { useCallback, useContext, useEffect, useState } from 'react'

import { StyleSheet, SafeAreaView, View, ScrollView, RefreshControl, ToastAndroid, Alert, Linking, BackHandler } from 'react-native'
import { Icon, IconButton, MD2Colors, Text } from "react-native-paper"
import RNRestart from 'react-native-restart'
import { usePaperColorScheme } from '../theme/theme'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import HeadingComp from "../components/HeadingComp"
import ListCard from "../components/ListCard"
import { branchStorage, loginStorage } from '../storage/appStorage'
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
import DatePicker from 'react-native-date-picker'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { formattedDate, formattedDateTime } from '../utils/dateFormatter'
import LoadingOverlay from '../components/LoadingOverlay'
import RadioComp from '../components/RadioComp'
import AnimatedFABPaper from "../components/AnimatedFABPaper"
import navigationRoutes from '../routes/routes'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
// import SlideButton from 'rn-slide-button'
import ButtonPaper from '../components/ButtonPaper'
import useGeoLocation from '../hooks/useGeoLocation'
import DeviceInfo from 'react-native-device-info'
import { AppStore } from '../context/AppContext'
import useCurrentRouteName from '../hooks/useCurrentRoute'
import useCheckOpenCloseDate from '../components/useCheckOpenCloseDate'
import { PermissionsAndroid, Platform } from 'react-native';

import GetLocation from 'react-native-get-location';

const statusDataRadio = [
  { label: "Today", value: "T" },
  { label: "Monthly", value: "M" },
];

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const currentRoute = useCurrentRouteName()
    // const appVersion = DeviceInfo.getVersion()
    const {
        fetchCurrentVersion,
    } = useContext<any>(AppStore)
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    // const branchStrore = JSON.parse(branchStorage?.getString("branch-data") ?? "")
    // const [isLocationMocked, setIsLocationMocked] = useState(() => false)
    const [branchAssign, setBranchAssign] = useState(loginStore?.branch_name ?? "")
    
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")
    const { handleLogout } = useContext<any>(AppStore)
    const [refreshing, setRefreshing] = useState(() => false)
    const [loading, setLoading] = useState(() => false)

    const [currentTime, setCurrentTime] = useState(new Date());

    const [noOfGrtForms, setNoOfGrtForms] = useState(() => "")
    const [totalCashRecovery, setTotalCashRecovery] = useState(() => "")
    const [totalBankRecovery, setTotalBankRecovery] = useState(() => "")
    const [totalDisbursement, setTotalDisbursement] = useState(() => "")

    const [checkUser, setCheckUser] = useState(() => "O")
    const [statusOfData, setStatusOfData] = useState(() => "T")

    const [openDate2, setOpenDate2] = useState(false)
    const [choosenDate, setChoosenDate] = useState(new Date())
    const formattedChoosenDate = formattedDate(choosenDate)

    const [isExtended, setIsExtended] = useState<boolean>(() => true)
    const [isClockedIn, setIsClockedIn] = useState<boolean>(() => false)
    const [clockedInDateTime, setClockedInDateTime] = useState(() => "")
    const [clockedInFetchedAddress, setClockedInFetchedAddress] = useState(() => "")
    const [clockInStatus, setClockInStatus] = useState<string>(() => "")
    const [checkIsAttandanceStatusPending, setAttanadanceStatusPending] = useState<boolean>(() => true)
    // const [openDtCloseDt, setOpenDtCloseDt] = useState(null)


    useEffect(() => {
        fetchCurrentVersion()
        console.log('home',loginStore?.token)
    }, [navigation])

    

    
    const { location, error, fetchLocation  } = useGeoLocation()


    const fetchLocation_ = async () => {
            try {
                const currentLocation = await GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 60000,
                });
                // setLocation({
                //     latitude: currentLocation.latitude,
                //     longitude: currentLocation.longitude,
                // });

                console.log('successssssss', currentLocation.latitude, currentLocation.longitude);
            } catch (err) {
                console.log(err.message, 'errorerrore');
                // setError(err.message);
                Alert.alert("Turn on Geolocation", "Give access to Location or Turn on GPS from app settings.", [{
                text: "Go to Settings",
                onPress: () => { navigation.dispatch(CommonActions.goBack()); Linking.openSettings() }
                }])

            }
        };

    useEffect(() => {
    if (isFocused) {
        fetchLocation_(); 
    }
    }, [isFocused]);

    // Old Function 
    // useEffect(() => {
    //     console.log(error, 'successssssss__home', location);
    //     // if (error) {
    //     if (!location?.latitude && !location?.longitude) {
    //         Alert.alert("Turn on Geolocation", "Give access to Location or Turn on GPS from app settings.", [{
    //             text: "Go to Settings",
    //             onPress: () => { navigation.dispatch(CommonActions.goBack()); Linking.openSettings() }
    //         }])
    //     }
    // }, [isFocused, error])


    const fetchGeoLocaltionAddress = async () => {
        console.log("REVERSE GEO ENCODING API CALLING...")
        await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyDdA5VPRPZXt3IiE3zP15pet1Nn200CRzg`).then(res => {
            console.log("REVERSE GEO ENCODING RES =============", res?.data?.results[0])
            setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        })

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


        // fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${location?.latitude},${location?.longitude}&api_key=DYdFc2y563IaPHDz5VCisFGjsspC6rkeIVHzg96e`,{
        //     headers:{
        //         'Content-Type':'application/json',
        //     }
        // })
        // .then(async (res) =>{
        //     const data = await res.json();
        //     console.log('location ============================================',data,'abar location ======================================================',data?.results[0]?.formatted_address);
        //     setGeolocationFetchedAddress(data?.results[0]?.formatted_address)
        // }).catch(err =>{
        //     console.error('Error fetching Ola Maps:', err?.message);
        // })
    }

    // useEffect(() => {
    //     if (location?.latitude && location.longitude) {
    //         fetchGeoLocaltionAddress()
    //     }
    // }, [location])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        RNRestart.Restart()
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        handleRefresh()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    const handleClockIn = async () => {
        setAttanadanceStatusPending(true);
        const check = { emp_id: loginStore?.emp_id, }
        await axios.post(`${ADDRESSES.FETCH_EMP_LOGGED_DTLS}`, check,{
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then((res_dtls) => {
            console.log("CLOCK IN DTLS", res_dtls?.data)
            if (res_dtls?.data?.suc === 0) {
                handleLogout()
            }
            else{
            if (res_dtls?.data?.fetch_emp_logged_dt?.msg[0]?.clock_status !== "O") {
                axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyDdA5VPRPZXt3IiE3zP15pet1Nn200CRzg`)
                    .then(res => {
                        const creds = {
                            emp_id: loginStore?.emp_id,
                            in_date_time: formattedDateTime(currentTime),
                            in_lat: location?.latitude,
                            in_long: location?.longitude,
                            in_addr: res?.data?.results[0]?.formatted_address,
                            created_by: loginStore?.emp_id
                        }
                        axios.post(`${ADDRESSES.CLOCK_IN}`, creds,{
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
                            console.log("CLOCK IN RES", res?.data)
                            setIsClockedIn(!isClockedIn)
                        }).catch(err => {
                            console.log("CLOCK IN ERR", err)
                        }).finally(() => {
                            setAttanadanceStatusPending(false);
                        })
                    }).catch(err => {
                        setAttanadanceStatusPending(false);
                        Alert.alert("WARNING", `Unable to fetch location. Please try agian after some time`, [
                            { "text": "OK", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" }
                        ])
                    })
            }
            else {
                setAttanadanceStatusPending(false);
                Alert.alert("Clock In", `${res_dtls?.data?.msg}`, [
                    { "text": "OK", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" }
                ])
            }
        }
        }).catch(err => {
            console.log("CLOCK IN ERR", err);
            setAttanadanceStatusPending(false);
        })

    }


    /**** NEW VERSION (DONE BY SUMAN MITRA) */
    const handleClockOut = async () => {
        setAttanadanceStatusPending(true);
        await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyDdA5VPRPZXt3IiE3zP15pet1Nn200CRzg`)
            .then(res => {
                const creds = {
                    emp_id: loginStore?.emp_id,
                    in_date_time: formattedDateTime(new Date(clockedInDateTime)),
                    out_date_time: formattedDateTime(currentTime),
                    out_lat: location?.latitude,
                    out_long: location?.longitude,
                    out_addr: res?.data?.results[0]?.formatted_address,
                    modified_by: loginStore?.emp_id
                }
                axios.post(`${ADDRESSES.CLOCK_OUT}`, creds,{
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
                    // console.log("CLOCK OUT RES", res?.data)
                    setIsClockedIn(!isClockedIn);
                    // setAttanadanceStatusPending(false);
                }).catch(err => {
                    // setAttanadanceStatusPending(false);
                    Alert.alert("WARNING", `Unable to process your request right now. Please try agian after some time`, [
                        { "text": "OK", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" }
                    ])
                }).finally(() => {
                    setAttanadanceStatusPending(false);
                })
            }).catch(err => {
                setAttanadanceStatusPending(false);
                Alert.alert("WARNING", `Unable to fetch location. Please try agian after some time`, [
                    { "text": "OK", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" }
                ])
            })

    }
    /*** END */

    const fetchClockedInDateTime = async () => {
        const creds = {
            emp_id: loginStore?.emp_id,

        }
        await axios.post(`${ADDRESSES.CLOCKED_IN_DATE_TIME}`, creds,{
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            // console.log("CLOCK IN RES", res?.data)
            setAttanadanceStatusPending(false);
            // console.log(res?.data?.msg?.length)
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            if (res?.data?.msg?.length === 0) {
                setIsClockedIn(false)
                return
            }
            console.log("CLOCK IN RES================", res?.data)
            // console.log(formattedDateTime(res?.data?.msg[0]?.in_date_time));
            console.log("asasdads == ++ === " + formattedDateTime(new Date(res?.data?.msg[0]?.in_date_time)))
            setClockedInDateTime(res?.data?.msg[0]?.in_date_time)
            setClockedInFetchedAddress(res?.data?.msg[0]?.in_addr)
            setClockInStatus(res?.data?.msg[0]?.clock_status);
        }).catch(err => {
            console.log("CLOCK IN ERR", err);
            setAttanadanceStatusPending(false);
        })
    }


    // const useCheckOpenCloseDate = async () => {
    //     const creds = {
    //         branch_code: loginStore?.brn_code,

    //     }

        

    //     // return
        
    //     await axios.post(`${ADDRESSES.CHECK_BRN_OPEN_CLOSE}`, creds,{
    //         headers: {
    //             Authorization: loginStore?.token, // example header
    //             "Content-Type": "application/json", // optional
    //         }
    //     }).then(res => {
    //         // console.log("CLOCK IN RES", res?.data)
    //         // setAttanadanceStatusPending(false);
    //         // console.log(res?.data?.msg?.length)
    //         // if(res?.data?.suc === 0) {
    //         //     handleLogout()
    //         // }

    //         // if (res?.data?.msg?.length === 0) {
    //         //     setIsClockedIn(false)
    //         //     return
    //         // }

    //         console.log(creds, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhh', res?.data);

    //         // if (res?.data?.msg?.length === 0) {
    //         if (res?.data?.end_flag === "C") {
	// 			// localStorage.setItem("pendingApprove", "yes")
    //             loginStorage.set("pendingApprove", JSON.stringify('yes'));
	// 			setOpenDtCloseDt(res?.data?.end_flag)
	// 		}
    //         // }

    //         // console.log("CLOCK IN RES================", res?.data)
    //         // // console.log(formattedDateTime(res?.data?.msg[0]?.in_date_time));
    //         // console.log("asasdads == ++ === " + formattedDateTime(new Date(res?.data?.msg[0]?.in_date_time)))
    //         // setClockedInDateTime(res?.data?.msg[0]?.in_date_time)
    //         // setClockedInFetchedAddress(res?.data?.msg[0]?.in_addr)
    //         // setClockInStatus(res?.data?.msg[0]?.clock_status);
    //     }).catch(err => {
    //         console.log("CLOCK IN ERR", err);
    //         // setAttanadanceStatusPending(false);
    //     })
    // }

    // useEffect(() => {
    //     // console.log(loginStore?.id, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhh 1 22');
    //     useCheckOpenCloseDate()
    // }, [])

    const { checkOpenCloseDate, openDtCloseDt } =	useCheckOpenCloseDate(loginStore)

	useEffect(() => {
		checkOpenCloseDate()
	}, [checkOpenCloseDate])


    useEffect(() => {
        
        fetchClockedInDateTime()
    }, [isClockedIn])

    const fetchDashboardDetails = async () => {
        // setLoading(true)
        const creds = {
            day_type: statusOfData,
            emp_id: loginStore?.emp_id,
            branch_code: loginStore?.brn_code,
            datetime: formattedChoosenDate
        }

        await axios.post(`${ADDRESSES.DASHBOARD_DETAILS}`, creds,{
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json" // optional
            }
        }).then(res => {
            console.log(">>>>>>>D<<<<<<<", res?.data, 'ggggg', loginStore)
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            else{
            setNoOfGrtForms(res?.data?.msg[0]?.no_of_grt)
            }
        }).catch(err => {
            console.log("ERRRRR<<<<<D", err)
        })
        // setLoading(false)
    }

    const fetchDashboardCashRecoveryDetails = async () => {
        // setLoading(true)
        const creds = {
            "day_type": statusOfData,
            "branch_code": loginStore?.brn_code,
            "tr_mode": "C",
            "datetime": formattedChoosenDate,
            "created_by": loginStore?.emp_id,

        }
        // console.log("CREDSSS C", creds)
        await axios.post(`${ADDRESSES.DASHBOARD_CASH_RECOV_DETAILS}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            console.log(">>>>>>>C<<<<<<<", res?.data)
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            else{
            setTotalCashRecovery(res?.data?.msg[0]?.tot_recov_cash)
            }
        }).catch(err => {
            console.log("ERRRRR<<<<<C", err)
        })
        // setLoading(false)
    }

    const fetchDashboardBankRecoveryDetails = async () => {
        // setLoading(true)
        const creds = {
            "day_type": statusOfData,
            "branch_code": loginStore?.brn_code,
            "tr_mode": "B",
            "datetime": formattedChoosenDate,
            "emp_id": loginStore?.emp_id
        }
       
        console.log("CREDSSS B", creds)
        await axios.post(`${ADDRESSES.DASHBOARD_BANK_RECOV_DETAILS}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            console.log(">>>>>>>B<<<<<<<", res?.data)
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            else{
            setTotalBankRecovery(res?.data?.msg[0]?.tot_recov_bank)
            }
        }).catch(err => {
            console.log("ERRRRR<<<<<B", err)
        })
        // setLoading(false)
    }

    const fetchDashboardDisburseDetails = async () => {
        // setLoading(true)
        const creds = {
            "day_type": statusOfData,
            "branch_code": loginStore?.brn_code,
            "emp_id": loginStore?.emp_id,
            // "tr_mode": "B",
            "datetime": formattedChoosenDate,
            
        }
       
        await axios.post(`${ADDRESSES.DASHBOARD_DISBURSE_DETAILS_CO}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            console.log(">>>>>>>B<<<<<<<", res?.data)
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            else{
                // console.log(res?.data?.msg[0], 'gggggggggggggggggggggggg');
                
            setTotalDisbursement(res?.data?.msg[0]?.tot_disburse)
            }
        }).catch(err => {
            console.log("ERRRRR<<<<<B", err)
        })
        // setLoading(false)
    }

    

    useEffect(() => {
        
        // console.log(loginStore?.id, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhh 1 2');
        if(isFocused){
        if (loginStore?.id === 1) { // CO
            fetchDashboardDetails()
            fetchDashboardCashRecoveryDetails()
            fetchDashboardBankRecoveryDetails()
            fetchDashboardDisburseDetails()
            }
        }
    }, [isFocused, statusOfData])

    const handleFetchDashboardDetailsGRTBM = async () => {
        const creds = {
            flag: checkUser,
            emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            datetime: formattedChoosenDate,
            branch_code: loginStore?.brn_code
        }
        await axios.post(`${ADDRESSES.DASHBOARD_DETAILS_BM}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            if(res?.data?.suc === 0) {
                handleLogout()
            }   
            else{
            setNoOfGrtForms(res?.data?.msg[0]?.no_of_grt)
            }
            console.log("----====----", res?.data)
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching dashboard details BM 1.", ToastAndroid.SHORT)
            console.log("Some Errr", err)
        })
    }

    const handleFetchDashboardCashDetailsBM = async () => {
        const creds = {
            flag: checkUser,
            emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            tr_mode: "C",
            datetime: formattedChoosenDate,
            branch_code: loginStore?.brn_code
        }
        await axios.post(`${ADDRESSES.DASHBOARD_CASH_DETAILS_BM}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            else{
            setTotalCashRecovery(res?.data?.msg[0]?.tot_recov_cash)
            console.log("----====----CC", res?.data)
            }
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching dashboard details BM 2.", ToastAndroid.SHORT)
            console.log("Some Errr", err)
        })
    }

    const handleFetchDashboardBankDetailsBM = async () => {
        const creds = {
            flag: checkUser,
            emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            tr_mode: "B",
            datetime: formattedChoosenDate,
            branch_code: loginStore?.brn_code
        }
        await axios.post(`${ADDRESSES.DASHBOARD_BANK_DETAILS_BM}`,creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            else{
            setTotalBankRecovery(res?.data?.msg[0]?.tot_recov_bank)
            }
            console.log("----====----BB", res?.data)
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching dashboard details BM3.", ToastAndroid.SHORT)
            console.log("Some Errr", err)
        })
    }

    const handleFetchDashboardDisburseDetailsBM = async () => {
        const creds_O = {
            flag: checkUser,
            branch_code: loginStore?.brn_code,
            emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            datetime: formattedChoosenDate,
        }

        const creds_A = {
            flag: checkUser,
            branch_code: loginStore?.brn_code,
            // emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
            datetime: formattedChoosenDate,
        }

        // {
        // "flag" : "O",
        // "branch_code" : "113",
        // "emp_id" : "10007",
        // "datetime" : "2026-05-05"
        // }
        // {
        // "flag" : "A",
        // "branch_code" : "113",
        // "datetime" : "2026-05-05"
        // }

        await axios.post(`${ADDRESSES.DASHBOARD_DISBURSE_DETAILS_BM}`, checkUser === "O" ? creds_O : creds_A , {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }).then(res => {
            if(res?.data?.suc === 0) {
                handleLogout()
            }
            else{
            console.log(res?.data?.msg[0], 'gggggggggggggggggg', creds_O, creds_A);
            
            setTotalDisbursement(res?.data?.msg[0]?.tot_disburse)
            }
            console.log("----====----BB", res?.data)
        }).catch(err => {
            ToastAndroid.show("Some error occurred while fetching dashboard details BM3.", ToastAndroid.SHORT)
            console.log("Some Errr", err)
        })
    }

    useEffect(() => {
        // console.log(loginStore?.id, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhh 2 22');
        if(isFocused){
        if (loginStore?.id === 2) { // BM
            handleFetchDashboardDetailsGRTBM()
            handleFetchDashboardCashDetailsBM()
            handleFetchDashboardBankDetailsBM()
            handleFetchDashboardDisburseDetailsBM()
            }
        }
    }, [checkUser, isFocused])

    return (
        <SafeAreaView>
            {/* <ActivityIndicator size={'large'} /> */}
            {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{
                    backgroundColor: theme.colors.background,
                    // minHeight: SCREEN_HEIGHT,
                    // height: "auto",
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            // onScroll={onScroll}
            >
                {/* <HeadingComp title={`Hi, ${(loginStore?.emp_name as string)?.split(" ")[0]}`}
                 subtitle={`Welcome back, ${loginStore?.id === 1 ? "Branch User" : loginStore?.id === 2 ? "Branch Admin" : loginStore?.id === 3 ? "MIS Assistant" : "Administrator"}!`} 
                 background={MD2Colors.blue100} 
                 footerText={`Branch • ${branchAssign}`} /> */}
                <HeadingComp title={`Hi, ${(loginStore?.emp_name as string)?.split(" ")[0]}`}
                    subtitle={`Welcome back, ${loginStore?.id === 1 ? "Branch User" : loginStore?.id === 2 ? "Branch Admin" : loginStore?.id === 3 ? "MIS Assistant" : "Administrator"}!`}
                    background={MD2Colors.blue100}
                    footerText={`Branch • ${loginStore?.branch_name}`} />
                    
                    <View style={{
                    // paddingHorizontal: 20,
                    // paddingBottom: 120,
                    // gap: 8
                    width: SCREEN_WIDTH,
                    // justifyContent: "center",
                    alignItems: "center",
                    // minHeight: SCREEN_HEIGHT,
                    height: "auto",
                }}>
                    <View style={{
                        backgroundColor: MD2Colors.grey800,
                        width: SCREEN_WIDTH / 1.1,
                        height: "auto",
                        marginBottom: 10,
                        // borderTopRightRadius: 30,
                        // borderBottomLeftRadius: 30,
                        borderRadius:10,
                        padding: 10,
                        gap: 10,
                    }}>
                    <View style={{
                            height: "auto",
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            borderRadius: 5,
                            // borderBottomRightRadius: 0,
                            // borderBottomLeftRadius: 0,
                            alignItems: "center",
                            // paddingHorizontal: 15,
                            padding: 10,
                            // flexDirection: "row-reverse",
                            justifyContent: "space-between",
                            // gap: 15
                        }}>
                    <View>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`DATE & TIME:`} {`${choosenDate.toLocaleDateString("en-GB")} ${currentTime.toLocaleTimeString("en-GB")}`}</Text>
                                {/* <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`${choosenDate.toLocaleDateString("en-GB")} ${currentTime.toLocaleTimeString("en-GB")}`}</Text> */}
                            </View>
                            </View>
                            </View>
                            </View>

                <View style={{
                    // paddingHorizontal: 20,
                    // paddingBottom: 120,
                    // gap: 8
                    width: SCREEN_WIDTH,
                    // justifyContent: "center",
                    alignItems: "center",
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                }}>

                    {clockInStatus === "O" || clockInStatus === "E" || !clockInStatus ? <View style={{
                        backgroundColor: MD2Colors.green50,
                        width: SCREEN_WIDTH / 1.1,
                        height: "auto",
                        marginBottom: 10,
                        borderTopRightRadius: 30,
                        borderBottomLeftRadius: 30,
                        padding: 15,
                        gap: 10,
                        // flexDirection: "row",
                        // justifyContent: "space-between",
                    }}>
                        <ButtonPaper
                            icon={"clock-outline"}
                            onPress={
                                () => {
                                    // !geolocationFetchedAddress && fetchGeoLocaltionAddress()
                                    Alert.alert("Clock In", `Are you sure you want to Clock In?\nTime: ${currentTime.toLocaleTimeString("en-GB")}`, [
                                        { "text": "Cancel", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" },
                                        { "text": "CLOCK IN", "onPress": async () => await handleClockIn() }
                                    ])
                                }
                            }
                            mode='elevated'
                            buttonColor={MD2Colors.green600}
                            textColor={MD2Colors.green50}
                            style={{
                                borderRadius: 0,
                                borderTopRightRadius: 15,
                                borderBottomLeftRadius: 15,
                                padding: 5,
                            }}
                            loading={checkIsAttandanceStatusPending}
                            disabled={checkIsAttandanceStatusPending}>
                            {!checkIsAttandanceStatusPending && "Clock In"}
                        </ButtonPaper>

                        {/* <ButtonPaper
                            mode='text'
                            onPress={() => navigation.dispatch(
                                CommonActions.navigate(navigationRoutes.attendanceReportScreen)
                            )}
                            textColor={MD2Colors.green600}
                            icon={"timetable"}
                            style={{
                                borderWidth: 1,
                                borderColor: MD2Colors.green900,
                                borderStyle: "dashed",
                                borderRadius: 15,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 0,
                                marginTop: 5,
                                justifyContent: "center",
                            }}>Report</ButtonPaper> */}
                    </View>
                        : <View style={{
                            backgroundColor: MD2Colors.pink50,
                            width: SCREEN_WIDTH / 1.1,
                            height: "auto",
                            marginBottom: 10,
                            borderTopRightRadius: 30,
                            borderBottomLeftRadius: 30,
                            padding: 15,
                            gap: 10,
                        }}>
                            {/* <ButtonPaper
                                icon={"clock-out"}
                                onPress={
                                    () => Alert.alert("Clock Out", `Are you sure you want to Clock Out?\nTime: ${currentTime.toLocaleTimeString("en-GB")}`, [
                                        { "text": "Cancel", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" },
                                        { "text": "CLOCK OUT", "onPress": async () => await handleClockOut() }
                                    ])
                                }
                                mode='elevated'
                                buttonColor={MD2Colors.pink600}
                                textColor={MD2Colors.pink50}
                                style={{
                                    borderRadius: 0,
                                    borderTopRightRadius: 15,
                                    borderBottomLeftRadius: 15,
                                }}
                                disabled={!geolocationFetchedAddress}>Clock Out</ButtonPaper> */}

                            <ButtonPaper
                                icon={"clock-out"}
                                onPress={
                                    () => Alert.alert("Clock Out", `Are you sure you want to Clock Out?\nTime: ${currentTime.toLocaleTimeString("en-GB")}`, [
                                        { "text": "Cancel", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" },
                                        { "text": "CLOCK OUT", "onPress": async () => await handleClockOut() }
                                    ])
                                }
                                mode='elevated'
                                buttonColor={MD2Colors.pink600}
                                textColor={MD2Colors.pink50}
                                style={{
                                    borderRadius: 0,
                                    borderTopRightRadius: 15,
                                    borderBottomLeftRadius: 15,
                                }}
                                loading={checkIsAttandanceStatusPending}
                                disabled={checkIsAttandanceStatusPending}
                            >{!checkIsAttandanceStatusPending && "Clock Out"}</ButtonPaper>
                            <View style={{
                                // dashed border outside inside text
                                borderWidth: 1,
                                borderColor: MD2Colors.pink900,
                                borderStyle: "dashed",
                                borderRadius: 15,
                                borderTopLeftRadius: 0,
                                borderTopRightRadius: 0,
                                padding: 10,
                                marginTop: 5,
                                justifyContent: "center",
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 10
                                }}>
                                    <Icon source={"clock-in"} size={20} color={MD2Colors.pink900} />
                                    <Text variant='bodyLarge' style={{
                                        color: MD2Colors.pink900
                                    }}>{new Date(clockedInDateTime).toLocaleTimeString("en-GB")}</Text>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 10,
                                }}>
                                    <Icon source={"map-marker-outline"} size={20} color={MD2Colors.pink900} />
                                    <Text variant='bodyLarge' style={{
                                        color: MD2Colors.pink900,
                                    }}>
                                        {clockedInFetchedAddress?.length > 10 ? `${clockedInFetchedAddress?.substring(0, 30)}...` : clockedInFetchedAddress}
                                    </Text>
                                </View>

                            </View>

                            {/* <ButtonPaper
                                mode='text'
                                onPress={() => navigation.dispatch(
                                    CommonActions.navigate(navigationRoutes.attendanceReportScreen)
                                )}
                                textColor={MD2Colors.pink600}
                                icon={"timetable"}
                                style={{
                                    borderWidth: 1,
                                    borderColor: MD2Colors.pink900,
                                    borderStyle: "dashed",
                                    borderRadius: 15,
                                    borderTopLeftRadius: 15,
                                    borderTopRightRadius: 0,
                                    marginTop: 5,
                                    justifyContent: "center",
                                }}>Report</ButtonPaper> */}
                        </View>}


                    {/* <Text variant='bodyLarge'>{JSON.stringify(loginStore)}</Text> */}

                    {/* Dashboard Starts From Here... */}
                    
                    {loginStore?.id === 1 &&(
                    <View style={{
                        backgroundColor: MD2Colors.lightBlue600,
                        width: SCREEN_WIDTH / 1.1,
                        height: "auto",
                        marginBottom: 10,
                        borderRadius:10,
                        // borderTopRightRadius: 30,
                        // borderBottomLeftRadius: 30,
                        padding: 10,
                        gap: 10,
                    }}>
                        <View>
                            <RadioComp
                            // title={statusOfData === "T" ? "Your Data" : "All User"}
                            title={"Filter: "}
                            titleColor={MD2Colors.cyan50}
                            color={MD2Colors.cyan50}
                            radioButtonColor={MD2Colors.cyan50}
                            icon="filter-variant"
                            dataArray={statusDataRadio.map(item => ({
                                optionName: item.label,
                                optionState: statusOfData,
                                currentState: item.value,
                                optionSetStateDispathFun: setStatusOfData
                            }))}
                            />
                        </View>

                        </View>
                        )}

                    <View style={{
                        backgroundColor: MD2Colors.blue50,
                        width: SCREEN_WIDTH / 1.1,
                        height: "auto",
                        marginBottom: 10,
                        borderTopRightRadius: 30,
                        borderBottomLeftRadius: 30,
                        padding: 15,
                        gap: 10,
                    }}>
                        

                        {loginStore?.id === 2 && <View>
                            <RadioComp
                                title={checkUser === "Own" ? `Your Data` : `All User`}
                                titleColor={MD2Colors.blue900}
                                color={MD2Colors.blue900}
                                radioButtonColor={MD2Colors.blue900}
                                icon="account-convert-outline"
                                dataArray={[
                                    {
                                        optionName: "OWN",
                                        optionState: checkUser,
                                        currentState: "O", // bm emp_id -> 
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                    {
                                        optionName: "BRANCH",
                                        optionState: checkUser,
                                        currentState: "A", // emp_id -> 0
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                ]}
                            />
                        </View>}
                        {/* <Text variant='bodyLarge' style={{
                            color: MD2Colors.blue900
                        }}>Branch - {loginStore?.branch_name}</Text> */}

                        {/* <View style={{
                            height: 80,
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            borderRadius: 20,
                            borderBottomRightRadius: 0,
                            borderBottomLeftRadius: 0,
                            alignItems: "center",
                            paddingHorizontal: 15,
                            flexDirection: "row-reverse",
                            justifyContent: "space-between",
                        }}>
                            <View style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                width: 53,
                                height: 53,
                                borderRadius: 150,
                                justifyContent: 'center',
                                alignItems: "center"
                            }}>
                                <IconButton icon="calendar-month-outline" iconColor={theme.colors.onTertiaryContainer} onPress={() => setOpenDate2(true)} />
                            </View>
                            <View>
                                <Icon source="arrow-left-thin" size={25} color={theme.colors.onSurface} />
                            </View>
                            <View>
                                <Text variant='titleMedium' style={{ color: theme.colors.tertiary }}>{`TXN DATE: ${loginStore?.transaction_date}`}</Text>
                            </View>
                            
                        </View>

                        <View style={{
                            height: 80,
                            width: "100%",
                            backgroundColor: theme.colors.surface,
                            borderRadius: 20,
                            borderBottomRightRadius: 0,
                            borderBottomLeftRadius: 0,
                            alignItems: "center",
                            paddingHorizontal: 15,
                            flexDirection: "row-reverse",
                            justifyContent: "space-between",
                        }}>
                            <View style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                width: 53,
                                height: 53,
                                borderRadius: 150,
                                justifyContent: 'center',
                                alignItems: "center"
                            }}>
                                <IconButton icon="calendar-month-outline" iconColor={theme.colors.onTertiaryContainer} onPress={() => setOpenDate2(true)} />
                            </View>
                            <View>
                                <Icon source="arrow-left-thin" size={25} color={theme.colors.onSurface} />
                            </View>
                            <View>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`CURRENT DATE & TIME:`}</Text>
                                <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`${choosenDate.toLocaleDateString("en-GB")} ${currentTime.toLocaleTimeString("en-GB")}`}</Text>
                            </View>
                            
                        </View> */}

                        
                        <ListCard
                            title={`Disbursements`}
                            subtitle={`${totalDisbursement || 0} /-`}
                            position={0}
                            icon='format-list-numbered'
                            iconViewColor={MD2Colors.yellow800}
                            iconViewBorderColor={MD2Colors.yellow600}
                        />

                        <ListCard
                            title={`No. of GRTs`}
                            subtitle={`${noOfGrtForms || 0} Forms`}
                            position={0}
                            icon='format-list-numbered'
                            iconViewColor={MD2Colors.green500}
                            iconViewBorderColor={MD2Colors.green200}
                        />
                        <ListCard
                            title={`Total Cash Recovery`}
                            subtitle={`Rs. ${totalCashRecovery || 0}/-`}
                            position={0}
                            icon='cash'
                            iconViewColor={MD2Colors.pink500}
                            iconViewBorderColor={MD2Colors.pink200}
                        />
                        <ListCard
                            title={`Total Bank Recovery`}
                            subtitle={`Rs. ${totalBankRecovery || 0}/-`}
                            position={-1}
                            icon='bank'
                            iconViewColor={MD2Colors.blue500}
                            iconViewBorderColor={MD2Colors.blue200}
                        />

                    </View>


                </View>
            </ScrollView>

            {/* <GestureHandlerRootView> */}
            {/* <SlideButton title="Slide To Unlock" /> */}


            {loginStore?.id === 2 && <AnimatedFABPaper
                color={theme.colors.onTertiaryContainer}
                variant="tertiary"
                icon="form-select"
                label="Pending Forms"
                disabled={openDtCloseDt === "C" ? true : false}
                onPress={() =>
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: navigationRoutes.bmPendingLoansScreen,
                        }),
                    )
                }
                extended={isExtended}
                animateFrom="left"
                iconMode="dynamic"
                customStyle={[styles.fabStyle, { backgroundColor: theme.colors.tertiaryContainer }]}
            />}
            {/* openDtCloseDt */}
            
            {loginStore?.id === 1 && <AnimatedFABPaper
                color={theme.colors.onTertiaryContainer}
                variant="tertiary"
                icon="form-select"
                label="GRT Form"
                disabled={openDtCloseDt === "C" ? true : false}
                onPress={() =>
                    navigation.dispatch(
                        CommonActions.navigate({
                            name: navigationRoutes.grtFormScreen,
                        }),
                    )
                }
                extended={isExtended}
                animateFrom="left"
                iconMode="dynamic"
                customStyle={[styles.fabStyle, { backgroundColor: theme.colors.tertiaryContainer }]}
            />}
            {/* </GestureHandlerRootView> */}

            {/* </GestureHandlerRootView> */}
        </SafeAreaView >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    fabStyle: {
        bottom: normalize(16),
        right: normalize(16),
        position: "absolute",
    },
})