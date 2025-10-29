import axios from "axios"
import React, { createContext, useEffect, useRef, useState } from "react"
import { AppState, ToastAndroid, BackHandler, Text } from "react-native"
import { branchStorage, loginStorage } from "../storage/appStorage"
import { ADDRESSES } from "../config/api_list"
import DeviceInfo from "react-native-device-info"
import DialogBox from "../components/DialogBox";

export const AppStore = createContext<any>(null)

const AppContext = ({ children }) => {
    const appState = useRef(AppState.currentState)
    const appVersion = DeviceInfo.getVersion()
    // debugging
    const uat = false
    const [branchAssign, setBranchAssign] = useState<any>([]);
    const [isLogin, setIsLogin] = useState<boolean>(() => false)
    const [isLoading, setIsLoading] = useState<boolean>(() => false)
    const [dialogVisible, setDialogVisible] = useState(false);

    const handleLogin = async (username: string, password: string,branch:any,userId:number,branchName:string) => {
        setIsLoading(true)
        const creds = {
            emp_id: username,
            password: password,
            "app_version": appVersion,
            "flag": "A",
            "session_id": 0,
            "in_out_flag":"I",
            branch_code:branch
        }

        console.log("LOGIN-----USERNAME-----PASS", creds)
        console.log(`${ADDRESSES.LOGIN}`)

        await axios.post(`${ADDRESSES.LOGIN}`, creds).then(res => {

            console.log(userId, "LOGIN LOGGGG===", res?.data);

            if (res?.data?.suc === 1) {
                    ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT);
                    if(userId == 2){
                        const dt = {
                            ...res?.data?.user_dtls,
                            brn_code: branch,
                            branch_name:branchName,
                            token: res?.data?.token
                        };
                        loginStorage.set("login-data", JSON.stringify(dt));
                        console.log("USER DETAILS", dt, "USER DETAILS");
                        setIsLogin(true);
                    } else{

                        const dt_ = {
                            ...res?.data?.user_dtls,
                            token: res?.data?.token
                        };

                        loginStorage.set("login-data", JSON.stringify(dt_));
                        console.log("USER DETAILS", dt_);
                        setIsLogin(true);
                    }
                    
                    //  
                    //  
                // if(res?.data?.user_dtls?.id == 2){
                        
                //         try{
                //                 const creds = {
                //                     emp_id: res?.data?.user_dtls?.emp_id
                //                 }
                //                 axios.post(`${ADDRESSES.FTECH_BRN_ASSIGN}`, creds).then(response => {
                //                     console.log("FETCH BRANCH ASSIGN RES", response?.data?.msg)
                //                     if (response?.data?.suc === 1) {
                //                         setBranchAssign(response?.data?.msg);
                //                         ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                //                         loginStorage.set("login-data", JSON.stringify(res?.data?.user_dtls));
                //                         branchStorage.set("branch-data", JSON.stringify(response?.data?.msg));
                //                         setIsLogin(true)
                //                     } else {
                //                         ToastAndroid.show("No branches assigned to you!", ToastAndroid.SHORT)
                //                     }
                //                 })
                //         }
                //         catch(err){
                //             console.log("Error in fetching branches", err);
                //             ToastAndroid.show("We are unable to process your request, Please try again after some time", ToastAndroid.SHORT)
                //         }
                // }
                // else{
                //         //   console.log(JSON.stringify(res?.data?.user_dtls));
                //         //  console.log("Check - " , (res?.data?.user_dtls?.id == 2));
                //      ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                //      loginStorage.set("login-data", JSON.stringify(res?.data?.user_dtls))
                //      setIsLogin(true)
                // }
            } else {
                ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                setIsLogin(false)
            }
        }).catch(err => {
            console.log(">>>>>", err.message)
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
        const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "");
        console.log(loginStore);
        const creds = {
			emp_id: loginStore?.emp_id,
			modified_by: loginStore?.emp_id,
			in_out_flag:"O",
			flag:'A',
            branch_code:loginStore?.brn_code
		}
        console.log(creds)
		await axios.post(`${ADDRESSES.LOGOUT_APP}`, creds).then(res => {
            console.log(res?.data?.msg)
            if(res?.data?.suc == 1){
                loginStorage.clearAll();
                branchStorage.clearAll();
                setIsLogin(false)
            }
            else{
                 ToastAndroid.show(`Something went wrong while logging in.`, ToastAndroid.SHORT)
            }
           
        }).catch(err=>{
            ToastAndroid.show(`Something went wrong while logging in.`, ToastAndroid.SHORT)
        })
        
    }

    const fetchAssignedBranches = async (empId) => {
            try{
                const creds = {
                    emp_id: empId
                }
                await axios.post(`${ADDRESSES.FTECH_BRN_ASSIGN}`, creds).then(res => {
                    console.log("FETCH BRANCH ASSIGN RES", res?.data)
                    if (res?.data?.suc === 1) {
                        setBranchAssign(res?.data?.msg)
                    } else {
                        ToastAndroid.show("No branches assigned to you!", ToastAndroid.SHORT)
                    }
                })
            }
            catch(err){
                    console.log(err);
                    ToastAndroid.show("We are unable to process your request, Please try again after some time", ToastAndroid.SHORT)
            }
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
