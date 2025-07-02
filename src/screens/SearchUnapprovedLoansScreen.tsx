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

const SearchUnapprovedLoansScreen = () => {
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

    const [selectedForm, setSelectedForm] = useState({
        loan_id: "",
    })

    const fetchLoans = async () => {
        setLoading(true)

        const creds = {
            "branch_code":loginStore?.brn_code,
            "loan_id": "0",
            "approval_status": "U"
        }
        await axios.post(`${ADDRESSES.VIEW_LOAN_TNX}`, creds).then(res => {
            console.log(":::;;;:::", res?.data)
            if (res?.data?.suc === 1) {
                setFormsData(res?.data?.msg)
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching forms list!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    useEffect(() => {
        fetchLoans()
    }, [])

    useEffect(() => {
        setFilteredDataArray(formsData)
    }, [formsData])

    const handleFormListClick = (item: any, approvalStat: string) => {
        console.log("HIIIII")
        navigation.dispatch(CommonActions.navigate({
            name: navigationRoutes.recoveryMemberScreen,
            params: {
                member_details: item,
                group_details: {
                    status: approvalStat
                }
            }
        }))
    }

    const onChangeSearch = (query: string) => {
        // if (/^\d*$/.test(query)) {
        setSearch(query)
        const filteredData = formsData.filter((item) => {
            return item?.client_name?.toString()?.toLowerCase().includes(query?.toLowerCase())
        })
        setFilteredDataArray(filteredData)
        // } else {
        //     setFilteredDataArray(formsData)
        // }
    }

    const deleteLoan = async (loanId: any) => {
        setLoading(true)

        const creds = {
            "particulars": remarks,
            "deleted_by": loginStore?.emp_id,
            "loan_id": loanId
        }
        await axios.post(`${ADDRESSES.DELETE_TNX}`, creds).then(res => {
            console.log("DELETE LOAN ======== RESSS", res?.data)
            if (res?.data?.suc === 1) {
                ToastAndroid.show("Form Deleted!", ToastAndroid.SHORT)
                fetchLoans()
                setRemarks("")
                hideDialog()
            }
        }).catch(err => {
            console.log("FORM REJ ERRRR ====", err)
            ToastAndroid.show("Some error while deleting loan!", ToastAndroid.SHORT)
        })

        setLoading(false)
    }

    const onDialogSuccess = () => {
        Alert.alert("Delete Loan?", `Are you sure you want to delete loan ${selectedForm?.loan_id}?`, [{
            text: "NO",
            onPress: () => null
        }, {
            text: "YES",
            onPress: () => remarks ? deleteLoan(selectedForm?.loan_id) : ToastAndroid.show("Please write remarks!", ToastAndroid.SHORT)
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
                <HeadingComp title="Unapproved Loans" subtitle="Find any user to see his/her loan details" isBackEnabled />

                <View style={{
                    paddingHorizontal: 20
                }}>
                    <Searchbar
                        autoFocus
                        placeholder={"Find by Member Name"}
                        onChangeText={onChangeSearch}
                        value={search}
                        elevation={search ? 2 : 0}
                        keyboardType={"default"}
                        maxLength={18}
                        style={{
                            backgroundColor: theme.colors.tertiaryContainer,
                            color: theme.colors.onTertiaryContainer,
                        }}
                    // loading={search ? true : false}
                    />
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
                                        <Text>EMI: {item?.tot_emi}/-</Text>
                                        <Text>Outstanding - {item?.outstanding}/-</Text>
                                    </View>
                                }
                                onPress={() => handleFormListClick(item, item?.status)}
                                left={props => <List.Icon {...props} icon="form-select" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                right={props => (
                                    <IconButton
                                        icon="trash-can-outline"
                                        onPress={() => {
                                            setSelectedForm({
                                                loan_id: item?.loan_id,
                                            });
                                            setVisible(true);
                                        }}
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
                    btnSuccess={"DELETE"}
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

export default SearchUnapprovedLoansScreen

const styles = StyleSheet.create({})