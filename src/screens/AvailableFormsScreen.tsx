import { StyleSheet, SafeAreaView, ScrollView, View, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import { Divider, Icon, IconButton, List, Searchbar, Text } from 'react-native-paper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { CommonActions, useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'
import RadioComp from '../components/RadioComp'
import LoadingOverlay from '../components/LoadingOverlay'

const AvailableFormsScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const { params } = useRoute<any>()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    const [search, setSearch] = useState(() => "")
    const [formsData, setFormsData] = useState<any[]>(() => [])
    const [isApproved, setIsApproved] = useState<string>(() => "U")

    const onChangeSearch = (query: string) => {
        setSearch(query)
    }

    // useEffect(() => {
    //     setFormsData(() => [])
    // }, [isApproved])

    useEffect(() => {
        setSearch("")
        setFormsData(() => [])
    }, [isFocused])

    const handleFetchExistingGRTForms = async () => {
        setLoading(true)

        // const creds = {
        //     member_code: params?.member_code
        // }

        // console.log(">>>>>>>>>>>>>>", creds)

        await axios.get(`${ADDRESSES.GET_GRT_DETAILS}?member_code=${params?.member_code}`).then(res => {
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg)
                console.log("===++=++====", res?.data)
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching GRT forms!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    useEffect(() => {
        handleFetchExistingGRTForms()
    }, [])

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                minHeight: SCREEN_HEIGHT,
                height: 'auto',
            }} keyboardShouldPersistTaps="handled">
                <HeadingComp title="Available Forms" subtitle="Find existing forms" isBackEnabled />

                <View style={{
                    padding: 20,
                    paddingBottom: 120
                }}>
                    {formsData?.map((item, i) => (
                        <React.Fragment key={i}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                key={i}
                                title={`${new Date(item?.grt_date).toLocaleDateString("en-GB")}`}
                                description={
                                    <View>
                                        {/* <Text>Member Code: {item?.member_code}</Text> */}
                                        <Text>{item?.group_name || "Nil"} - {item?.prov_grp_code || "Nil"}</Text>
                                        <Text style={{
                                            color: item?.branch_code !== loginStore?.brn_code ? theme.colors.error : theme.colors.green
                                        }}>Branch - {item?.branch_name}</Text>
                                    </View>
                                }
                                onPress={() => {
                                    item?.approval_status !== "U"
                                        ? navigation.dispatch(CommonActions.navigate({
                                            name: navigationRoutes.memberDetailsAllFormScreen,
                                            params: {
                                                member_details: item,
                                                formNumber: item?.form_no,
                                                branchCode: item?.branch_code,
                                                userFlag: loginStore?.id === 1 ? "CO" : loginStore?.id === 2 ? "BM" : "",
                                                // approvalStatus: item?.approval_status
                                                // approvalFlag: isApproved
                                            }
                                        }))
                                        : Alert.alert("Message", "GRT Form is not filled by the Branch Manager yet.", [{
                                            text: "OK",
                                            onPress: () => null
                                        }])
                                }}
                                left={props => <List.Icon {...props} icon="form-select" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                right={props => (
                                    <View style={{
                                        alignSelf: 'center'
                                    }}>
                                        <Icon
                                            source={`alpha-${item?.approval_status?.toLowerCase()}-circle-outline`}
                                            // source={item?.approval_status === "U" ? "alpha-u-circle-outline" : item?.approval_status === "A" ? "alpha-a-circle-outline" : item?.approval_status === "S" ? "alpha-s-circle-outline" : "Err"}
                                            size={28}
                                            color={item?.approval_status === "U" ? theme.colors.error : theme.colors.green}
                                        />
                                    </View>
                                )}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default AvailableFormsScreen

const styles = StyleSheet.create({})