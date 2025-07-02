
import React from 'react'
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { usePaperColorScheme } from "../theme/theme"
import SettingsNavigation from "./SettingsNavigation"
import HomeNavigation from "./HomeNavigation"
import GRTNavigation from "./GRTNavigation"
import GroupNavigation from "./GroupNavigation"
import BMPendingLoansNavigation from "./BMPendingLoansNavigation"
import SearchNavigation from "./SearchNavigation"
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'
import useCurrentRouteName from "../hooks/useCurrentRoute"
import LoanRecoveryNavigation from "./LoanRecoveryNavigation"
import ReportsNavigation from "./ReportsNavigation"
import DemandNavigation from './DemandNavigation'
// import { loginStorage } from "../storage/appStorage"
// import { LoginDataMessage } from "../models/api_types"

const Tab = createMaterialBottomTabNavigator()

function BottomNavigationPaper() {
    const theme = usePaperColorScheme()
    const currentRoute = useCurrentRouteName()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    console.log("CURRNT ROUTE: ", currentRoute)

    const shouldHideTabBar = ["BMPendingLoanFormScreen", "SearchByGroupScreen", "COGroupFormExtendedScreen", "SearchByMemberScreen", "MemberDetailsAllFormScreen", "BMPendingLoansScreen", "RecoveryGroupScreen", "RecoveryMemberScreen", "AvailableFormsScreen", "SearchByCOScreen", "FormsAgainstCOScreen", "SearchTransactionChooseScreen", "SearchApprovedLoansScreen", "SearchUnapprovedLoansScreen", "GRTFormScreen", "RecoveryReportScreen"].includes(currentRoute)

    const checkBMOrCOFlag = loginStore?.id // 1-> BU, 2-> BM, 3-> MIS

    return (
        <Tab.Navigator
            theme={theme}
            initialRouteName="Home"
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurface}
            barStyle={{
                backgroundColor: theme.colors.surface,
                borderTopWidth: 0.4,
                borderColor: theme.colors.secondaryContainer,
                display: !shouldHideTabBar ? "flex" : "none"
            }}
            shifting
            compact
        >
            <Tab.Screen
                name={navigationRoutes.homeNavigation}
                component={HomeNavigation}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="home-outline"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                }}
            />
            {checkBMOrCOFlag === 1 || checkBMOrCOFlag===2 ? (
                <>
                    {/* <Tab.Screen
                        name={navigationRoutes.grtNavigation}
                        component={GRTNavigation}
                        options={{
                            tabBarLabel: "GRT Form",
                            tabBarIcon: ({ color, focused }) =>
                                !focused ? (
                                    <MaterialCommunityIcons
                                        name="form-select"
                                        color={color}
                                        size={26}
                                    />
                                ) : (
                                    <MaterialCommunityIcons name="form-dropdown" color={color} size={26} />
                                ),
                        }}
                    /> */}
                    {/* <Tab.Screen
                        name={navigationRoutes.searchNavigation}
                        component={SearchNavigation}
                        options={{
                            tabBarLabel: "Search",
                            tabBarIcon: ({ color, focused }) =>
                                !focused ? (
                                    <MaterialCommunityIcons
                                        name="database-search-outline"
                                        color={color}
                                        size={26}
                                    />
                                ) : (
                                    <MaterialCommunityIcons name="database-search" color={color} size={26} />
                                ),
                        }}
                    /> */}
                    {/* <Tab.Screen
                        name={navigationRoutes.groupNavigation}
                        component={GroupNavigation}
                        options={{
                            tabBarLabel: "Create Group",
                            tabBarIcon: ({ color, focused }) =>
                                !focused ? (
                                    <MaterialCommunityIcons
                                        name="account-multiple-plus-outline"
                                        color={color}
                                        size={26}
                                    />
                                ) : (
                                    <MaterialCommunityIcons name="account-multiple-plus" color={color} size={26} />
                                ),
                        }}
                    /> */}
                </>
            )
                : checkBMOrCOFlag === 1 || checkBMOrCOFlag === 2 ? (
                    // <Tab.Screen
                    //     name={navigationRoutes.bmPendingLoansNavigation}
                    //     component={BMPendingLoansNavigation}
                    //     options={{
                    //         tabBarLabel: "Pending Forms",
                    //         tabBarIcon: ({ color, focused }) =>
                    //             !focused ? (
                    //                 <MaterialCommunityIcons
                    //                     name="form-select"
                    //                     color={color}
                    //                     size={26}
                    //                 />
                    //             ) : (
                    //                 <MaterialCommunityIcons name="form-dropdown" color={color} size={26} />
                    //             ),
                    //     }}
                    // />
                    null
                )
                    : (null)
            }
            {/* ===========================to be enabled================= */}
            {(loginStore?.id === 1 || loginStore?.id === 2) &&   <Tab.Screen
                name={navigationRoutes.reportsNavigation}
                component={ReportsNavigation}
                options={{
                    tabBarLabel: "Reports",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="table"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="table-headers-eye" color={color} size={26} />
                        ),
                }}
            />}
            {/* ===========================to be enabled================= */}

            {(loginStore?.id === 1 || loginStore?.id === 2) && <Tab.Screen
                name={navigationRoutes.loanRecoveryNavigation}
                component={LoanRecoveryNavigation}
                options={{
                    tabBarLabel: "Loan Recovery",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="refresh"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="refresh-circle" color={color} size={26} />
                        ),
                }}
            />}

{(loginStore?.id === 1 || loginStore?.id === 2) &&  <Tab.Screen
                name={navigationRoutes.searchNavigation}
                component={SearchNavigation}
                options={{
                    tabBarLabel: "Search",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="database-search-outline"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="database-search" color={color} size={26} />
                        ),
                }}
            />}
            {/* <Tab.Screen
                name={navigationRoutes.DemandNavigation}
                component={DemandNavigation}
                options={{
                    tabBarLabel: "Demand",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="hand-extended-outline"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="hand-heart" color={color} size={26} />
                        ),
                }}
            /> */}
            <Tab.Screen
                name={navigationRoutes.settingsNavigation}
                component={SettingsNavigation}
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons
                                name="cog-outline"
                                color={color}
                                size={26}
                            />
                        ) : (
                            <MaterialCommunityIcons name="cog" color={color} size={26} />
                        ),
                }}
            />

        </Tab.Navigator>
    )
}

export default BottomNavigationPaper