import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import ReportsChooseScreen from '../screens/reports/ReportsChooseScreen'
import RecoveryReportScreen from '../screens/reports/RecoveryReportScreen'
import DisbursementReportScreen from '../screens/reports/DisbursementReportScreen'
import GroupwiseRecovery from '../screens/reports/GroupwiseRecovery'
import DemandReport from '../screens/reports/DemandReport'
import AttendanceReportScreen from '../screens/reports/AttendanceReportScreen'

export default function ReportsNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.reportsChooseScreen} component={ReportsChooseScreen} />
            <Stack.Screen name={navigationRoutes.recoveryReportScreen} component={RecoveryReportScreen} />
            <Stack.Screen name={navigationRoutes.disbursementReportScreen} component={DisbursementReportScreen} />
            <Stack.Screen name={navigationRoutes.groupwiseRecovery} component={GroupwiseRecovery} />
            <Stack.Screen name={navigationRoutes.demandReport} component={DemandReport} />
            <Stack.Screen name={navigationRoutes.attendanceReportScreen} component={AttendanceReportScreen} />

        </Stack.Navigator>
    )
}