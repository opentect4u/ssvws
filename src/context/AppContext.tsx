import axios from "axios"
import React, { createContext, useEffect, useRef, useState } from "react"
import { AppState, ToastAndroid, BackHandler, Text } from "react-native"
import { loginStorage } from "../storage/appStorage"
import { ADDRESSES } from "../config/api_list"
import DeviceInfo from "react-native-device-info"
import DialogBox from "../components/DialogBox";

export const AppStore = createContext<any>(null)

const AppContext = ({ children }) => {
    const appState = useRef(AppState.currentState)
    const appVersion = DeviceInfo.getVersion()
    // debugging
    const uat = false

    const [isLogin, setIsLogin] = useState<boolean>(() => false)
    const [isLoading, setIsLoading] = useState<boolean>(() => false)
    const [dialogVisible, setDialogVisible] = useState(false);

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true)
        const creds = {
            emp_id: username,
            password: password,
            "app_version": appVersion,
            "flag": "A",
            "session_id": 0
        }

        console.log("LOGIN-----USERNAME-----PASS", creds)
        console.log(`${ADDRESSES.LOGIN}`)

        await axios.post(`${ADDRESSES.LOGIN}`, creds).then(res => {
            console.log("LOGIN LOGGGG===", res?.data);
            if (res?.data?.suc === 1) {
                ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                loginStorage.set("login-data", JSON.stringify(res?.data?.user_dtls))

                setIsLogin(true)
            } else {
                ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                setIsLogin(false)
            }
        }).catch(err => {
            console.log(">>>>>", err)
            ToastAndroid.show(`Something went wrong while logging in.`, ToastAndroid.SHORT)
        })
        console.log('asadsasd')
        setIsLoading(false)
    }

    const fetchCurrentVersion = async () => {
        // console.log('SASD')
        // await axios.get(ADDRESSES.FETCH_APP_VERSION).then(res => {
        //     console.log("FETCH VERSION===RES", res?.data)
        //     if (+res?.data?.msg[0]?.version !== +appVersion) {
        //         setDialogVisible(true);
        //     }

        // }).catch(err => {
        //     console.log("VERSION FETCH ERR", err)
        // })
    }

    // useEffect(() => {
    //     fetchCurrentVersion()
    // }, [])

    // const isLoggedIn = () => {
    //     if (loginStorage.getAllKeys().length === 0) {
    //         console.log("IF - isLoggedIn")
    //         setIsLogin(false)
    //     } else {
    //         console.log("ELSE - isLoggedIn")
    //         setIsLogin(true)
    //     }
    // }

    // useEffect(() => {
    //     if (appState.current === "active") {
    //         isLoggedIn()
    //     }
    // }, [])

    useEffect(() => {
        if (appState.current === "inactive") {
            handleLogout()
        }
    }, [])



    const handleLogout = async () => {
        loginStorage.clearAll()
        setIsLogin(false)
    }

    return (
        <AppStore.Provider value={{
            isLogin,
            isLoading,
            handleLogin,
            handleLogout,
            fetchCurrentVersion,
            appVersion,
            uat
        }}>
            <>
                {children}
                <DialogBox
                    visible={dialogVisible}
                    title="Version Mismatch!"
                    btnSuccess="CLOSE APP"
                    onSuccess={() => BackHandler.exitApp()}
                    hide={() => setDialogVisible(false)}
                    dismissable={false}>
                    <Text>Please update the app to use.</Text>
                </DialogBox>
            </>
        </AppStore.Provider>
    )
}

export default AppContext
