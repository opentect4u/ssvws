
import React from 'react'
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { usePaperColorScheme } from "../theme/theme"
import SettingsNavigation from "./SettingsNavigation"
import HomeNavigation from "./HomeNavigation"
import GRTNavigation from "./GRTNavigation"
import GroupNavigation from "./GroupNavigation"
import navigationRoutes from '../routes/routes'
// import ReportsNavigation from "./ReportsNavigation"
// import MoreNavigation from "./MoreNavigation"
// import CalculateNavigation from "./CalculateModeNavigation"
// import useCurrentRouteName from "../hooks/useCurrentRoute"
// import { loginStorage } from "../storage/appStorage"
// import { LoginDataMessage } from "../models/api_types"

const Tab = createMaterialBottomTabNavigator()

function BottomNavigationPaper() {
    const theme = usePaperColorScheme()
    // const currentRoute = useCurrentRouteName()
    // const loginStore = JSON.parse(loginStorage.getString("login-data")) as LoginDataMessage

    // console.log("CURRNT ROUTE: ", currentRoute)

    // const shouldHideTabBar = ["BottomNavigationPaper", "Home", "HomeScreen", "More", "MoreScreen", "Reports", "ReportsScreen", "Settings", "SettingsScreen", "CalculateMode", "CalculateModeScreen"].includes(currentRoute)

    const checkBMOrCOFlag: "B" | "C" = "B"

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
                // display: shouldHideTabBar ? "flex" : "none"
            }}
            // shifting
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
            <Tab.Screen
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
            />
            <Tab.Screen
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
            />
            {/* <Tab.Screen
                name="Reports"
                component={ReportsNavigation}
                options={{
                    tabBarLabel: "Reports",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons name="chart-bar-stacked" color={color} size={26} />
                        ) : (
                            <MaterialCommunityIcons
                                name="chart-bar"
                                color={color}
                                size={26}
                            />
                        ),
                }}
            />
            <Tab.Screen
                name="More"
                component={MoreNavigation}
                options={{
                    tabBarLabel: "More",
                    tabBarIcon: ({ color, focused }) =>
                        !focused ? (
                            <MaterialCommunityIcons name="menu" color={color} size={26} />
                        ) : (
                            <MaterialCommunityIcons
                                name="menu-open"
                                color={color}
                                size={26}
                            />
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