import { StyleSheet, SafeAreaView, View, Alert, ToastAndroid, Linking } from 'react-native'
import { Divider, Icon, List } from "react-native-paper"
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { formattedDate } from "../../utils/dateFormatter"
import InputPaper from "../../components/InputPaper"
import ButtonPaper from "../../components/ButtonPaper"
import { usePaperColorScheme } from '../../theme/theme'
import DatePicker from "react-native-date-picker"
import MenuPaper from "../../components/MenuPaper"
import axios from "axios"
import { ADDRESSES } from '../../config/api_list'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import { loginStorage } from '../../storage/appStorage'
import LoadingOverlay from "../../components/LoadingOverlay"
import useGeoLocation from '../../hooks/useGeoLocation'
import { disableCondition } from "../../utils/disableCondition"
// import { Dropdown } from 'react-native-element-dropdown'
import { SCREEN_WIDTH } from 'react-native-normalize'

interface BMBasicDetailsFormProps {
    formNumber?: any
    branchCode?: any
    flag?: "CO" | "BM"
    approvalStatus?: "U" | "A" | "S"
    onSubmit?: any
    onUpdateDisabledChange?: (disabled: boolean) => void
}

const BMBasicDetailsForm = forwardRef(({
    formNumber,
    branchCode,
    flag = "BM",
    approvalStatus = "U",
    onSubmit = () => null,
    onUpdateDisabledChange = () => { }
}: BMBasicDetailsFormProps, ref) => {
    const theme = usePaperColorScheme()
    // 110 -> Branch Code
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")
    // console.log("****************", formNumber, branchCode, flag, approvalStatus)

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)
    const [ongoingLoanCheckFlag, setOngoingLoanCheckFlag] = useState(() => false)

    const [religions, setReligions] = useState(() => [])
    const [castes, setCastes] = useState(() => [])
    const [educations, setEducations] = useState(() => [])
    const [groupNames, setGroupNames] = useState(() => [])
    const [memberGenders, setMemberGenders] = useState(() => [])
    const [responseMemberCode, setResponseMemberCode] = useState(() => "")

    const [memberCodeShowHide, setMemberCodeShowHide] = useState(() => false)
    const [formData, setFormData] = useState({
        clientName: "",
        clientGender: "",
        clientMobile: "",
        guardianName: "",
        husbandName: "",
        nomineeName: "",
        clientEmail: "",
        guardianMobile: "",
        clientAddress: "",
        clientPin: "",
        aadhaarNumber: "",
        panNumber: "",
        voterId: "",
        religion: "",
        otherReligion: "",
        caste: "",
        otherCaste: "",
        education: "",
        otherEducation: "",
        groupCode: "",
        groupCodeName: "",
        dob: new Date(),
        grtDate: new Date(),
    })

    const [readonlyMemberId, setReadonlyMemberId] = useState(() => "")

    // const [dob, setDob] = useState(() => new Date()) //dob
    const [openDate, setOpenDate] = useState(() => false)
    const formattedDob = formattedDate(formData?.dob)

    const [openDate2, setOpenDate2] = useState(() => false)
    const formattedGrtDate = formattedDate(formData?.grtDate)

    const isToday = (someDate: Date) => {
        const today = new Date()
        return (
            someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
        )
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
        await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyDdA5VPRPZXt3IiE3zP15pet1Nn200CRzg`).then(res => {
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
        // await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyAhSuw5-ThQnJTZCGC4e_oBsL1iIUbJxts`).then(res => {
        //     setGeolocationFetchedAddress(res?.data?.results[0]?.formatted_address)
        // })
    }

    //! IMP: Temporarily stopped for debug mode, enable on production
    useEffect(() => {
        //  console.log(approvalStatus, 'APPROVAL STATUS');    
        if (location?.latitude && location.longitude && approvalStatus === "U") {
            // fetchGeoLocaltionAddress()
        }
    }, [location])

    useEffect(() => {
        setMemberGenders([])
        setMemberGenders(prev => [
            ...prev,
            { title: "Male", func: () => handleFormChange("clientGender", "M") },
            { title: "Female", func: () => handleFormChange("clientGender", "F") },
            { title: "Others", func: () => handleFormChange("clientGender", "O") }
        ])
    }, [])

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // const handleFetchGroupNames = async () => {
    //     setLoading(true)
    //     setGroupNames(() => [])
    //     await axios.get(`${ADDRESSES.GROUP_NAMES}?branch_code=${loginStore?.brn_code}`).then(res => {
    //         // setGroupNamesAndCodesTemp(res?.data?.msg)
    //         console.log("XXXXXXXXXXXXXXXXXX", res?.data?.msg)

    //         res?.data?.msg?.map((item, i) => {
    //             return (
    //                 //@ts-ignore
    //                 setGroupNames(prev => [...prev, { title: item?.group_name, func: () => { handleFormChange("groupCode", item?.group_code); handleFormChange("groupCodeName", item?.group_name) } }])
    //             )
    //         })

    //     }).catch(err => {
    //         ToastAndroid.show("Some error occurred {handleFetchGroupNames}!", ToastAndroid.SHORT)
    //     })
    //     setLoading(false)
    // }

    const handleFetchGroupNames = async () => {
        setLoading(true);
        setGroupNames(() => []);
        try {
            const response = await axios.get(`${ADDRESSES.GROUP_NAMES}?branch_code=${loginStore?.brn_code}`);
            // const groupNames = response?.data?.msg?.map((item) => ({
            //     title: item?.group_name,
            //     func: () => {
            //         handleFormChange("groupCode", item?.group_code);
            //         handleFormChange("groupCodeName", item?.group_name);
            //     }
            // }));
            console.log('res=====', response?.data?.msg)
            setGroupNames(response?.data?.msg.filter(e => e.group_name)?.map((item, _) => (
                { label: item?.group_name, value: item?.group_code }
            )));
        } catch (err) {
            ToastAndroid.show("Some error occurred {handleFetchGroupNames}!", ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchReligions = async () => {
        setLoading(true)
        setReligions(() => [])
        await axios.get(`${ADDRESSES.GET_RELIGIONS}`).then(res => {
            res?.data?.map((item, i) => (
                //@ts-ignore
                setReligions(prev => [...prev, { title: item?.name, func: () => handleFormChange("religion", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const handleFetchCastes = async () => {
        setLoading(true)
        setCastes(() => [])
        await axios.get(`${ADDRESSES.GET_CASTES}`).then(res => {
            console.log(">>>>>>>><<<<<<<<<", res?.data)
            res?.data?.map((item, i) => (
                //@ts-ignore
                setCastes(prev => [...prev, { title: item?.name, func: () => handleFormChange("caste", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchCastes}!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    const handleFetchEducations = async () => {
        setLoading(true)
        setEducations(() => [])
        await axios.get(`${ADDRESSES.GET_EDUCATIONS}`).then(res => {
            res?.data?.map((item, i) => (
                //@ts-ignore
                setEducations(prev => [...prev, { title: item?.name, func: () => handleFormChange("education", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchEducations}!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    useEffect(() => {
        handleFetchGroupNames()
        handleFetchReligions()
        handleFetchCastes()
        handleFetchEducations()
    }, [])

    // const fetchClientDetails = async (flag, data) => {
    //     // setLoading(true)
    //     setOngoingLoanCheckFlag(true)
    //     const creds = {
    //         flag: flag,
    //         user_dt: data,
    //         branch_code: loginStore?.brn_code
    //     }

    //     if (flag === "M" && !formData.clientMobile) {
    //         return
    //     }

    //     if (flag === "P" && !formData.panNumber) {
    //         return
    //     }

    //     if (flag === "A" && !formData.aadhaarNumber) {
    //         return
    //     }

    //     await axios.post(`${ADDRESSES.FETCH_CLIENT_DETAILS}`, creds).then(res => {
    //         console.log("PPPPPPPPPPPPPPPPP", res?.data)
    //         if (res?.data?.suc === 1) {
    //             if (res?.data?.msg?.length > 0) {
    //                 setMemberCodeShowHide(true)
    //                 setFormData({
    //                     clientName: res?.data?.msg[0]?.client_name || "",
    //                     clientEmail: res?.data?.msg[0]?.email_id || "",
    //                     clientGender: res?.data?.msg[0]?.gender || "",
    //                     clientMobile: res?.data?.msg[0]?.client_mobile || "",
    //                     guardianName: res?.data?.msg[0]?.gurd_name || "",
    //                     guardianMobile: res?.data?.msg[0]?.gurd_mobile || "",
    //                     clientAddress: res?.data?.msg[0]?.client_addr || "",
    //                     clientPin: res?.data?.msg[0]?.pin_no || "",
    //                     aadhaarNumber: res?.data?.msg[0]?.aadhar_no || "",
    //                     panNumber: res?.data?.msg[0]?.pan_no || "",
    //                     religion: res?.data?.msg[0]?.religion || "",
    //                     otherReligion: res?.data?.msg[0]?.other_religion || "",
    //                     caste: res?.data?.msg[0]?.caste || "",
    //                     otherCaste: res?.data?.msg[0]?.other_caste || "",
    //                     education: res?.data?.msg[0]?.education ?? "",
    //                     otherEducation: res?.data?.msg[0]?.other_education || "",
    //                     groupCode: res?.data?.msg[0]?.prov_grp_code || "",
    //                     groupCodeName: res?.data?.msg[0]?.group_name || "",
    //                     dob: res?.data?.msg[0]?.dob ? new Date(res.data.msg[0].dob) : new Date(),
    //                     grtDate: res?.data?.msg[0]?.grt_date ? new Date(res.data.msg[0].grt_date) : new Date(),
    //                 })
    //                 setReadonlyMemberId(res?.data?.msg[0]?.member_code || "")

    //                 if (approvalStatus !== "U") {
    //                     setGeolocationFetchedAddress(res?.data?.msg[0]?.co_gps_address || "")
    //                 }
    //             }
    //         } else if (res?.data?.suc === 0) {
    //             Alert.alert("On-going Loan", `${res?.data?.status}`, [{
    //                 text: "OK",
    //                 onPress: () => {
    //                     setFormData({
    //                         clientName: "",
    //                         clientEmail: "",
    //                         clientGender: "",
    //                         clientMobile: "",
    //                         guardianName: "",
    //                         guardianMobile: "",
    //                         clientAddress: "",
    //                         clientPin: "",
    //                         aadhaarNumber: "",
    //                         panNumber: "",
    //                         religion: "",
    //                         otherReligion: "",
    //                         caste: "",
    //                         otherCaste: "",
    //                         education: "",
    //                         otherEducation: "",
    //                         groupCode: "",
    //                         groupCodeName: "",
    //                         dob: new Date(),
    //                         grtDate: new Date(),
    //                     })
    //                     setMemberCodeShowHide(false)
    //                 }
    //             }])
    //         }

    //     }).catch(err => {
    //         ToastAndroid.show("Some error occurred while fetching data", ToastAndroid.SHORT)
    //     })
    //     // setLoading(false)
    //     setOngoingLoanCheckFlag(false)
    // }

    const fetchBasicDetails = async () => {
        setLoading(true)

        const creds = {
            branch_code: branchCode,
            form_no: formNumber,
            approval_status: approvalStatus
        }

        await axios.post(`${ADDRESSES.FETCH_BASIC_DETAILS}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                console.log("LLLLLLLLLLLLLLLLL", res?.data?.msg[0]?.prov_grp_code)
                console.log("//////////////////////////////////////////////", res?.data?.msg[0], '///////////////////////////////')
                // Alert.alert("Success", "Basic Details Saved!", res.data.msg[0])
                setMemberCodeShowHide(true)
                setFormData({
                    clientName: res?.data?.msg[0]?.client_name || "",
                    clientEmail: res?.data?.msg[0]?.email_id || "",
                    clientGender: res?.data?.msg[0]?.gender || "",
                    clientMobile: res?.data?.msg[0]?.client_mobile || "",
                    guardianName: res?.data?.msg[0]?.gurd_name || "",
                    husbandName: res?.data?.msg[0]?.husband_name || "",
                    nomineeName: res?.data?.msg[0]?.nominee_name || "",
                    guardianMobile: res?.data?.msg[0]?.gurd_mobile || "",
                    clientAddress: res?.data?.msg[0]?.client_addr || "",
                    clientPin: res?.data?.msg[0]?.pin_no || "",
                    aadhaarNumber: res?.data?.msg[0]?.aadhar_no || "",
                    panNumber: res?.data?.msg[0]?.pan_no || "",
                    voterId: res?.data?.msg[0]?.voter_id || "",
                    religion: res?.data?.msg[0]?.religion || "",
                    otherReligion: res?.data?.msg[0]?.other_religion || "",
                    caste: res?.data?.msg[0]?.caste || "",
                    otherCaste: res?.data?.msg[0]?.other_caste || "",
                    education: res?.data?.msg[0]?.education || "",
                    otherEducation: res?.data?.msg[0]?.other_education || "",
                    groupCode: res?.data?.msg[0]?.prov_grp_code || "",
                    groupCodeName: res?.data?.msg[0]?.group_name || "",
                    dob: new Date(res?.data?.msg[0]?.dob) ?? new Date(),
                    grtDate: new Date(res?.data?.msg[0]?.grt_date) ?? new Date(), // fetch date later
                    // group_name: new Date(res?.data?.msg[0]?.grt_date) ?? new Date(), // fetch date later
                })
                setReadonlyMemberId(res?.data?.msg[0]?.member_code || "")

                if (approvalStatus !== "U") {
                    setGeolocationFetchedAddress(res?.data?.msg[0]?.bm_gps_address || "")
                }
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching basic details!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    useEffect(() => {
        (flag === "BM") && fetchBasicDetails()
    }, [])

    const handleUpdateBasicDetails = async () => {
        const creds = {
            form_no: formNumber,
            branch_code: branchCode,
            member_code: readonlyMemberId,
            // prov_grp_code: "",
            prov_grp_code: formData.groupCode,
            client_name: formData.clientName,
            // no gender -> fix backend
            gender: formData.clientGender,
            client_mobile: formData.clientMobile,
            email_id: formData.clientEmail,
            gurd_name: formData.guardianName,
            husband_name: formData.husbandName,
            gurd_mobile: formData.guardianMobile,
            client_addr: formData.clientAddress,
            pin_no: formData.clientPin,
            aadhar_no: formData.aadhaarNumber,
            pan_no: formData.panNumber,
            nominee_name: formData.nomineeName,
            voter_id: formData.voterId,
            religion: formData.religion,
            other_religion: formData.otherReligion,
            caste: formData.caste,
            other_caste: formData.otherCaste,
            education: formData.education,
            other_education: formData.otherEducation,
            dob: formattedDob,
            grt_date: formattedGrtDate,
            bm_lat_val: location?.latitude,
            bm_long_val: location?.longitude,
            bm_gps_address: geolocationFetchedAddress,
            modified_by: loginStore?.emp_id,
        }
        await axios.post(`${ADDRESSES.EDIT_BASIC_DETAILS}`, creds).then(res => {
            console.log("QQQQQQQQQQQQQQQ", res?.data)
            ToastAndroid.show("Update Successful", ToastAndroid.SHORT)
            onSubmit()
        }).catch(err => {
            ToastAndroid.show("Some error while updating basic details!", ToastAndroid.SHORT)
        })
    }

    const handleSubmitBasicDetails = async () => {
        setLoading(true)
        const creds = {
            member_code: readonlyMemberId || 0,
            branch_code: loginStore?.brn_code,
            prov_grp_code: formData?.groupCode || "",
            gender: formData.clientGender,
            client_name: formData.clientName,
            client_mobile: formData.clientMobile,
            email_id: formData.clientEmail,
            gurd_name: formData.guardianName,
            husband_name: formData.husbandName,
            voter_id: formData.voterId || "",
            nominee_name: formData.nomineeName || "",
            gurd_mobile: formData.guardianMobile,
            client_addr: formData.clientAddress,
            pin_no: formData.clientPin,
            aadhar_no: formData.aadhaarNumber,
            pan_no: formData.panNumber,
            religion: formData.religion,
            other_religion: formData.otherReligion,
            caste: formData.caste,
            other_caste: formData.otherCaste,
            education: formData.education,
            other_education: formData.otherEducation,
            dob: formattedDob,
            grt_date: formattedGrtDate,
            co_lat_val: location?.latitude,
            co_long_val: location?.longitude,
            co_gps_address: geolocationFetchedAddress,
            created_by: loginStore?.emp_id,
        }

        console.log("YYYYYYYYYYY", creds, "YYYYYYYYYYY")

        await axios.post(`${ADDRESSES.SAVE_BASIC_DETAILS}`, creds).then(res => {
            console.log("-----------", res?.data)
            Alert.alert("Success", `Basic Details Saved!\nMember Code: ${res?.data?.member_code}`)
            setFormData({
                clientName: "",
                clientEmail: "",
                clientGender: "",
                clientMobile: "",
                guardianName: "",
                husbandName: "",
                nomineeName: "",
                guardianMobile: "",
                clientAddress: "",
                clientPin: "",
                aadhaarNumber: "",
                panNumber: "",
                voterId: "",
                religion: "",
                otherReligion: "",
                caste: "",
                otherCaste: "",
                education: "",
                otherEducation: "",
                groupCode: "",
                groupCodeName: "",
                dob: new Date(),
                grtDate: new Date(),
            })
            setMemberCodeShowHide(false)
            onSubmit()
            // setResponseMemberCode(res?.data?.member_code)
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting basic details", ToastAndroid.SHORT)
            console.log("SAVE_BASIC_DETAILS ERRRRR", err)
        })
        setLoading(false)
    }

    const handleResetForm = () => {
        Alert.alert("Reset", "Are you sure about this?", [{
            text: "No",
            onPress: () => null
        }, {
            text: "Yes",
            onPress: () => {
                setFormData({
                    clientName: "",
                    clientEmail: "",
                    clientGender: "",
                    clientMobile: "",
                    guardianName: "",
                    husbandName: "",
                    nomineeName: "",
                    guardianMobile: "",
                    clientAddress: "",
                    clientPin: "",
                    aadhaarNumber: "",
                    panNumber: "",
                    voterId: "",
                    religion: "",
                    otherReligion: "",
                    caste: "",
                    otherCaste: "",
                    education: "",
                    otherEducation: "",
                    groupCode: "",
                    groupCodeName: "",
                    dob: new Date(),
                    grtDate: new Date(),
                })
                setMemberCodeShowHide(false)
                // setDob(new Date())
            }
        }])

    }

    // const renderLoader = () => loading && <LoadingOverlay />;

    // const validateForm = () => {
    //     const isValid = loading || !formData.clientMobile || !formData.aadhaarNumber || !formData.panNumber || !formData.clientName || !formData.guardianName || !formData.clientAddress || !formData.clientPin || !formData.dob || !formData.religion || !formData.caste || !formData.education || !geolocationFetchedAddress || approvalStatus !== "U" || branchCode !== loginStore?.brn_code; // Add your validation logic here

    //     setIsFormValid(isValid); // Inform parent if the form is valid or not
    //     console.log("KKSKSKSKKSKSKS", isValid)
    //     return isValid
    // };

    // const handleSubmit = () => {
    //     // Alert.alert("Submit Basic Details", "Are you sure you want to update this?", [
    //     //     { text: "No", onPress: () => null },
    //     //     { text: "Yes", onPress: () => { flag === "BM" ? handleUpdateBasicDetails() : handleSubmitBasicDetails() } },
    //     // ])
    //     if (validateForm()) {
    //         if (flag === "BM") {
    //             handleUpdateBasicDetails()
    //         } else {
    //             handleSubmitBasicDetails()
    //         }
    //     }
    // }

    // useEffect(() => {
    //     if (onSubmitRef) {
    //         onSubmitRef.current = handleSubmit;
    //     }

    //     // Trigger validation on mount and whenever formData changes
    //     validateForm();
    // }, [formData]);

    // useEffect(() => {
    //     if (onSubmitRef) {
    //         onSubmitRef.current = handleSubmit;
    //     }
    // }, [onSubmitRef]);

    console.log("~~~~~~~~~~~~~~~~~", branchCode, loginStore?.brn_code)
    // console.log("FORM DATA ============>>>", branchCode, formData)


    // Compute the disabled condition exactly as used for the UPDATE button.
    const updateDisabled =
        loading || !formData.clientMobile || !formData.aadhaarNumber || !formData.clientName || !formData.guardianName || !formData.clientAddress || !formData.clientPin || !formData.dob || !formData.religion || !formData.caste || !formData.education || !geolocationFetchedAddress || disableCondition(approvalStatus, branchCode);

    // Inform parent about the current disabled state.
    useEffect(() => {
        onUpdateDisabledChange(updateDisabled)
    }, [updateDisabled, onUpdateDisabledChange])

    // This function is triggered when NEXT is pressed on BMPendingLoanFormScreen.
    // Here we assume that if updateDisabled is false, we want to show the confirmation alert.
    const triggerUpdateButton = () => {
        if (updateDisabled) {
            // Should not happen because parent's NEXT would be disabled.
            return;
        }
        // Alert.alert("Update Basic Details", "Are you sure you want to update this?", [
        //     { text: "No", onPress: () => null },
        //     { text: "Yes", onPress: () => handleUpdateBasicDetails() },
        // ])

        Alert.alert("Submit Basic Details", "Are you sure you want to update this?", [
            { text: "No", onPress: () => null },
            { text: "Yes", onPress: () => { flag === "BM" ? handleUpdateBasicDetails() : handleSubmitBasicDetails() } },
        ])
    }

    // Expose the triggerUpdateButton function via ref.
    useImperativeHandle(ref, () => ({
        updateAndNext: triggerUpdateButton
    }))

    return (
        <SafeAreaView>
            <>
                <View style={{
                    // paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10,
                    paddingBottom: 10
                }}>
                    {/* <Divider /> */}

                    <InputPaper label={approvalStatus === "U" && geolocationFetchedAddress ? `Geo Location Address` : (approvalStatus === "A" || approvalStatus === "S") ? "Geo Location Address" : `Fetching GPS Address...`} multiline leftIcon='google-maps' value={geolocationFetchedAddress || ""} onChangeText={(txt: any) => setGeolocationFetchedAddress(txt)} disabled customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} />

                    {memberCodeShowHide && <InputPaper label="Member Code" maxLength={18} leftIcon='numeric' keyboardType="numeric" value={readonlyMemberId} onChangeText={(txt: any) => setReadonlyMemberId(txt)} disabled customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />}

                    {/* <List.Item
                        title="Choose Group"
                        description={`${formData.groupCodeName} - ${formData.groupCode}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupNames} disabled={disableCondition(approvalStatus, branchCode)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    /> */}

                    {/* {console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", formData)} */}
                    {/* <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={[styles.placeholderStyle, { color: theme.colors.onBackground }]}
                        selectedTextStyle={[styles.selectedTextStyle, { color: theme.colors.primary }]}
                        inputSearchStyle={[styles.inputSearchStyle, { borderRadius: 10 }]}
                        containerStyle={{
                            width: SCREEN_WIDTH / 1.1,
                            alignSelf: "center",
                            borderRadius: 10
                        }}
                        iconStyle={styles.iconStyle}
                        data={groupNames}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Group*"
                        searchPlaceholder="Search Group..."
                        value={formData?.groupCode}
                        onChange={item => {
                            console.log("jjj")
                            console.log("??????????????????????", item)
                            // setValue(item.value);
                            handleFormChange("groupCode", item?.value);
                            // handleFormChange("groupCodeName", item?.label);
                        }}
                        renderLeftIcon={() => (
                            <Icon size={25} source={"account-group-outline"} />
                        )}
                    />

                    <Divider /> */}

                    <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenDate2(true)}
                        mode="elevated"
                        icon="calendar-outline"
                        disabled={disableCondition(approvalStatus, branchCode)}>
                        CHOOSE GRT DATE*: {formData.grtDate?.toLocaleDateString("en-GB")}
                    </ButtonPaper>
                    <DatePicker
                        modal
                        mode="date"
                        open={openDate2}
                        date={formData.grtDate}
                        minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 55))}
                        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear()))}
                        onConfirm={date => {
                            setOpenDate2(false)
                            handleFormChange("grtDate", date)
                        }}
                        onCancel={() => {
                            setOpenDate2(false)
                        }}
                    />

                    {flag !== "CO" && <InputPaper
                        label="Group Name"
                        maxLength={10}
                        leftIcon='account-group'
                        // keyboardType="phone-pad"
                        value={formData.groupCodeName}
                        onChangeText={(txt: any) => handleFormChange("groupCodeName", txt)}
                        // onBlur={() => {
                        //     formData.clientMobile &&
                        //         fetchClientDetails("M", formData.clientMobile)
                        // }}
                        customStyle={{
                            backgroundColor: theme.colors.background,
                        }}
                        disabled={true}
                    />}

                    <InputPaper
                        label="Mobile No.*"
                        maxLength={10}
                        leftIcon='phone'
                        keyboardType="phone-pad"
                        value={formData.clientMobile}
                        onChangeText={(txt: any) => handleFormChange("clientMobile", txt)}
                        // onBlur={() => {
                        //     formData.clientMobile &&
                        //         fetchClientDetails("M", formData.clientMobile)
                        // }}
                        customStyle={{
                            backgroundColor: theme.colors.background,
                        }}
                        disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper
                        label="Aadhaar No.*"
                        maxLength={12}
                        leftIcon='card-account-details-star-outline'
                        keyboardType="numeric" value={formData.aadhaarNumber}
                        onChangeText={(txt: any) => handleFormChange("aadhaarNumber", txt)}
                        // onBlur={() => {
                        //     formData.aadhaarNumber &&
                        //         fetchClientDetails("A", formData.aadhaarNumber)
                        // }}
                        customStyle={{
                            backgroundColor: theme.colors.background,
                        }}
                        disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper
                        label="PAN No."
                        maxLength={10}
                        leftIcon='card-account-details-outline'
                        keyboardType="default"
                        value={formData.panNumber}
                        onChangeText={(txt: any) => handleFormChange("panNumber", txt)}
                        // onBlur={() => {
                        //     formData.panNumber &&
                        //         fetchClientDetails("P", formData.panNumber)
                        // }}
                        customStyle={{
                            backgroundColor: theme.colors.background,
                        }}
                        disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper
                        label="Voter ID"
                        maxLength={20}
                        leftIcon='card-account-details-outline'
                        keyboardType="default"
                        value={formData.voterId}
                        onChangeText={(txt: any) => handleFormChange("voterId", txt)}
                        // onBlur={() => {
                        //     formData.panNumber &&
                        //         fetchClientDetails("P", formData.panNumber)
                        // }}
                        customStyle={{
                            backgroundColor: theme.colors.background,
                        }}
                        disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper label="Member Name*" leftIcon='account-circle-outline' value={formData.clientName} onChangeText={(txt: any) => handleFormChange("clientName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper label="Member Email" leftIcon='email-outline' keyboardType="email-address" value={formData.clientEmail} onChangeText={(txt: any) => handleFormChange("clientEmail", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <List.Item
                        title="Choose Gender*"
                        description={`Gender: ${formData.clientGender}`}
                        left={props => <List.Icon {...props} icon="gender-male-female" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={memberGenders} disabled={disableCondition(approvalStatus, branchCode)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <InputPaper label="Father's Name*" leftIcon='account-cowboy-hat-outline' value={formData.guardianName} onChangeText={(txt: any) => handleFormChange("guardianName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper label="Husband's Name" leftIcon='account-cowboy-hat-outline' value={formData.husbandName} onChangeText={(txt: any) => handleFormChange("husbandName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper label="Nominee Name" leftIcon='account-network' value={formData.nomineeName} onChangeText={(txt: any) => handleFormChange("nomineeName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper label="Father/Husband Mobile No." maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={formData.guardianMobile} onChangeText={(txt: any) => handleFormChange("guardianMobile", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper label="Member Address*" multiline leftIcon='card-account-phone-outline' value={formData.clientAddress} onChangeText={(txt: any) => handleFormChange("clientAddress", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <InputPaper maxLength={6} label="PIN No.*" leftIcon='map-marker-radius-outline' keyboardType="numeric" value={formData.clientPin} onChangeText={(txt: any) => handleFormChange("clientPin", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />

                    <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenDate(true)}
                        mode="elevated"
                        icon="baby-face-outline"
                        disabled={disableCondition(approvalStatus, branchCode)}>
                        {/* CHOOSE DOB: {formData.dob?.toLocaleDateString("en-GB")} */}
                        CHOOSE D.O.B. {isToday(formData.dob) ? "(BIRTH DATE)*" : formData.dob?.toLocaleDateString("en-GB")}
                    </ButtonPaper>
                    <DatePicker
                        modal
                        mode="date"
                        minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 55))}
                        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                        open={openDate}
                        date={formData.dob}
                        onConfirm={date => {
                            setOpenDate(false)
                            handleFormChange("dob", date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    />

                    <List.Item
                        title="Choose Religion*"
                        description={`Religion: ${formData.religion}`}
                        left={props => <List.Icon {...props} icon="peace" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={religions} disabled={disableCondition(approvalStatus, branchCode)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    {formData.religion === "Others" && <InputPaper label="Other Religion Name" leftIcon='hands-pray' value={formData.otherReligion} onChangeText={(txt: any) => handleFormChange("otherReligion", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />}

                    <List.Item
                        title="Choose Caste*"
                        description={`Caste: ${formData.caste}`}
                        left={props => <List.Icon {...props} icon="account-question-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={castes} disabled={disableCondition(approvalStatus, branchCode)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    {formData.caste === "Others" && <InputPaper label="Other Caste Name" leftIcon='human-handsup' value={formData.otherCaste} onChangeText={(txt: any) => handleFormChange("otherCaste", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />}

                    <List.Item
                        title="Choose Education*"
                        description={`Education: ${formData.education}`}
                        left={props => <List.Icon {...props} icon="book-education-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={educations} disabled={disableCondition(approvalStatus, branchCode)} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    {formData.education === "Others" && <InputPaper label="Other Education Name" leftIcon='school-outline' value={formData.otherEducation} onChangeText={(txt: any) => handleFormChange("otherEducation", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled={disableCondition(approvalStatus, branchCode)} />}

                    {/* <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 40,
                        marginBottom: 10
                    }}>
                        <ButtonPaper mode="text" textColor={theme.colors.error} onPress={handleResetForm} icon="backup-restore">
                            RESET FORM
                        </ButtonPaper>
                        <ButtonPaper
                            mode="contained"
                            icon="content-save-outline"
                            onPress={() => {
                                Alert.alert("Create GRT", "Are you sure you want to create this GRT?", [
                                    { text: "No", onPress: () => null },
                                    { text: "Yes", onPress: () => handleSubmitBasicDetails() },
                                ])
                            }}
                            disabled={loading || !clientMobile || !aadhaarNumber || !panNumber || !clientName || !guardianName || !guardianMobile || !clientAddress || !clientPin || !dob || !religion || !caste || !education}
                            loading={loading}
                            buttonColor={theme.colors.primary}>
                            SUBMIT
                        </ButtonPaper>
                    </View> */}

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 40,
                        marginBottom: 10
                    }}>
                        {flag === "CO" && <ButtonPaper mode="text" textColor={theme.colors.error} onPress={handleResetForm} icon="backup-restore" disabled={disableCondition(approvalStatus, branchCode)}>
                            RESET FORM
                        </ButtonPaper>}
                        {/* <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={triggerUpdateButton} disabled={updateDisabled}
                            loading={loading}>{flag === "BM" ? "UPDATE" : "SUBMIT"}</ButtonPaper> */}

                        {
                            flag !== "BM" && <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={triggerUpdateButton} disabled={updateDisabled}
                                loading={loading}>SUBMIT</ButtonPaper>
                        }
                    </View>

                </View>
            </>
            {ongoingLoanCheckFlag && (
                <LoadingOverlay />
            )}
        </SafeAreaView>
    )
})

export default BMBasicDetailsForm

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 30,
        width: SCREEN_WIDTH,
        alignSelf: "center",
        paddingHorizontal: 35,
        borderRadius: 10
    },
    // icon: {
    //     marginLeft: -150,
    // },
    placeholderStyle: {
        fontSize: 16,
        marginLeft: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },

})