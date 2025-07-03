import { Alert, BackHandler, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { MD2Colors, Text } from 'react-native-paper'
import React, { useContext, useEffect, useState } from 'react'
import ButtonPaper from '../components/ButtonPaper'
import InputPaper from '../components/InputPaper'
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import { usePaperColorScheme } from '../theme/theme'
import { AppStore } from '../context/AppContext'
// import DeviceInfo from "react-native-device-info"
// import axios from 'axios'
// import { ADDRESSES } from '../config/api_list'

const LoginScreen = () => {
    const theme = usePaperColorScheme()
    // const appVersion = DeviceInfo.getVersion()

    const {
        handleLogin,
        isLoading,
        fetchCurrentVersion,
        appVersion,
        uat
    } = useContext<any>(AppStore)

    const [username, setUsername] = useState(() => "")
    const [password, setPassword] = useState(() => "")

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                if (
                    granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Bluetooth permissions granted.');
                } else {
                    console.log('Bluetooth permissions denied.');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const requestNearbyDevicesPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Nearby devices permission granted.');
                } else {
                    console.log('Nearby devices permission denied.');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const requestPermissions = async () => {
        await requestBluetoothPermissions();
        await requestNearbyDevicesPermission();
    };

    useEffect(() => {
        requestPermissions()
        fetchCurrentVersion()
    }, [])

    useEffect(() => {
        fetchCurrentVersion()
    }, [username, password])

    const login = () => {
        handleLogin(username, password)
    }

    // console.log("Device Info Verison :", appVersion)

    // const fetchCurrentVersion = async () => {
    //     await axios.get(ADDRESSES.FETCH_APP_VERSION).then(res => {
    //         console.log("FETCH VERSION===RES", res?.data)

    //         if (+res?.data?.msg[0]?.version !== +appVersion) {
    //             Alert.alert("Version Mismatch!", "Please update the app to use.", [
    //                 { text: "CLOSE APP", onPress: () => BackHandler.exitApp() },
    //                 { text: "UPDATE", onPress: () => null },
    //             ], { cancelable: false })
    //         }

    //     }).catch(err => {
    //         console.log("VERSION FETCH ERR", err)
    //     })
    // }

    // useEffect(() => {
    //     fetchCurrentVersion()
    // }, [])

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.surfaceVariant
            }}>
                <View style={{
                    margin: 20,
                    justifyContent: "center",
                    height: SCREEN_HEIGHT,
                }}>

                    <View style={{
                        gap: 10,
                        backgroundColor: theme.colors.background,
                        padding: normalize(30),
                        paddingVertical: normalize(60),
                        borderTopRightRadius: normalize(50),
                        borderBottomLeftRadius: normalize(50)
                    }}>
                        {uat && <View style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            padding: 5,
                            backgroundColor: MD2Colors.yellow400,
                            borderRadius: 5,
                        }}>
                            <Text style={{
                                color: MD2Colors.red500,
                                fontWeight: "bold",
                                fontSize: 22
                            }}>UAT</Text>
                        </View>}
                        <View>
                            <Text variant='displayMedium' style={{
                                color: theme.colors.primary
                            }}>Login</Text>
                        </View>
                        <InputPaper label='Employee ID' onChangeText={(e: string) => setUsername(e)} value={username} customStyle={{
                            backgroundColor: theme.colors.background
                        }} />
                        <InputPaper label='Password' onChangeText={(e: string) => setPassword(e)} value={password} secureTextEntry customStyle={{
                            backgroundColor: theme.colors.background
                        }} />

                        {/* @ts-ignore */}
                        <ButtonPaper mode='elevated' onPress={login} icon="login" style={{
                            marginTop: normalize(20)
                        }} loading={isLoading} disabled={isLoading || !username || !password}>
                            Login
                        </ButtonPaper>
                        <View>
                            <Text variant='bodyMedium' style={{
                                position: "absolute",
                                top: 40,
                                left: 240,
                            }}>App Version: {appVersion}</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})