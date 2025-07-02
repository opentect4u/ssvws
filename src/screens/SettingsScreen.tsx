import { Alert, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ButtonPaper from '../components/ButtonPaper'
import { AppStore } from '../context/AppContext'
import { CommonActions, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'

// import ThermalPrinterModule from 'react-native-thermal-printer'
// import LoadingOverlay from '../components/LoadingOverlay'
// import CollectionButtonsWrapper from '../components/CollectionButtonsWrapper'
// import CollectionButton from '../components/CollectionButton'
//@ts-ignore
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import CollectionButtonsWrapper from '../components/CollectionButtonsWrapper'
import CollectionButton from '../components/CollectionButton'

const SettingsScreen = () => {
  const theme = usePaperColorScheme()
  const navigation = useNavigation()
  const { handleLogout } = useContext<any>(AppStore)

  // const [loading, setLoading] = useState(() => false)

  const logginOut = () => {
    Alert.alert("Logging out", "Are you sure you want to log out?", [{
      text: "NO",
      onPress: () => null
    }, {
      text: "YES",
      onPress: () => handleLogout()
    }])
  }

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
  }, [])

  // const testPrint = async () => {
  //   console.log("Called Printer...")
  //   setLoading(true)
  //   const text =
  //     '[L]BEAUTIFUL SHIRT[R]9.99e\n' +
  //     // `[C]<img>file:///android_asset/msg.png</img>\n`+
  //     '[L]Some text goes here...===';
  //   await ThermalPrinterModule.printBluetooth({
  //     payload: text,
  //     printerNbrCharactersPerLine: 32,
  //     printerDpi: 120,
  //     printerWidthMM: 58,
  //     mmFeedPaper: 25,
  //   }).then(res => {
  //     console.log("RES", res)
  //   }).catch(err => {
  //     console.log("ERR", err)
  //   })

  //   console.log("Called Printer...2")
  //   setLoading(false)
  // }

  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="handled" style={{
        backgroundColor: theme.colors.background
      }}>
        <HeadingComp title="Settings" subtitle="Manage Settings" />
        {/* <View style={{
          paddingHorizontal: 20,
          minHeight: SCREEN_HEIGHT,
          height: "auto"
        }}>
          <ButtonPaper mode='elevated' icon="cloud-print-outline" onPress={testPrint} style={{ marginTop: 50 }} disabled={loading} loading={loading}>Test Print</ButtonPaper>
        </View> */}



        <View style={{
          minHeight: SCREEN_HEIGHT,
          height: "auto",
          paddingHorizontal: 20,
          gap: 10
        }}>
          <ButtonPaper mode='contained' icon="logout" onPress={logginOut}>LOG OUT</ButtonPaper>
          <CollectionButtonsWrapper>
            <CollectionButton
              icon={"printer-outline"}
              text="Printer Connect"
              color={theme.colors.secondaryContainer}
              textColor={theme.colors.onSecondaryContainer}
              onPress={() => {
                navigation.dispatch(CommonActions.navigate({
                  name: navigationRoutes.printerConnectScreen
                }))
              }}
            />
          </CollectionButtonsWrapper>
        </View>



      </ScrollView>
      {/* {loading && <LoadingOverlay />} */}
    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({})