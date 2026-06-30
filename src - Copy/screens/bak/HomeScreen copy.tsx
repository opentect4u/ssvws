import { StyleSheet, SafeAreaView, View, ScrollView, Alert, ToastAndroid } from 'react-native'
import { List, Text, Divider, ActivityIndicator } from "react-native-paper"
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

    const handleFetchGroupNames = async () => {
        setGroupNames(() => [])
        await axios.get(`${ADDRESSES.GROUP_NAMES}?branch_code=${110}`).then(res => {

            console.log("================", res?.data?.msg)

            res?.data?.msg?.map((item, i) => (
                setGroupNames(prev => [...prev, { title: item?.group_name, func: () => setGroupCode(item?.group_code) }])
            ))

        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchGroupNames}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchReligions = async () => {
        setReligions(() => [])
        await axios.get(`${ADDRESSES.GET_RELIGIONS}`).then(res => {
            res?.data?.map((item, i) => (
                setReligions(prev => [...prev, { title: item?.name, func: () => setReligion(item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchCastes = async () => {
        setCastes(() => [])
        await axios.get(`${ADDRESSES.GET_CASTES}`).then(res => {
            res?.data?.map((item, i) => (
                setCastes(prev => [...prev, { title: item?.name, func: () => setCaste(item?.id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchReligions}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchEducations = async () => {
        setEducations(() => [])
        await axios.get(`${ADDRESSES.GET_EDUCATIONS}`).then(res => {
            res?.data?.map((item, i) => (
                setEducations(prev => [...prev, { title: item?.name, func: () => setEducation(item?.id) }])
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

    const handleSubmitBasicDetails = async () => {
        const creds = {
            branch_code: 110, // should be dynamic in future (from loginStorage)
            prov_grp_code: groupCode,
            client_name: clientName,
            client_mobile: clientMobile,
            gurd_name: guardianName,
            gurd_mobile: guardianMobile,
            client_addr: clientAddress,
            pin_no: clientPin,
            aadhar_no: aadhaarNumber,
            pan_no: panNumber,
            religion: religion, // dropdown
            caste: caste, // dropdown
            education: education, // dropdown
            dob: formattedDob,
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
                    <InputPaper label="Mobile No." keyboardType="phone-pad" value={clientMobile} onChangeText={(txt: any) => setClientMobile(txt)} />
                    <InputPaper label="Aadhaar No." keyboardType="numeric" value={aadhaarNumber} onChangeText={(txt: any) => setAadhaarNumber(txt)} />
                    <InputPaper label="PAN No." keyboardType="numeric" value={panNumber} onChangeText={(txt: any) => setPanNumber(txt)} />
                    <InputPaper label="Client Name" value={clientName} onChangeText={(txt: any) => setClientName(txt)} />
                    <InputPaper label="Guarian Name" value={guardianName} onChangeText={(txt: any) => setGuardianName(txt)} />
                    <InputPaper label="Guardian Mobile No." keyboardType="phone-pad" value={guardianMobile} onChangeText={(txt: any) => setGuardianMobile(txt)} />
                    <InputPaper label="Client Address" value={clientAddress} onChangeText={(txt: any) => setClientAddress(txt)} />
                    <InputPaper label="Client PIN No." keyboardType="numeric" value={clientPin} onChangeText={(txt: any) => setClientPin(txt)} />

                    <ButtonPaper
                        textColor={theme.colors.primary}
                        onPress={() => setOpenDate(true)}
                        mode="text">
                        CHOOSE DOB: {dob?.toLocaleDateString("en-GB")}
                    </ButtonPaper>
                    <DatePicker
                        modal
                        mode="date"
                        // minimumDate={toDate.setMonth(toDate.getMonth() - 1)}
                        open={openDate}
                        date={dob}
                        onConfirm={date => {
                            setOpenDate(false)
                            setDob(date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    />

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