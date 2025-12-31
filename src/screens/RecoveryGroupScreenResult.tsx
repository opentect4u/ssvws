import { StyleSheet, SafeAreaView, View, ScrollView, FlatList, BackHandler, Alert } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import RecoveryGroupForm from './forms/RecoveryGroupForm'
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import { Icon, Text } from 'react-native-paper'
import navigationRoutes from '../routes/routes'

const RecoveryGroupScreenResult = () => {
    const theme = usePaperColorScheme()
    // const { params } = useRoute<any>()
    const route = useRoute()
    const { resultData } = (route.params as { resultData?: any }) || {}   // ✅ RECEIVE DATA HERE
    const { not_inserted_row } = (route.params as { not_inserted_row?: any }) || {}   // ✅ RECEIVE DATA HERE
    const navigation = useNavigation()

    // console.log("Received recovery data:", resultData)
    
    
    // 110 -> Branch Code
    // const navigation = useNavigation()

    // const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    // console.log("LLLLLLLLLLLKKKKKKKKKKAAAAAAAAAAAAAss", params.group_details)

    const formatDateTime = (date:any) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: false,
  });
};


// const navigation = useNavigation();

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      navigation.dispatch(
        CommonActions.navigate({
        name: navigationRoutes.searchLoanRecoveryScreen,
        }),
        )
      return true; // 🚫 prevent default back behavior
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [])
);


// useEffect(() => {
//   Alert.alert(
//     "Success",
//     "Recovery details saved successfully.",
//     [
//       {
//         text: "OK",
//         onPress: () => {
//         navigation.dispatch(
//         CommonActions.navigate({
//         name: navigationRoutes.homeScreen,
//         }),
//         )
//         },
//       },
//     ],
//     { cancelable: false }
//   );
// }, []);


    return (
        <SafeAreaView>
            {/* <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}> */}
            
                <HeadingComp title="Recovery Details" subtitle={`Group Name: ${resultData[0]?.group_name}`} isBackEnabled={false} />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    paddingBottom: 30
                }}>
                    
{/* <Text>{JSON.stringify(resultData?.length , null, 2)}</Text> */}
                    {resultData?.length > 0 &&(
                    <FlatList
                    data={resultData}
                    keyExtractor={(item, index) => item.loan_id?.toString() || index.toString()}
                    contentContainerStyle={{ gap: 12, paddingTop: 15 }}
                    renderItem={({ item }) => (
                        <View
                        style={{
                            backgroundColor: theme.colors.surface,
                            borderRadius: 14,
                            padding: 15,
                            elevation: 2,
                        }}
                        >
                        <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                            {item.client_name.toUpperCase()}
                        </Text>

                        <Text variant="bodySmall">
                            Transaction Date: {formatDateTime(item.tnx_date)}
                        </Text>

                        <Text variant="bodySmall">
                            Credit Amount: ₹ {item.credit}
                        </Text>

                        <Text variant="bodySmall">
                            Outstanding Amount: ₹ {item.memb_outstanding}
                        </Text>
                        </View>
                    )}
                    />
                    )}

{/* <Text>{JSON.stringify(not_inserted_row?.length , null, 2)}</Text> */}

                    {not_inserted_row?.length > 0 &&(
                    <>
                    <Text
                    variant="titleMedium"
                    style={{
                    fontWeight: "bold",
                    marginTop: 16,
                    marginBottom: 0,
                    fontSize:18,
                    color: theme.colors.primary,
                    }}
                    >
                    Not Inserted Records
                    </Text>
                    <FlatList
                    data={not_inserted_row}
                    keyExtractor={(item, index) => item.loan_id?.toString() || index.toString()}
                    contentContainerStyle={{ gap: 12, paddingTop: 15 }}
                    renderItem={({ item }) => (
                        <View
                        style={{
                            backgroundColor: theme.colors.surface,
                            borderRadius: 14,
                            padding: 15,
                            elevation: 2,
                        }}
                        >
                        <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                            {item.loan_id}
                        </Text>

                        {/* <Text variant="bodySmall">
                            Transaction Date: {formatDateTime(item.tnx_date)}
                        </Text> */}

                        <Text variant="bodySmall">
                            Credit Amount: ₹ {item.credit}
                        </Text>

                        <Text variant="bodySmall">
                            Principal Amount: ₹ {item.prn_amt}
                        </Text>
                        </View>
                    )}
                    />
                    </> 
                    )}
                    


                </View>
            {/* </ScrollView> */}
        </SafeAreaView>
    )
}

export default RecoveryGroupScreenResult

const styles = StyleSheet.create({})