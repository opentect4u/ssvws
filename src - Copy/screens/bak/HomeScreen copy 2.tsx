import { StyleSheet, SafeAreaView, View, ScrollView, Alert, ToastAndroid } from 'react-native'
import { List, Text, Divider, ActivityIndicator } from "react-native-paper"
import { useFormik } from "formik"
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react'
import { formattedDate } from "../utils/dateFormatter"
import InputPaper from "../components/InputPaper"
import ButtonPaper from "../components/ButtonPaper"
import { usePaperColorScheme } from '../theme/theme'
import DatePicker from "react-native-date-picker"
import MenuPaper from "../components/MenuPaper"
import axios from "axios"
import { ADDRESSES } from '../config/api_list'
import { clearStates } from "../utils/clearStates"

const HomeScreen = () => {
    const theme = usePaperColorScheme()
    // 110 -> Branch Code

    // created_by
    const [dob, setDob] = useState(() => new Date()) //dob
    const [openDate, setOpenDate] = useState(() => false)
    const formattedDob = formattedDate(dob)

    const [clientName, setClientName] = useState(() => "") // name
    const [clientMobile, setClientMobile] = useState(() => "") // mob
    const [guardianName, setGuardianName] = useState(() => "") // guard
    const [guardianMobile, setGuardianMobile] = useState(() => "") // guradmob
    const [clientAddress, setClientAddress] = useState(() => "") // addr
    const [clientPin, setClientPin] = useState(() => "") // pin
    const [aadhaarNumber, setAadhaarNumber] = useState(() => "") // aadhaar
    const [panNumber, setPanNumber] = useState(() => "") //pan
    const [religions, setReligions] = useState(() => []) // rel
    const [religion, setReligion] = useState(() => "") // rel
    const [castes, setCastes] = useState(() => [])
    const [caste, setCaste] = useState(() => "") // cas
    const [educations, setEducations] = useState(() => []) // edu
    const [education, setEducation] = useState(() => "") // edu
    const [groupNames, setGroupNames] = useState(() => [])
    const [groupCode, setGroupCode] = useState(() => "") // grp_code


    //////////////////////////////////////////////////////////////////////////
    // Implementing with Formik

    const [formValues, setFormValues] = useState({
        g_client_name: "",
        g_client_mobile: "",
        g_guardian_name: "",
        g_guardian_mobile: "",
        g_client_address: "",
        g_client_pin: "",
        g_aadhaar_number: "",
        g_dob: "",
        g_pan_number: "",
        g_religion: "",
        g_caste: "",
        g_education: "",
        g_group_code: ""
    })

    const validationSchema = Yup.object().shape({
        g_client_name: Yup.string().required(),
        g_client_mobile: Yup.string().required(),
        g_guardian_name: Yup.string().required(),
        g_guardian_mobile: Yup.string().required(),
        g_client_address: Yup.string().required(),
        g_client_pin: Yup.string().required(),
        g_aadhaar_number: Yup.string().required(),
        g_dob: Yup.string().required(),
        g_pan_number: Yup.string().required(),
        g_religion: Yup.string().required(),
        g_caste: Yup.string().required(),
        g_education: Yup.string().required(),
        g_group_code: Yup.string().required()
    })


    const handleFetchGroupNames = async () => {
        setGroupNames(() => [])
        await axios.get(`${ADDRESSES.GROUP_NAMES}?branch_code=${110}`).then(res => {

            console.log("================", res?.data?.msg)

            res?.data?.msg?.map((item, i) => (
                setGroupNames(prev => [...prev, { title: item?.group_name, func: () => formik.setFieldValue("g_group_code", item?.group_code) }])
            ))

        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchGroupNames}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchReligions = async () => {
        setReligions(() => [])
        await axios.get(`${ADDRESSES.GET_RELIGIONS}`).then(res => {
            res?.data?.map((item, i) => (
                setReligions(prev => [...prev, { title: item?.name, func: () => formik.setFieldValue("g_religion", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchCastes = async () => {
        setCastes(() => [])
        await axios.get(`${ADDRESSES.GET_CASTES}`).then(res => {
            res?.data?.map((item, i) => (
                setCastes(prev => [...prev, { title: item?.name, func: () => formik.setFieldValue("g_caste", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchEducations = async () => {
        setEducations(() => [])
        await axios.get(`${ADDRESSES.GET_EDUCATIONS}`).then(res => {
            res?.data?.map((item, i) => (
                setEducations(prev => [...prev, { title: item?.name, func: () => formik.setFieldValue("g_education", item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        handleFetchGroupNames()
        handleFetchReligions()
        handleFetchCastes()
        handleFetchEducations()
    }, [])

    const fetchClientDetails = async () => {
        await axios.get(`${ADDRESSES.FETCH_CLIENT_DETAILS}`).then(res => {

        }).catch()
    }

    const handleSubmitBasicDetails = async (values) => {
        const creds = {
            branch_code: 110, // should be dynamic in future (from loginStorage)
            prov_grp_code: values?.g_group_code,
            client_name: values?.g_client_name,
            client_mobile: values?.g_client_mobile,
            gurd_name: values?.g_guardian_name,
            gurd_mobile: values?.g_guardian_mobile,
            client_addr: values?.g_client_address,
            pin_no: values?.g_client_pin,
            aadhar_no: values?.g_aadhaar_number,
            pan_no: values?.g_pan_number,
            religion: values?.g_religion, // dropdown
            caste: values?.g_caste, // dropdown
            education: values?.g_education, // dropdown
            dob: values?.g_dob,
            created_by: "Soumyadeep Mondal" // should be dynamic in future (from loginStorage)
        }

        await axios.post(`${ADDRESSES.SAVE_BASIC_DETAILS}`, creds).then(res => {
            console.log("-----------", res?.data)
            Alert.alert("Success", "Basic Details Saved!")
            clearStates([
                setClientName,
                setClientMobile,
                setGuardianName,
                setGuardianMobile,
                setClientAddress,
                setClientPin,
                setAadhaarNumber,
                setPanNumber,
                setReligion,
                setCaste,
                setEducation
            ], "")
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting basic details", ToastAndroid.SHORT)
        })
    }

    const formik = useFormik({
        initialValues: formValues,
        onSubmit: handleSubmitBasicDetails,
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        validateOnMount: true,
    })

    return (
        <SafeAreaView>
            {/* <ActivityIndicator size={'large'} /> */}
            <ScrollView style={{
                backgroundColor: theme.colors.background
            }}>
                <View style={{
                    backgroundColor: theme.colors.primaryContainer,
                    margin: 20,
                    paddingVertical: 25,
                    borderTopLeftRadius: 30,
                    borderBottomRightRadius: 30
                }}>
                    <View style={{
                        padding: 20,
                    }}>
                        <Text variant="headlineLarge" style={{
                            color: theme.colors.onSecondaryContainer,
                            // textAlign: "left",
                        }}>GRT Form</Text>
                        <Text variant="headlineSmall" style={{
                            color: theme.colors.onSecondaryContainer,
                            // textAlign: "left",
                        }}>{"->"} Basic Details</Text>
                    </View>

                </View>
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 8
                }}>
                    <Divider />
                    <InputPaper label="Mobile No." keyboardType="phone-pad" value={formik.values.g_client_name} onChangeText={() => formik.handleChange("g_client_name")} />
                    <InputPaper label="Aadhaar No." keyboardType="numeric" value={formik.values.g_aadhaar_number} onChangeText={() => formik.handleChange("g_aadhaar_number")} />
                    <InputPaper label="PAN No." keyboardType="numeric" value={formik.values.g_pan_number} onChangeText={() => formik.handleChange("g_aadhaar_number")} />
                    <InputPaper label="Client Name" value={formik.values.g_client_name} onChangeText={() => formik.handleChange("g_client_name")} />
                    <InputPaper label="Guarian Name" value={formik.values.g_guardian_name} onChangeText={() => formik.handleChange("g_guardian_name")} />
                    <InputPaper label="Guardian Mobile No." keyboardType="phone-pad" value={formik.values.g_guardian_mobile} onChangeText={() => formik.handleChange("g_guardian_mobile")} />
                    <InputPaper label="Client Address" value={formik.values.g_client_address} onChangeText={() => formik.handleChange("g_client_address")} />
                    <InputPaper label="Client PIN No." keyboardType="numeric" value={formik.values.g_client_pin} onChangeText={() => formik.handleChange("g_client_pin")} />

                    <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenDate(true)}
                        mode="text">
                        CHOOSE DOB: {dob?.toLocaleDateString("en-GB")}
                    </ButtonPaper>
                    {/* <DatePicker
                        // onDateChange={() => formik.handleChange("l_dob")}
                        modal
                        mode="date"
                        // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
                        open={openDate}
                        date={formik.values.g_dob}
                        onConfirm={date => {
                            setOpenDate(false)
                            // setDob(date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    /> */}

                    <List.Item
                        title="Choose Religion"
                        description={`Religion: ${religion}`}
                        left={props => <List.Icon {...props} icon="peace" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={religions} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    {/* <InputPaper label="Religion" value={religion} onChangeText={(txt: any) => setReligion(txt)} /> */}

                    <List.Item
                        title="Choose Caste"
                        description={`Caste: ${caste}`}
                        left={props => <List.Icon {...props} icon="account-question-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={castes} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    {/* <InputPaper label="Caste" value={caste} onChangeText={(txt: any) => setCaste(txt)} /> */}

                    <List.Item
                        title="Choose Education"
                        description={`Education: ${education}`}
                        left={props => <List.Icon {...props} icon="book-education-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={educations} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    {/* <InputPaper label="Education" value={education} onChangeText={(txt: any) => setEducation(txt)} /> */}

                    <List.Item
                        title="Choose Group"
                        description={`Group Code: ${groupCode}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupNames} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />


                    <ButtonPaper mode="contained" onPress={handleSubmitBasicDetails}>
                        SUBMIT
                    </ButtonPaper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})