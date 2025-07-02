import { StyleSheet, SafeAreaView, View, ScrollView } from 'react-native'
import { Text } from "react-native-paper"
import React, { useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import CollectionButtonsWrapper from "../components/CollectionButtonsWrapper"
import CollectionButton from "../components/CollectionButton"
import { SCREEN_HEIGHT } from 'react-native-normalize'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'

const SearchTransactionChooseScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Choose Transaction" subtitle="Choose desired search type" isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10
                }}>
                    <CollectionButtonsWrapper>
                        <CollectionButton
                            icon={"check-outline"}
                            text="Approved"
                            color={theme.colors.secondaryContainer}
                            textColor={theme.colors.onSecondaryContainer}
                            onPress={() => {
                                navigation.dispatch(CommonActions.navigate({
                                    name: navigationRoutes.searchApprovedLoansScreen
                                }))
                            }}
                        />
                        <CollectionButton
                            icon={"close-outline"}
                            text="Un-approved"
                            color={theme.colors.tertiaryContainer}
                            textColor={theme.colors.onTertiaryContainer}
                            onPress={() => {
                                navigation.dispatch(CommonActions.navigate({
                                    name: navigationRoutes.searchUnapprovedLoansScreen
                                }))
                            }}
                        />
                    </CollectionButtonsWrapper>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchTransactionChooseScreen

const styles = StyleSheet.create({})