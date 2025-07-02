import { StyleSheet, SafeAreaView, ScrollView, View, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import { Divider, IconButton, List, Searchbar, Text } from 'react-native-paper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'
import LoadingOverlay from '../components/LoadingOverlay'
import DialogBox from '../components/DialogBox'
import InputPaper from '../components/InputPaper'
import ButtonPaper from '../components/ButtonPaper'

const BMPendingLoansScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const [loading, setLoading] = useState(() => false)

    const [visible, setVisible] = useState(() => false)
    const hideDialog = () => setVisible(() => false)

    const [remarks, setRemarks] = useState(() => "")

    const [search, setSearch] = useState(() => "")
    const [formsData, setFormsData] = useState(() => [])
    const [filteredDataArray, setFilteredDataArray] = useState(() => [])

    // const [AssignGroup, setAssignGroup] = useState(() => "")

    const [selectedForm, setSelectedForm] = useState({
        formNo: "",
        branchCode: "",
        memberCode: ""
    })

    // const fetchPendingGRTForms = async () => {
    //     setLoading(true)

    //     await axios.get(`${ADDRESSES.FETCH_FORMS}?branch_code=${loginStore?.brn_code}`).then(res => {
    //         console.log(":::;;;:::", res?.data)
    //         if (res?.data?.suc === 1) {
    //             setFormsData(res?.data?.msg)
    //         }
    //     }).catch(err => {
    //         ToastAndroid.show("Some error while fetching forms list!", ToastAndroid.SHORT)
    //     })

    //     setLoading(false)
    // }

    const searchPendingGRTForms = async () => {
        setLoading(true)

        const creds = {
            "bm_search_pending": search,
            "branch_code": loginStore?.brn_code
        }

        await axios.post(`${ADDRESSES.BM_SEARCH_PENDING_FORM}`, creds).then(res => {
            console.log(":::;;;:::", res?.data)
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg)

            } else {
                setFormsData(() => [])
            }

            // if(res?.data.group_code != undefined){
            //     setAssignGroup(res?.data?.msg)
            // } else {
            //     setAssignGroup(() => "")
            // }

        }).catch(err => {
            ToastAndroid.show("Some error while fetching forms list!", ToastAndroid.SHORT)

        })

        setLoading(false)
    }

    // useEffect(() => {
    //     fetchPendingGRTForms()
    // }, [])

    useEffect(() => {
        setFilteredDataArray(formsData)
    }, [formsData])

    const handleFormListClick = (formNo: any, brCode: any) => {
        console.log("HIIIII")
        navigation.dispatch(CommonActions.navigate({
            name: navigationRoutes.bmPendingLoanFormScreen,
            params: {
                formNumber: formNo,
                branchCode: brCode
            }
        }))
    }

    const onChangeSearch = (query: string) => {
        // if (/^\d*$/.test(query)) {
        setSearch(query)
        ///////////////////////////
        // const filteredData = formsData.filter((item) => {
        //     return item?.client_name?.toString()?.toLowerCase().includes(query?.toLowerCase())
        // })
        // setFilteredDataArray(filteredData)
        //////////////////////////
        // } else {
        //     setFilteredDataArray(formsData)
        // }
    }

    const rejectForm = async (formNo: any, branchCode: any, memberCode: any) => {
        setLoading(true)

        const creds = {
            form_no: formNo,
            branch_code: branchCode,
            member_code: memberCode,
            remarks: remarks,
            deleted_by: loginStore?.emp_id
        }
        await axios.post(`${ADDRESSES.DELETE_FORM}`, creds).then(res => {
            console.log("DELETE FORM ======== RESSS", res?.data)
            if (res?.data?.suc === 1) {
                ToastAndroid.show("Form Deleted!", ToastAndroid.SHORT)
                // fetchPendingGRTForms()
                setRemarks("")
                hideDialog()
            }
        }).catch(err => {
            console.log("FORM REJ ERRRR ====", err)
            ToastAndroid.show("Some error while rejecting form!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    const onDialogSuccess = () => {
        Alert.alert("Delete Form?", `Are you sure you want to delete form ${selectedForm?.formNo}?`, [{
            text: "NO",
            onPress: () => null
        }, {
            text: "YES",
            onPress: () => remarks ? rejectForm(selectedForm?.formNo, selectedForm?.branchCode, selectedForm?.memberCode) : ToastAndroid.show("Please write remarks!", ToastAndroid.SHORT)
        }])
    }

    const onDialogFailure = () => {
        setRemarks("")
        hideDialog()
    }

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                minHeight: SCREEN_HEIGHT,
                height: 'auto',
            }} keyboardShouldPersistTaps="handled">
                <HeadingComp title="Pending Forms" subtitle="Search by Member Name/Code/Aadhaar/Mobile/PAN and Choose Form" isBackEnabled />
                {/* <BMPendingLoanFormScreen /> */}

                <View style={{
                    paddingHorizontal: 20,
                    gap: 10
                }}>
                    <Searchbar
                        autoFocus
                        placeholder={"Name/Code/Aadhaar/Mobile/PAN"}
                        onChangeText={onChangeSearch}
                        value={search}
                        elevation={search ? 2 : 0}
                        keyboardType={"default"}
                        maxLength={18}
                        style={{
                            backgroundColor: theme.colors.tertiaryContainer,
                            color: theme.colors.onTertiaryContainer,
                        }}
                        loading={loading}
                    />

                    <ButtonPaper mode='elevated' onPress={async () => await searchPendingGRTForms()} icon={"text-box-search-outline"}>
                        Search
                    </ButtonPaper>
                </View>




                <View style={{
                    padding: 20,
                    paddingBottom: 120
                }}>
                    {filteredDataArray?.map((item, i) => (
                        <React.Fragment key={i}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                key={i}
                                title={`${item?.client_name}`}
                                description={
                                    <View>
                                        {item?.prov_grp_code === 0 && (<Text style={{
                                            backgroundColor: theme.colors.errorContainer,
                                            color: theme.colors.onErrorContainer, fontSize: 12, lineHeight: 22, textAlign: 'center', borderRadius: 4
                                        }}>Group Not Assigned</Text>)}
                                        <Text>Form No: {item?.form_no}</Text>
                                        <Text>GRT Date - {item?.grt_date ? new Date(item?.grt_date).toLocaleDateString("en-GB") : "No Date"}</Text>
                                    </View>
                                }
                                // onPress={() => handleFormListClick(item?.form_no, item?.branch_code)}
                                onPress={item?.prov_grp_code === 0 ? null : () => handleFormListClick(item?.form_no, item?.branch_code)}
                                left={props => <List.Icon {...props} icon="form-select" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)

                                right={props => (
                                    <IconButton
                                        icon="trash-can-outline"

                                        onPress={() => {
                                            setSelectedForm({
                                                formNo: item?.form_no,
                                                branchCode: item?.branch_code,
                                                memberCode: item?.member_code
                                            });
                                            setVisible(true);
                                        }}

                                        // onPress={
                                        //     item?.prov_grp_code === 0
                                        //         ? null // Disables button (unclickable)
                                        //         : () => {
                                        //             setSelectedForm({
                                        //                 form_no: item?.form_no,
                                        //                 branch_code: item?.branch_code,
                                        //                 member_code: item?.member_code
                                        //             });
                                        //             setVisible(true);
                                        //         }
                                        // }


                                        size={28}
                                        iconColor={theme.colors.error}
                                        style={{
                                            alignSelf: 'center'
                                        }}
                                    />
                                )}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>
                <DialogBox
                    visible={visible}
                    title="Remarks"
                    hide={hideDialog}
                    titleStyle={{ textAlign: "center" }}
                    btnSuccess={"REJECT"}
                    btnFail="CANCEL"
                    onFailure={onDialogFailure}
                    onSuccess={onDialogSuccess}>
                    <View>
                        {/* <Text variant='bodyLarge'>Reason</Text> */}
                        <InputPaper label="Write Remarks" multiline leftIcon='comment-remove-outline' value={remarks} onChangeText={(txt: any) => setRemarks(txt)} customStyle={{
                            backgroundColor: theme.colors.surface,
                            minHeight: 95,
                        }} />
                    </View>
                </DialogBox>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMPendingLoansScreen

const styles = StyleSheet.create({})