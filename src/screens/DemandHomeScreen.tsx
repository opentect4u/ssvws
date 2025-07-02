import React, {useState} from 'react';
import {usePaperColorScheme} from '../theme/theme';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {loginStorage} from '../storage/appStorage';
import {SafeAreaView, TextStyle, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native';
import HeadingComp from '../components/HeadingComp';
import {View} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from 'react-native-normalize';
import DatePicker from 'react-native-date-picker';
import {DataTable, MD2Colors, Text, TextInput} from 'react-native-paper';
import ButtonPaper from '../components/ButtonPaper';
import CollectionButton from '../components/CollectionButton';
import navigationRoutes from '../routes/routes';
import CollectionButtonsWrapper from '../components/CollectionButtonsWrapper';
import axios from 'axios';
import { ADDRESSES } from '../config/api_list';
import { formattedDate } from '../utils/dateFormatter';
import SurfacePaper from '../components/SurfacePaper';

function DemandHomeScreen() {
  const theme = usePaperColorScheme();
  const navigation = useNavigation();
  const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '');
  const [isLoading, setIsLoading] = useState(() => false);
  const [isDisabled, setIsDisabled] = useState(() => false);
  const [openFromDate, setOpenFromDate] = useState(() => false);
  const [reportData,setReportData] = useState(()=>[])
  const [fromDate, setFromDate] = useState(() => new Date());
  const [group_code,setGroupCode] = useState([])
  
  const titleTextStyle: TextStyle = {
    color: theme.colors.onPrimaryContainer
}

const titleStyle: ViewStyle = {
    backgroundColor: theme.colors.primaryContainer
}
  const getDemandReportData = async()=>{
    console.log("hello")
   await axios.post(`${ADDRESSES.DEMANDREPORT}`, {get_date:formattedDate(fromDate)}).then(res=>{console.log('report_data',res?.data);
    console.log(Object.keys(res?.data?.msg),'keys')

        // setReportData(res?.data?.msg)
        setGroupCode(Object.keys(res?.data?.msg))
    })
  }
  return (
    <SafeAreaView>
    <ScrollView keyboardShouldPersistTaps="handled" style={{
        backgroundColor: theme.colors.background
    }}>
        <HeadingComp title="Demand" subtitle="Please enter date" isBackEnabled />
        <View style={{
            minHeight: SCREEN_HEIGHT,
            height: "auto",
            paddingHorizontal: 20,
            gap: 10
        }}>
            <View style={{
                backgroundColor: theme.colors.onSecondary,
                gap: 10,
                padding: 10,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20
            }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 15,
                        alignItems: "center",
                        backgroundColor: theme.colors.tertiary,
                        padding: 2,
                        borderRadius: 12
                    }}>
                    <ButtonPaper
                        textColor={theme.colors.onTertiary}
                        onPress={() => setOpenFromDate(true)}
                        mode="text">
                        FROM: {fromDate?.toLocaleDateString("en-GB")}
                    </ButtonPaper>
                    <DatePicker
                        modal
                        mode="date"
                        open={openFromDate}
                        date={fromDate}
                        onConfirm={date => {
                            setOpenFromDate(false)
                            setFromDate(date)
                        }}
                        onCancel={() => {
                            setOpenFromDate(false)
                        }}
                    />
                 
                </View>
                <View>
                    <ButtonPaper
                        onPress={() => getDemandReportData()}
                        mode="contained-tonal"
                        buttonColor={theme.colors.secondary}
                        textColor={theme.colors.onSecondary}
                        loading={isLoading}
                        disabled={isDisabled}
                    >
                        SUBMIT
                    </ButtonPaper>
                </View>
            </View>

             <View>
                <SurfacePaper backgroundColor={theme.colors.surface}>
                    <DataTable>
                        <DataTable.Header style={titleStyle}>
                            <DataTable.Title textStyle={titleTextStyle}>Sl. No.</DataTable.Title>
                            <DataTable.Title textStyle={titleTextStyle}>Group</DataTable.Title>
                            {/* <DataTable.Title textStyle={titleTextStyle}>Member</DataTable.Title> */}
                            {/* <DataTable.Title textStyle={titleTextStyle} numeric>Credit</DataTable.Title> */}
                        </DataTable.Header>

                        {group_code?.map((item, index) => {
                            return (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell>
                                        {index + 1}
                                    </DataTable.Cell>
                                    <DataTable.Cell>
                                        {/* {item?.group_code
                                            ?.toString()
                                        } */}
                                        {item}
                                    </DataTable.Cell>
                                    {/* <DataTable.Cell>
                                        {item?.client_name
                                            ?.toString()
                                        }
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric>
                                        {item?.credit}
                                    </DataTable.Cell> */}
                                </DataTable.Row>
                            )
                        })}
                    </DataTable>
                  
                </SurfacePaper>
            </View> 
        </View>
    </ScrollView>
</SafeAreaView>
  );
}

export default DemandHomeScreen;
