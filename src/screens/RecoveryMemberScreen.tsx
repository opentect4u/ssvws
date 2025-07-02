import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import React from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import RecoveryMemberForm from './forms/RecoveryMemberForm'
import { useRoute } from '@react-navigation/native'
import { SCREEN_HEIGHT } from 'react-native-normalize'

const RecoveryMemberScreen = () => {
    const theme = usePaperColorScheme()
    const { params } = useRoute<any>()
    // 110 -> Branch Code
    // const navigation = useNavigation()

    // const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LLLLLLLLLLLKKKKKKKKKKAAAAAAAAAAAAA", params.member_details)

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Recovery Member Details" subtitle="View recovery details" isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    paddingBottom: 30
                }}>
                    <RecoveryMemberForm fetchedData={params.member_details} approvalStatus={params?.group_details?.status} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RecoveryMemberScreen

const styles = StyleSheet.create({})