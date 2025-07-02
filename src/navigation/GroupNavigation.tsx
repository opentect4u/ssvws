import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import GroupFormScreen from "../screens/GroupFormScreen"

export default function GroupNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.grtFormScreen} component={GroupFormScreen} />
        </Stack.Navigator>
    )
}