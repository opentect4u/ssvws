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

const SearchByGroupScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    const [search, setSearch] = useState(() => "")
    const [formsData, setFormsData] = useState<any[]>(() => [])
    // const [isApproved, setIsApproved] = useState<string>(() => "U")

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
            // branch_code: loginStore?.brn_code,
            co_id: loginStore?.emp_id,
            user_type: loginStore?.id, // newly added
            // flag: isApproved,
            group_name: search
        }

        await axios.post(`${ADDRESSES.SEARCH_GROUP}`, creds).then(res => {
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg)
                console.log("===++=++====", res?.data)
            }
        }).catch(err => {
            ToastAndroid.show("Some error while searching groups!", ToastAndroid.SHORT)
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
                <HeadingComp title="Existing Groups" subtitle="Find group" isBackEnabled />
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
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        gap: 5
                    }}>

                        <Searchbar
                            autoFocus
                            placeholder={"Search by Group Name"}
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
                            onClearIconPress={() => {
                                setSearch(() => "")
                                setFormsData(() => [])
                            }}
                        />

                        {/* <ButtonPaper icon={"text-search"} mode='elevated' onPress={handleSearch} style={{
                            marginTop: 10
                        }}>
                            Search
                        </ButtonPaper> */}
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
                                title={`${item?.group_name}`}
                                description={
                                    <View>
                                        <Text>Group Code: {item?.group_code}</Text>
                                        <Text style={{
                                            color: item?.branch_code !== loginStore?.brn_code ? theme.colors.error : theme.colors.green
                                        }}>Branch - {item?.branch_code}</Text>
                                    </View>
                                }
                                onPress={() => {
                                    navigation.dispatch(CommonActions.navigate({
                                        name: navigationRoutes.coGroupFormExtendedScreen,
                                        params: {
                                            group_details: item,
                                            // approvalFlag: isApproved
                                        }
                                    }))
                                }}
                                left={props => <List.Icon {...props} icon="form-select" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                right={props => (
                                    <View style={{
                                        alignSelf: 'center'
                                    }}>
                                        <Icon
                                            source={item?.approval_status === "U" ? "alpha-u-circle-outline" : "alpha-a-circle-outline"}
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
            {/* {loading && <LoadingOverlay />} */}
        </SafeAreaView>
    )
}

export default SearchByGroupScreen

const styles = StyleSheet.create({})