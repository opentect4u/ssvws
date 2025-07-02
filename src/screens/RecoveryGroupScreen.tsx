import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import React from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import RecoveryGroupForm from './forms/RecoveryGroupForm'
import { useRoute } from '@react-navigation/native'
import { SCREEN_HEIGHT } from 'react-native-normalize'

const RecoveryGroupScreen = () => {
    const theme = usePaperColorScheme()
    const { params } = useRoute<any>()
    // 110 -> Branch Code
    // const navigation = useNavigation()

    // const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("LLLLLLLLLLLKKKKKKKKKKAAAAAAAAAAAAAss", params.group_details)

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Recovery Group Details" subtitle="View recovery details and members" isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    paddingBottom: 30
                }}>
                    <RecoveryGroupForm fetchedData={params.group_details} approvalStatus={params?.group_details?.status} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RecoveryGroupScreen

const styles = StyleSheet.create({})