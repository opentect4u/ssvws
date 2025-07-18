import { Alert, BackHandler, Dimensions, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { ActivityIndicator, MD2Colors, Text } from 'react-native-paper'
import React, { useContext, useEffect, useState } from 'react'
import ButtonPaper from '../components/ButtonPaper'
import InputPaper from '../components/InputPaper'
import normalize, { SCREEN_HEIGHT } from "react-native-normalize"
import { usePaperColorScheme } from '../theme/theme'
import { AppStore } from '../context/AppContext'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import DropDownPicker from 'react-native-dropdown-picker'
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
    const [userId, setUserId] = useState(() => 0)
    const [open, setOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [branch, setBranch] = useState([]);
    const [branchLoadPending, setBranchLoadPending] = useState(false);
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
        const branchName = branch.find(el => el.code === selectedBranch)?.name || "";
        handleLogin(username, password,selectedBranch,userId,branchName)
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

    const fetchEmpType = async (empId: string) => {
        setBranch([]);
        setSelectedBranch("");
        setUserId(0);
        setBranchLoadPending(true);
        if (empId) {
            axios.post(`${ADDRESSES.FETCH_EMP_TYPE}`,
                {
                    emp_id: empId
                }
            ).then(res => {
                console.log("EMP TYPE ====", res?.data)
                if (res?.data?.suc === 1) {
                    if(res?.data?.msg?.length > 0) {
                        setUserId(res?.data?.msg[0]?.id);
                        if(res?.data?.msg[0]?.id == 2){
                            fetchAssignedBranches(empId)
                        }
                        else{
                            setBranchLoadPending(false);
                        }
                    }
                } else {
                    setBranchLoadPending(false);
                    // Alert.alert("Invalid Employee ID", "Please enter a valid Employee ID.")
                }
            }).catch(err => {
                setBranchLoadPending(false);
                console.error(err);
                // Alert.alert("Error", "Failed to fetch employee type. Please try again later.")
            })
        }
        else{
            setBranchLoadPending(false);
        }
    }

    const fetchAssignedBranches = async (empId: string) => {
        if (empId) {
            try {
                    const res =  await axios.post(`${ADDRESSES.FTECH_BRN_ASSIGN}`, { emp_id: empId });
                    if(res?.request?.status == 200){
                        if(res?.data?.suc === 1) {
                             if(res?.data?.msg?.length > 0) {
                                // const dt = res?.data?.msg.map((el: any) => {
                                //     return {
                                //         label: el?.name,
                                //         valie: el?.code
                                //     }
                                // });
                                setBranch(res?.data?.msg);
                             }
                        }
                    }
                    setBranchLoadPending(false);
            } catch (err) {
                console.error(err);
            }
        }
        else{
            setBranchLoadPending(false);
        }
    }

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
                        <InputPaper label='Employee ID' onChangeText={(e: string) => {
                            setUsername(e);
                            // 
                        }} 
                        onBlur={() => {
                            // console.log("EMP ID BLUR", username);
                            fetchEmpType(username);
                        }}
                        value={username} customStyle={{
                            backgroundColor: theme.colors.background
                        }} />
                        <InputPaper label='Password'
                         onChangeText={(e: string) => setPassword(e)} 
                         value={password} secureTextEntry customStyle={{
                            backgroundColor: theme.colors.background
                        }} />
                         {/* {userId == 2 && <DropDownPicker
                                open={open}
                                key={'value'}
                                // itemKey='value'
                                multiple={false}
                                value={selectedBranch}
                                modalAnimationType='slide'
                                listMode='MODAL'
                                placeholder='Select Branch'
                                items={branch}
                                setOpen={setOpen}
                                setValue={setSelectedBranch}
                                // setItems={setBranch}
                            />} */}
                            {userId == 2 && <DropDownPicker
                              searchable={true}
                              placeholder='--Select Branch--'
                            
                              dropDownContainerStyle={{
                                borderColor:theme.colors.backdrop,
                                zIndex:99999999,
                              }}
                              searchContainerStyle={{
                                  borderColor:theme.colors.outlineVariant,
                              }}
                              searchTextInputStyle={{
                                borderColor:theme.colors.outlineVariant,
                                borderRadius:2,
                                height:40
                              }}
                              labelStyle={{
                                fontFamily: 'Montserrat-Medium',
                                fontSize:12,
                              }}
                              textStyle={{
                                fontFamily: 'Montserrat-Medium',
                                fontSize:12,
                                fontWeight:'500'
                              }}
                              style={{
                                borderTopWidth:0,
                                borderLeftWidth:0,
                                borderRightWidth:0,
                                borderColor:theme.colors.outlineVariant,
                                height:60,
                                backgroundColor:theme.dark ? theme.colors.background : theme.colors.elevation.level0
                              }}
                              listMode='MODAL'
                              modalAnimationType='slide'
                              disableBorderRadius={true}
                              schema={{
                                label:'name',
                                value:'code'
                              }}
                              
                              //  value={formik?.values.personalInformation.unitId}
                              value={selectedBranch}
                              closeOnBackPressed={true}
                              open={open}
                              onSelectItem={(e)=>{
                                console.log(e)
                                // formik.setFieldValue("notifyToEmployeeId",e.employeeId)
                                setSelectedBranch(e.code)
                              }}  
                              items={branch}
                              setOpen={setOpen}
                            />}
                        {branchLoadPending &&   <ActivityIndicator size={'large'} />}

                        {/* @ts-ignore */}
                        <ButtonPaper mode='elevated' onPress={login} icon="login" style={{
                            marginTop: normalize(20)
                        }} loading={isLoading} disabled={isLoading || !username || !password || (userId == 2 && !selectedBranch)}>
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