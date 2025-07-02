import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {
  DataTable,
  List,
  MD2Colors,
  MD2DarkTheme,
  MD2LightTheme,
  MD3LightTheme,
  Searchbar,
  Text,
} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {usePaperColorScheme} from '../../theme/theme';
import HeadingComp from '../../components/HeadingComp';
import CollectionButtonsWrapper from '../../components/CollectionButtonsWrapper';
import CollectionButton from '../../components/CollectionButton';
import normalize, {SCREEN_HEIGHT, SCREEN_WIDTH} from 'react-native-normalize';
import {CommonActions, useNavigation} from '@react-navigation/native';
import navigationRoutes from '../../routes/routes';
import {loginStorage} from '../../storage/appStorage';
import ButtonPaper from '../../components/ButtonPaper';
import SurfacePaper from '../../components/SurfacePaper';
import DatePicker from 'react-native-date-picker';
import RadioComp from '../../components/RadioComp';
import {formattedDate} from '../../utils/dateFormatter';
import axios from 'axios';
import {ADDRESSES} from '../../config/api_list';

const RecoveryReportScreen = () => {
  const theme = usePaperColorScheme();
  const navigation = useNavigation();
  const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '');

  const [isLoading, setIsLoading] = useState(() => false);
  const [isDisabled, setIsDisabled] = useState(() => false);

  const [fromDate, setFromDate] = useState(() => new Date());
  const [toDate, setToDate] = useState(() => new Date());
  const [openFromDate, setOpenFromDate] = useState(() => false);
  const [openToDate, setOpenToDate] = useState(() => false);

  const formattedFromDate = formattedDate(fromDate);
  const formattedToDate = formattedDate(toDate);

  const [checkUser, setCheckUser] = useState(() => 'A');
  const [txnMode, setTxnMode] = useState(() => 'C');
  const [tot_credit, setTotCredit] = useState(() => 0);
  const [search, setSearch] = useState(() => '');
  const [loading, setLoading] = useState(() => false);

  const [reportData, setReportData] = useState(() => []);

  const titleTextStyle: TextStyle = {
    color: theme.colors.onPrimaryContainer,
  };

  const titleStyle: ViewStyle = {
    backgroundColor: theme.colors.primaryContainer,
  };

  const fetchRecoveryReport = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    const creds = {
      user_id: loginStore?.id,
      from_dt: formattedFromDate,
      to_dt: formattedToDate,
      tr_mode: txnMode,
      emp_id: loginStore?.emp_id,
      flag: checkUser,
      branch_code: loginStore?.brn_code,
      grp_dtls_app: search,
    };
    await axios
      .post(`${ADDRESSES.MEMBERWISE_RECOVERY_REPORT}`, creds)
      .then(res => {
        console.log('>>>>>>', res?.data);
        setReportData(res?.data?.msg);
        setTotCredit(res?.data?.msg.reduce((n, {credit}) => n + credit, 0));
      })
      .catch(err => {
        console.log('<<<<<<', err);
      });
    setIsLoading(false);
    setIsDisabled(false);
  };
  const onChangeSearch = (query: string) => {
    setSearch(query);
  };
  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <HeadingComp
          title="Memberwise Recovery Report"
          subtitle="View recovery report"
          isBackEnabled
        />
        <View
          style={{
            minHeight: SCREEN_HEIGHT,
            height: 'auto',
            paddingHorizontal: 20,
            gap: 10,
          }}>
          <View
            style={{
              backgroundColor: theme.colors.onSecondary,
              gap: 10,
              padding: 10,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
            }}>
            {/* {loginStore?.id === 2 && 
                        <View>
                            <RadioComp
                                title={checkUser === "O" ? `Your Data` : `All User`}
                                titleColor={theme.colors.primary}
                                color={theme.colors.primary}
                                radioButtonColor={theme.colors.primary}
                                icon="account-convert-outline"
                                dataArray={[
                                    {
                                        optionName: "OWN",
                                        optionState: checkUser,
                                        currentState: "O", // bm emp_id -> 
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                    {
                                        optionName: "ALL",
                                        optionState: checkUser,
                                        currentState: "A", // emp_id -> 0
                                        optionSetStateDispathFun: (e) => setCheckUser(e)
                                    },
                                ]}
                            />
                        </View>} */}

            <View>
              <RadioComp
                title={txnMode === 'B' ? `Mode Bank` : `Mode Cash`}
                titleColor={theme.colors.tertiary}
                color={theme.colors.tertiary}
                radioButtonColor={theme.colors.tertiary}
                icon={txnMode === 'C' ? 'cash' : 'bank'}
                dataArray={[
                  {
                    optionName: 'CASH',
                    optionState: txnMode,
                    currentState: 'C', // bm emp_id ->
                    optionSetStateDispathFun: e => setTxnMode(e),
                  },
                  {
                    optionName: 'BANK',
                    optionState: txnMode,
                    currentState: 'B', // emp_id -> 0
                    optionSetStateDispathFun: e => setTxnMode(e),
                  },
                ]}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                alignItems: 'center',
                backgroundColor: theme.colors.tertiary,
                padding: 2,
                borderRadius: 12,
              }}>
              <ButtonPaper
                textColor={theme.colors.onTertiary}
                onPress={() => setOpenFromDate(true)}
                mode="text">
                FROM: {fromDate?.toLocaleDateString('en-GB')}
              </ButtonPaper>
              <ButtonPaper
                textColor={theme.colors.onTertiary}
                onPress={() => setOpenToDate(true)}
                mode="text">
                TO: {toDate?.toLocaleDateString('en-GB')}
              </ButtonPaper>

              <DatePicker
                modal
                mode="date"
                open={openFromDate}
                date={fromDate}
                onConfirm={date => {
                  setOpenFromDate(false);
                  setFromDate(date);
                }}
                onCancel={() => {
                  setOpenFromDate(false);
                }}
              />
              <DatePicker
                modal
                mode="date"
                open={openToDate}
                date={toDate}
                onConfirm={date => {
                  setOpenToDate(false);
                  setToDate(date);
                }}
                onCancel={() => {
                  setOpenToDate(false);
                }}
              />
            </View>
            <View>
              <Searchbar
                autoFocus
                placeholder={'Enter by Group Name'}
                onChangeText={onChangeSearch}
                value={search}
                elevation={search ? 2 : 0}
                keyboardType={'default'}
                maxLength={30}
                style={{
                  backgroundColor: theme.colors.tertiaryContainer,
                  color: theme.colors.onTertiaryContainer,
                  width: '100%',
                  paddingVertical: 1,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
                loading={loading ? true : false}
                onClearIconPress={() => {
                  setSearch(() => '');
                  // setFormsData(() => [])
                }}
              />
            </View>
            <View>
              <ButtonPaper
                onPress={() => fetchRecoveryReport()}
                mode="contained-tonal"
                buttonColor={theme.colors.secondary}
                textColor={theme.colors.onSecondary}
                loading={isLoading}
                disabled={isDisabled}>
                SUBMIT
              </ButtonPaper>
            </View>
          </View>

          <View>
            <SurfacePaper backgroundColor={theme.colors.surface}>
              {reportData?.map((item, index) => (
                <>
                  <View style={{backgroundColor:theme.colors.primaryContainer,width:'100%',alignItems:'center',padding:10,borderRadius:10}}>
                    <Text>{item.group_name}</Text>
                  </View>
                  {item.memb_dtls_app?.map((mem, i) => (
                    <React.Fragment key={i}>
                      <List.Item
                       
                        key={i}
                        title={
                            <View>
                                <Text style={{color:theme.colors.green,fontSize:15}}>
                                Code -{mem?.member_code}
                                </Text>
                                <Text >
                                Name -{mem?.client_name}
                                </Text>
                                <Text>
                                Credit -{mem?.credit}/-
                                </Text>
                                <Text>
                                Balance -{mem?.balance}/-
                                </Text>
                                
                            </View>
                           
                        
                        }
                        description={
                          <View>
                            <Text
                              >
                             {mem?.member_name}
                            </Text>
                          </View>
                        }
                      />
                    </React.Fragment>
                  ))}
                </>
              ))}
              {/* </ScrollView> */}
              {/* <View style={{padding: normalize(10)}}>
                <Text
                  variant="labelMedium"
                  style={{color: theme.colors.primary}}>
                 TOTAL CREDIT: {tot_credit?.toFixed(2)}/- //{' '}
                </Text>
              </View> */}
            </SurfacePaper>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecoveryReportScreen;

const styles = StyleSheet.create({});
