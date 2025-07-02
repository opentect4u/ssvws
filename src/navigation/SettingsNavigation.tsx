import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import HomeScreen from "../screens/HomeScreen"
import SettingsScreen from '../screens/SettingsScreen'
import PrintMain from '../screens/printer_connect_screens/PrintMain'

export default function SettingsNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.settingsScreen} component={SettingsScreen} />
            <Stack.Screen name={navigationRoutes.printerConnectScreen} component={PrintMain} />
            {/* <Stack.Screen name={navigationRoutes.printerConnectScreen} component={PrintMain} /> */}
            {/* <Stack.Screen
                name={navigationRoutes.productsScreen}
                component={ProductsScreen}
                options={{ animation: "fade_from_bottom" }}
            /> */}

        </Stack.Navigator>
    )
}