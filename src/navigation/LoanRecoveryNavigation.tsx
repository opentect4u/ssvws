import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import SearchLoanRecoveryScreen from '../screens/SearchLoanRecoveryScreen'
import RecoveryGroupScreen from '../screens/RecoveryGroupScreen'
import RecoveryMemberScreen from '../screens/RecoveryMemberScreen'

export default function LoanRecoveryNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.searchLoanRecoveryScreen} component={SearchLoanRecoveryScreen} />
            <Stack.Screen name={navigationRoutes.recoveryGroupScreen} component={RecoveryGroupScreen} />
            <Stack.Screen name={navigationRoutes.recoveryMemberScreen} component={RecoveryMemberScreen} />
        </Stack.Navigator>
    )
}