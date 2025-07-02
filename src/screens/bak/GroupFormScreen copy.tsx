import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeadingComp from '../components/HeadingComp'
import { usePaperColorScheme } from '../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../components/InputPaper'
import MenuPaper from '../components/MenuPaper'
import { SCREEN_HEIGHT } from "react-native-normalize"
import ButtonPaper from '../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { loginStorage } from '../storage/appStorage'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'

const GroupFormScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [groupName, setGroupName] = useState(() => "")
    const [groupType, setGroupType] = useState(() => "")
    const [address, setAddress] = useState(() => "")
    const [phoneNo, setPhoneNo] = useState(() => "")
    const [emailId, setEmailId] = useState(() => "")

    const [groupStates, setGroupStates] = useState(() => [])
    const [groupState, setGroupState] = useState(() => "")

    const [groupDists, setGroupDists] = useState(() => [])
    const [groupDist, setGroupDist] = useState(() => "")

    const [groupBlocks, setGroupBlocks] = useState(() => [])
    const [groupBlock, setGroupBlock] = useState(() => "")

    const groupTypes = [{ title: "SHG", func: () => setGroupType("SHG") }, { title: "JLG", func: () => setGroupType("JLG") }]

    // const groupStates = [{ title: "Sta1", func: () => setGroupState("Sta1") }, { title: "Sta2", func: () => setGroupState("Sta2") }]
    // const groupDistricts = [{ title: "Dis1", func: () => setGroupDist("Dis1") }, { title: "Dis2", func: () => setGroupDist("Dis2") }]
    // const groupBlocks = [{ title: "Blk1", func: () => setGroupBlock("Blk1") }, { title: "Blk2", func: () => setGroupBlock("Blk2") }]

    const handleFetchStates = async () => {
        setGroupStates(() => [])
        await axios.get(`${ADDRESSES.GET_STATES}`).then(res => {
            res?.data?.msg?.map((item, i) => (
                setGroupStates(prev => [...prev, { title: item?.state, func: () => setGroupState(item?.sl_no) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchStates}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchDists = async () => {
        setGroupDists(() => [])
        await axios.get(`${ADDRESSES.GET_DISTS}?state_id=${groupState}`).then(res => {
            res?.data?.msg?.map((item, i) => (
                setGroupDists(prev => [...prev, { title: item?.dist_name, func: () => setGroupDist(item?.dist_id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchDists}!", ToastAndroid.SHORT)
        })
    }

    const handleFetchBlocks = async () => {
        setGroupBlocks(() => [])
        await axios.get(`${ADDRESSES.GET_BLOCKS}?dist_id=${groupDist}`).then(res => {
            res?.data?.msg?.map((item, i) => (
                setGroupBlocks(prev => [...prev, { title: item?.block_name, func: () => setGroupBlock(item?.block_id) }])
            ))
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchBlocks}!", ToastAndroid.SHORT)
        })
    }

    useEffect(() => {
        handleFetchStates()
    }, [])

    useEffect(() => {
        handleFetchDists()
    }, [groupState])

    useEffect(() => {
        handleFetchBlocks()
    }, [groupDist])

    const handleSubmitGroupDetails = async () => {
        // console.log("Group created!")

        const creds = {
            branch_code: loginStore?.brn_code,
            group_name: groupName,
            group_type: groupType,
            grp_addr: address,
            phone1: phoneNo,
            phone2: phoneNo,
            email_id: emailId,
            district: groupDist,
            block: groupBlock,
            created_by: loginStore?.created_by
        }

        console.log("GROUPPPP-----CREDSSSS", creds)

        await axios.post(`${ADDRESSES.SAVE_GROUP}`, creds).then(res => {
            console.log("GROUP CREATION ==============", res?.data)
            ToastAndroid.show("Group created successfully!", ToastAndroid.SHORT)
            navigation.dispatch(CommonActions.navigate({
                name: navigationRoutes.homeScreen
            }))
        }).catch(err => {
            ToastAndroid.show("Some error occurred while saving group.", ToastAndroid.SHORT)
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Create Group" subtitle="Fill Details" />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 5,
                    gap: 10,
                }}>
                    <Divider />

                    <InputPaper label="Group Name" keyboardType="default" value={groupName} onChangeText={(txt: any) => setGroupName(txt)} />

                    <List.Item
                        title="Choose Group Type"
                        description={`Group Type: ${groupType}`}
                        left={props => <List.Icon {...props} icon="account-group-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupTypes} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    <InputPaper label="Address" keyboardType="default" value={address} onChangeText={(txt: any) => setAddress(txt)} />
                    <InputPaper label="Mobile No." keyboardType="phone-pad" value={phoneNo} onChangeText={(txt: any) => setPhoneNo(txt)} />
                    <InputPaper label="Email Id." keyboardType="email-address" value={emailId} onChangeText={(txt: any) => setEmailId(txt)} />

                    <List.Item
                        title="Choose Group State"
                        description={`Group State: ${groupState}`}
                        left={props => <List.Icon {...props} icon="map-marker-radius-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupStates} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />
                    <List.Item
                        title="Choose Group District"
                        description={`Group District: ${groupDist}`}
                        left={props => <List.Icon {...props} icon="map-marker-multiple-outline" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupDists} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />
                    <List.Item
                        title="Choose Group Block"
                        description={`Group Block: ${groupBlock}`}
                        left={props => <List.Icon {...props} icon="map-marker-distance" />}
                        right={props => {
                            return <MenuPaper menuArrOfObjects={groupBlocks} />
                        }}
                        descriptionStyle={{
                            color: theme.colors.primary,
                        }}
                    />

                    <View style={{
                        flexDirection: "row",
                        marginBottom: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="account-multiple-plus-outline" mode="contained" onPress={() => {
                            Alert.alert(`Create group ${groupName}?`, `Are you sure, you want to create this group under this type ${groupType}?`, [{
                                onPress: () => handleSubmitGroupDetails(),
                                text: "Yes"
                            }, {
                                onPress: () => null,
                                text: "No"
                            }])

                        }}>
                            ADD GROUP
                        </ButtonPaper>
                        <ButtonPaper icon="arrow-right-bottom-bold" mode="contained-tonal" onPress={() => navigation.dispatch(CommonActions.navigate({
                            name: navigationRoutes.homeScreen
                        }))}>
                            GO TO GRT
                        </ButtonPaper>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GroupFormScreen

const styles = StyleSheet.create({})