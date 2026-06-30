import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Text } from "react-native-paper"
import React, { useEffect, useState } from 'react'
import HeadingComp from '../components/HeadingComp'
import { usePaperColorScheme } from '../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../components/InputPaper'
import MenuPaper from '../components/MenuPaper'
import ButtonPaper from '../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { loginStorage } from '../storage/appStorage'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import normalize, { SCREEN_HEIGHT } from 'react-native-normalize'
import { clearStates } from '../utils/clearStates'
import DialogBox from "../components/DialogBox"
// import LoadingOverlay from '../components/LoadingOverlay'

const GroupFormScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LOGIN DATAAA =============", loginStore)

    const [loading, setLoading] = useState(() => false)

    const [visible, setVisible] = useState(() => false)
    const hideDialog = () => setVisible(() => false)

    const [groupName, setGroupName] = useState(() => "")
    const [groupType, setGroupType] = useState(() => "")
    const [groupTypeName, setGroupTypeName] = useState(() => "")
    const [address, setAddress] = useState(() => "")
    const [phoneNo, setPhoneNo] = useState(() => "")
    const [emailId, setEmailId] = useState(() => "")

    const [groupBlocks, setGroupBlocks] = useState(() => [])
    const [groupBlock, setGroupBlock] = useState(() => "")
    const [groupBlockName, setGroupBlockName] = useState(() => "")

    const [searchBlock, setSearchBlock] = useState(() => "")

    const [resGroupCode, setResGroupCode] = useState(() => "")
    const [resGroupName, setResGroupName] = useState(() => "")
    const [resGroupOpenDate, setResGroupOpenDate] = useState(() => "")

    const groupTypes = [{ title: "SHG", func: () => { setGroupType("S"); setGroupTypeName("SHG") } }, { title: "JLG", func: () => { setGroupType("J"); setGroupTypeName("JLG") } }]

    const handleFetchBlocks = async () => {
        setGroupBlocks(() => [])
        await axios.get(`${ADDRESSES.GET_BLOCKS}?dist_id=${loginStore?.dist_code}`).then(res => {
            res?.data?.msg?.map((item, i) => (
                setGroupBlocks(prev => [...prev, { title: item?.block_name, func: () => { setGroupBlock(item?.block_id); setGroupBlockName(item?.block_name) } }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchBlocks}!", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        handleFetchBlocks()
    }, [])

    const onDialogSuccess = () => {
        clearStates([
            setGroupName,
            setGroupType,
            setResGroupOpenDate,
            setAddress,
            setGroupBlock,
            setGroupBlockName,
            setPhoneNo,
            setEmailId
        ], "")
        hideDialog()
        navigation.dispatch(CommonActions.navigate({
            name: navigationRoutes.homeScreen
        }))
    }

    const handleSubmitGroupDetails = async () => {
        // console.log("Group created!")
        setLoading(true)
        const creds = {
            branch_code: loginStore?.brn_code,
            group_name: groupName,
            group_type: groupType,
            grp_addr: address,
            co_id: loginStore?.emp_id,
            phone1: phoneNo,
            phone2: phoneNo,
            email_id: emailId,
            disctrict: +loginStore?.dist_code,
            block: groupBlock,
            created_by: loginStore?.emp_name
        }

        console.log("GROUPPPP-----CREDSSSS", creds)

        await axios.post(`${ADDRESSES.SAVE_GROUP}`, creds).then(res => {
            console.log("GROUP CREATION ==============", res?.data)

            setResGroupCode(res?.data?.group_code)
            setResGroupName(res?.data?.group_name)
            setResGroupOpenDate(new Date(res?.data?.grp_open_dt)?.toLocaleString("en-GB"))

            ToastAndroid.show("Group created successfully!", ToastAndroid.SHORT)

            setVisible(true)

            // navigation.dispatch(CommonActions.navigate({
            //     name: navigationRoutes.homeScreen
            // }))
        }).catch(err => {
            ToastAndroid.show("Some error occurred while saving group.", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background,

                // height: "auto",
            }}>
                <HeadingComp title="Create Group" subtitle="Fill Details" />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 5,
                    minHeight: SCREEN_HEIGHT,
                    gap: 15,
                    // marginBottom: normalize(10)
                    paddingBottom: 20,
                }}>
                    <Divider />

                    <InputPaper label="Group Name" leftIcon='account-group-outline' keyboardType="default" value={groupName} onChangeText={(txt: any) => setGroupName(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <List.Item
                        title="Choose Group Type"
                        description={`Group Type: ${groupTypeName}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupTypes} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <Divider />

                    <InputPaper label="Address" multiline leftIcon='card-account-phone-outline' keyboardType="default" value={address} onChangeText={(txt: any) => setAddress(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                        minHeight: 95,
                    }} />

                    <List.Item
                        title="Choose Block"
                        description={`Group Block: ${groupBlockName}`}
                        left={props => <List.Icon {...props} icon="map-marker-distance" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupBlocks} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.tertiary,
                        }}
                    />

                    <Divider />

                    <InputPaper label="Mobile No." maxLength={10} leftIcon='phone' keyboardType="phone-pad" value={phoneNo} onChangeText={(txt: any) => setPhoneNo(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper label="Email Id." leftIcon='email-outline' keyboardType="email-address" value={emailId} onChangeText={(txt: any) => setEmailId(txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} />

                    <View style={{
                        flexDirection: "row",
                        // marginBottom: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="account-multiple-plus-outline" mode="contained" onPress={() => {
                            Alert.alert(`Create group ${groupName}?`, `Are you sure, you want to create this group?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: () => handleSubmitGroupDetails(),
                                text: "Yes"
                            }])

                        }} disabled={loading || !groupName || !groupType || !address || !groupBlock || !phoneNo} loading={loading}>
                            ADD GROUP
                        </ButtonPaper>

                    </View>
                </View>
            </ScrollView>

            <DialogBox
                visible={visible}
                title="Group Details"
                hide={hideDialog}
                titleStyle={{ textAlign: "center" }}
                btnSuccess={"OK"}
                // onFailure={onDialogFailure}
                onSuccess={onDialogSuccess}>
                <View>
                    <Text variant='bodyLarge'>GROUP CODE: {resGroupCode}</Text>
                    <Text variant='bodyLarge'>GROUP NAME: {resGroupName}</Text>
                    <Text variant='bodyLarge'>OPENING DATETIME: {resGroupOpenDate}</Text>
                </View>
            </DialogBox>

        </SafeAreaView>
    )
}

export default GroupFormScreen

const styles = StyleSheet.create({})