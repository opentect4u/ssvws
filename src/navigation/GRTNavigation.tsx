import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import GRTFormScreen from "../screens/GRTFormScreen"

export default function GRTNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.grtFormScreen} component={GRTFormScreen} />
        </Stack.Navigator>
    )
}