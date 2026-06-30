import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import BMBasicDetailsForm from './forms/BMBasicDetailsForm'
import { loginStorage } from '../storage/appStorage'

const GRTFormScreen = () => {
    const theme = usePaperColorScheme();
    const [isHeaderShown,setHeaderShownStatus] = useState(true);
    // 110 -> Branch Code
    // const navigation = useNavigation()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    return (
        <SafeAreaView
        >
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
        }}
        
        >
                {isHeaderShown && <HeadingComp title="GRT Form" subtitle="Basic Details" isBackEnabled />}
                <View style={{
                    paddingHorizontal: isHeaderShown ? 20 : 0,
                    paddingTop: isHeaderShown  ? 10 : 0,
                    gap: isHeaderShown ? 10 : 0,
                }}>
                    <BMBasicDetailsForm 
                    closeHeader={(e:boolean)=>{
                        setHeaderShownStatus(e)
                    }}
                    flag='CO' branchCode={loginStore?.brn_code} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GRTFormScreen

const styles = StyleSheet.create({})