import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import React from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import BMBasicDetailsForm from './forms/BMBasicDetailsForm'
import { loginStorage } from '../storage/appStorage'

const GRTFormScreen = () => {
    const theme = usePaperColorScheme()
    // 110 -> Branch Code
    // const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="GRT Form" subtitle="Basic Details" isBackEnabled />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10
                }}>
                    <BMBasicDetailsForm flag='CO' branchCode={loginStore?.brn_code} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GRTFormScreen

const styles = StyleSheet.create({})