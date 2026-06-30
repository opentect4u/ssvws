import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import BMPendingLoansScreen from '../screens/BMPendingLoansScreen'
import BMPendingLoanFormScreen from '../screens/BMPendingLoanFormScreen'

export default function BMPendingLoansNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.bmPendingLoansScreen} component={BMPendingLoansScreen} />
            <Stack.Screen name={navigationRoutes.bmPendingLoanFormScreen} component={BMPendingLoanFormScreen} />

        </Stack.Navigator>
    )
}