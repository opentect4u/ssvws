import { StyleSheet, SafeAreaView, ScrollView, View, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import { Divider, Icon, IconButton, List, Searchbar, Text } from 'react-native-paper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'
import RadioComp from '../components/RadioComp'

const SearchByCOScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

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

    const handleSearch = async () => {
        setLoading(true)

        const creds = {
            branch_code: loginStore?.brn_code,
            // flag: isApproved,
            co_search: search
        }

        console.log(">>>>>>>>>>>>>>", creds)

        await axios.post(`${ADDRESSES.SEARCH_CO}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg)
                console.log("===++=++====", res?.data)
            }
        }).catch(err => {
            ToastAndroid.show("Some error while searching members!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                minHeight: SCREEN_HEIGHT,
                height: 'auto',
            }} keyboardShouldPersistTaps="handled">
                <HeadingComp title="Existing COs" subtitle="Find Credit Officers by" isBackEnabled />
                <View style={{
                    paddingHorizontal: 20
                }}>
                    {/* <View style={{
                        padding: 5,
                        backgroundColor: theme.colors.errorContainer,
                        borderTopLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        marginBottom: 10
                    }}>
                        <RadioComp
                            color={theme.colors.onErrorContainer}
                            radioButtonColor={theme.colors.error}
                            title=""
                            icon="inbox-multiple"
                            dataArray={[
                                {
                                    optionName: "Un-approved",
                                    optionState: isApproved,
                                    currentState: "U",
                                    optionSetStateDispathFun: (value) => setIsApproved(value)
                                },
                                {
                                    optionName: "Approved",
                                    optionState: isApproved,
                                    currentState: "A",
                                    optionSetStateDispathFun: (value) => setIsApproved(value)
                                }
                            ]}
                        />
                    </View> */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 5
                    }}>

                        <Searchbar
                            autoFocus
                            placeholder={"Employee ID/Name"}
                            onChangeText={onChangeSearch}
                            value={search}
                            elevation={search ? 2 : 0}
                            keyboardType={"default"}
                            maxLength={30}
                            style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                color: theme.colors.onTertiaryContainer,
                                width: "84%",
                                paddingVertical: 1,
                                alignItems: "center",
                                alignSelf: "center"
                            }}
                            loading={loading ? true : false}
                        />

                        <IconButton icon={"magnify"} mode='contained' onPress={() => search && handleSearch()} size={35} style={{
                            borderTopLeftRadius: 10
                        }} />
                    </View>
                </View>

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
                                title={`${item?.emp_name}`}
                                description={
                                    <View>
                                        {/* <Text>Member Code: {item?.member_code}</Text> */}
                                        <Text>Employee ID - {item?.emp_id || "Nil"}</Text>
                                        {/* <Text style={{
                                            color: item?.branch_code !== loginStore?.brn_code ? theme.colors.error : theme.colors.green
                                        }}>PIN No. {item?.pin_code || "Nil"}</Text> */}
                                    </View>
                                }
                                onPress={() => {
                                    navigation.dispatch(CommonActions.navigate({
                                        name: navigationRoutes.formsAgainstCOScreen,
                                        params: {
                                            emp_details: item,
                                            emp_code: item?.emp_id
                                            // formNumber: item?.form_no,
                                            // branchCode: item?.branch_code,
                                            // userFlag: loginStore?.id === 1 ? "CO" : loginStore?.id === 2 ? "BM" : "",
                                            // approvalFlag: isApproved
                                        }
                                    }))
                                }}
                                left={props => <List.Icon {...props} icon="account-arrow-right-outline" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                right={props => (
                                    <View style={{
                                        alignSelf: 'center'
                                    }}>
                                        {/* <Icon
                                            source={item?.approval_status === "U" ? "alpha-u-circle-outline" : item?.approval_status === "A" ? "alpha-a-circle-outline" : item?.approval_status === "S" ? "alpha-s-circle-outline" : "Err"}
                                            size={28}
                                            color={item?.approval_status === "U" ? theme.colors.error : theme.colors.green}
                                        /> */}
                                    </View>
                                )}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
            {/* {loading && <LoadingOverlay />} */}
        </SafeAreaView>
    )
}

export default SearchByCOScreen

const styles = StyleSheet.create({})