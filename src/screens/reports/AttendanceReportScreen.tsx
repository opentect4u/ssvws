import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TextStyle,
  ViewStyle,
  Alert,
} from 'react-native';
import {
  Chip,
  Icon,
  List,
  MD2Colors,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import React, { SetStateAction, useEffect, useState } from 'react';
import { usePaperColorScheme } from '../../theme/theme';
import HeadingComp from '../../components/HeadingComp';
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { loginStorage } from '../../storage/appStorage';
import ButtonPaper from '../../components/ButtonPaper';
import SurfacePaper from '../../components/SurfacePaper';
import DatePicker from 'react-native-date-picker';
import { formattedDate } from '../../utils/dateFormatter';
import axios from 'axios';
import { ADDRESSES } from '../../config/api_list';
import DialogBox from '../../components/DialogBox';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import dayjs, { Dayjs } from 'dayjs';

const AttendanceReportScreen = () => {
  const theme = usePaperColorScheme();
  const navigation = useNavigation();
  const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '');
  const [date, setDate] = useState<any>(dayjs());
  const [isLoading, setIsLoading] = useState(() => false);
  const [isDisabled, setIsDisabled] = useState(() => false);

  const [fromDate, setFromDate] = useState(() => new Date());
  const [toDate, setToDate] = useState(() => new Date());
  const [openFromDate, setOpenFromDate] = useState(() => false);
  const [openToDate, setOpenToDate] = useState(() => false);
  const [formatted_dt, setFormattedDate] = useState('');
  const formattedFromDate = formattedDate(fromDate);
  const formattedToDate = formattedDate(toDate);

  const [reportData, setReportData] = useState(() => []);
  const [detailedReportData, setDetailedReportData] = useState(() => []);

  const [visible, setVisible] = React.useState(false);
  const hide = () => setVisible(false);

  const defaultStyles = useDefaultStyles();

  const titleTextStyle: TextStyle = {
    color: theme.colors.onPrimaryContainer,
  };

  const titleStyle: ViewStyle = {
    backgroundColor: theme.colors.primaryContainer,
  };

  const fetchReport = async () => {
    setIsLoading(true);
    setIsDisabled(true);
    const dt = new Date(date.toString());
    setFormattedDate(formattedDate(dt));
    console.log(dt)
    const creds = {
      // "get_year": formattedDate(fromDate).split('-')[0],
      // "get_month": formattedDate(fromDate).split('-')[1],
      entry_dt: formattedDate(dt),
      emp_id: loginStore?.emp_id,
    };
    await axios
      .post(`${ADDRESSES.ATTENDANCE_REPORT}`, creds)
      .then(res => {
        console.log('>>>>>>', res?.data);
        setReportData(res?.data?.msg);
        setVisible(true)
      })
      .catch(err => {
        console.log('<<<<<<', err);
      });
    setIsLoading(false);
    setIsDisabled(false);
  };

  const fetchEmployeeAttendanceDetails = async (slNo: string) => {
    setIsLoading(true);
    setIsDisabled(true);
    const creds = {
      emp_id: loginStore?.emp_id,
      sl_no: slNo,
    };
    await axios
      .post(`${ADDRESSES.FETCH_EMP_ATTENDANCE_DETAILS}`, creds)
      .then(res => {
        console.log('>>>>>>', res?.data);
        setDetailedReportData(res?.data?.msg);
      })
      .catch(err => {
        console.log('<<<<<<', err);
      });
    setIsLoading(false);
    setIsDisabled(false);
  };

  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <HeadingComp
          title="Attendance Report"
          subtitle="View your attendance"
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
            {/* <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 15,
                                alignItems: 'center',
                                backgroundColor: theme.colors.tertiary,
                                padding: 2,
                                borderRadius: 12,
                            }}> */}
            {/* <ButtonPaper
                                textColor={theme.colors.onTertiary}
                                onPress={() => setOpenFromDate(true)}
                                mode="text">
                                Choose : {fromDate?.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                            </ButtonPaper> */}
            {/* <ButtonPaper
                                textColor={theme.colors.onTertiary}
                                onPress={() => setOpenToDate(true)}
                                mode="text">
                                TO: {toDate?.toLocaleDateString('en-GB')}
                            </ButtonPaper> */}

            <DatePicker
              modal
              mode="date"
              title="Select Month"
              open={openFromDate}
              date={fromDate}
              onConfirm={date => {
                setOpenFromDate(false);
                setFromDate(date);
              }}
              onCancel={() => {
                setOpenFromDate(false);
              }}
              role="group"
            />

            {/* </View> */}
            <View>
              <DateTimePicker
                // selectedItemColor={theme.colors.primary}
                styles={{
                  ...defaultStyles,
                  selected: {
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.onPrimary
                  },
                  header: {
                    backgroundColor: theme.colors.tertiaryContainer,
                    borderRadius: 10
                  },
                  button_next: {
                    color: theme.colors.onPrimaryContainer
                  },
                  button_prev: {
                    color: theme.colors.onPrimaryContainer
                  }
                }}
                mode="single"
                minDate={new Date().setMonth(new Date().getMonth() - 6)}
                maxDate={new Date()}
                date={date}
                onChange={params => {
                  setDate(params.date);
                  const date = new Date(params.date.toString());
                  setFormattedDate(formattedDate(date));
                }}
              />
            </View>
            <View>
              <ButtonPaper
                onPress={() => fetchReport()}
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
            <SurfacePaper
              style={{
                padding: normalize(10),
              }}
              backgroundColor={theme.colors.surface}>
              {/* <TouchableRipple onPress={() => null} style={{ backgroundColor: theme.colors.background, padding: 10, borderRadius: 15, width: '100%', borderWidth: 1, borderColor: theme.colors.secondary, borderStyle: "dashed", marginBottom: 8 }}>
                                <View style={{
                                    paddingHorizontal: 5,
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: 5,
                                    }}>
                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
                                            Jan 24
                                        </Text>

                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>•</Text>
                                        <Text variant='bodySmall' style={{ color: theme.colors.tertiary, fontWeight: 'thin' }}>On Time</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 5,
                                    }}>
                                        <View style={{
                                            alignItems: 'flex-start',
                                        }}>
                                            <Text>
                                                Clock In
                                            </Text>

                                            <Text variant='bodySmall' style={{ color: theme.colors.green }}>
                                                09:58 AM
                                            </Text>
                                        </View>
                                        <View style={{
                                            alignItems: 'flex-end',
                                        }}>
                                            <Text>
                                                Clock Out
                                            </Text>

                                            <Text variant='bodySmall' style={{ color: theme.colors.green }}>
                                                07:58 PM
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => null} style={{ backgroundColor: theme.colors.background, padding: 10, borderRadius: 15, width: '100%', borderWidth: 1, borderColor: theme.colors.secondary, borderStyle: "dashed", marginBottom: 8 }}>
                                <View style={{
                                    paddingHorizontal: 5,
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: 5,
                                    }}>
                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
                                            Jan 25
                                        </Text>

                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>•</Text>
                                        <Text variant='bodySmall' style={{ color: theme.colors.error, fontWeight: 'thin' }}>Late In</Text>
                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>•</Text>
                                        <Icon size={15} source={"snail"} color={theme.colors.error} />
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 5,
                                    }}>
                                        <View style={{
                                            alignItems: 'flex-start',
                                        }}>
                                            <Text>
                                                Clock In
                                            </Text>

                                            <Text variant='bodySmall' style={{ color: theme.colors.error }}>
                                                10:58 AM
                                            </Text>
                                        </View>
                                        <View style={{
                                            alignItems: 'flex-end',
                                        }}>
                                            <Text>
                                                Clock Out
                                            </Text>

                                            <Text variant='bodySmall' style={{ color: theme.colors.green }}>
                                                07:58 PM
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple onPress={() => null} style={{ backgroundColor: theme.colors.background, padding: 10, borderRadius: 15, width: '100%', borderWidth: 1, borderColor: theme.colors.secondary, borderStyle: "dashed", marginBottom: 8 }}>
                                <View style={{
                                    paddingHorizontal: 5,
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        gap: 5,
                                    }}>
                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
                                            Jan 26
                                        </Text>

                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>•</Text>
                                        <Text variant='bodySmall' style={{ color: theme.colors.primary, fontWeight: 'thin' }}>Early Out</Text>
                                        <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>•</Text>
                                        <Icon size={15} source={"flash-outline"} color={theme.colors.primary} />
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 5,
                                    }}>
                                        <View style={{
                                            alignItems: 'flex-start',
                                        }}>
                                            <Text>
                                                Clock In
                                            </Text>

                                            <Text variant='bodySmall' style={{ color: theme.colors.green }}>
                                                09:58 AM
                                            </Text>
                                        </View>
                                        <View style={{
                                            alignItems: 'flex-end',
                                        }}>
                                            <Text>
                                                Clock Out
                                            </Text>

                                            <Text variant='bodySmall' style={{ color: theme.colors.error }}>
                                                05:01 PM
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableRipple> */}

              {/* {reportData?.map((item, index) => (
                <TouchableRipple
                  key={index}
                  onPress={async () => {
                    await fetchEmployeeAttendanceDetails(item?.sl_no);
                    setVisible(true);
                  }}
                  style={{
                    backgroundColor: theme.colors.background,
                    padding: 10,
                    borderRadius: 0,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: theme.colors.secondary,
                    borderStyle: 'dashed',
                    marginBottom: 8,
                  }}>
                  <View
                    style={{
                      paddingHorizontal: 5,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: 5,
                      }}>
                      <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.onBackground,
                          fontWeight: 'bold',
                        }}>
                        {new Date(item?.entry_dt)?.toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>

                      <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.onBackground,
                          fontWeight: 'bold',
                        }}>
                        •
                      </Text>
                      {item?.late_in === 'N' ? (
                        <Text
                          variant="bodySmall"
                          style={{
                            color: theme.colors.tertiary,
                            fontWeight: 'thin',
                          }}>
                          On Time
                        </Text>
                      ) : item?.late_in === 'Y' ? (
                        <>
                          <Text
                            variant="bodySmall"
                            style={{
                              color: theme.colors.error,
                              fontWeight: 'thin',
                            }}>
                            Late In
                          </Text>
                          <Text
                            variant="bodySmall"
                            style={{
                              color: theme.colors.onBackground,
                              fontWeight: 'bold',
                            }}>
                            •
                          </Text>
                          <Icon
                            size={15}
                            source={'snail'}
                            color={theme.colors.error}
                          />
                        </>
                      ) : (
                        <Text>Error</Text>
                      )}

                      {item?.early_out === 'N' ? null : (
                        <>
                          <Text
                            variant="bodySmall"
                            style={{
                              color: theme.colors.onBackground,
                              fontWeight: 'bold',
                            }}>
                            •
                          </Text>
                          <Text
                            variant="bodySmall"
                            style={{
                              color: theme.colors.primary,
                              fontWeight: 'thin',
                            }}>
                            Early Out
                          </Text>
                          <Text
                            variant="bodySmall"
                            style={{
                              color: theme.colors.onBackground,
                              fontWeight: 'bold',
                            }}>
                            •
                          </Text>
                          <Icon
                            size={15}
                            source={'flash-outline'}
                            color={theme.colors.primary}
                          />
                        </>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                      }}>
                      <View
                        style={{
                          alignItems: 'flex-start',
                        }}>
                        <Text>Clock In</Text>

                        <Text
                          variant="bodySmall"
                          style={{
                            color:
                              item?.late_in === 'N'
                                ? theme.colors.green
                                : theme.colors.error,
                          }}>
                          {new Date(item?.in_date_time)
                            ?.toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                            .replace('am', 'AM')
                            .replace('pm', 'PM')}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'flex-end',
                        }}>
                        <Text>Clock Out</Text>

                        <Text
                          variant="bodySmall"
                          style={{
                            color:
                              item?.early_out === 'N'
                                ? theme.colors.green
                                : theme.colors.error,
                          }}>
                          {new Date(item?.out_date_time)
                            ?.toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                            .replace('am', 'AM')
                            .replace('pm', 'PM')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableRipple>
              ))} */}
            </SurfacePaper>
          </View>
        </View>
      </ScrollView>

      <DialogBox
        hide={hide}
        visible={visible}
        title="Attendance Report"
        btnSuccess="OK"
        onSuccess={hide}>
        <View>
          {/* {detailedReportData?.map((item, index) => ( */}
          {reportData.length == 0 && <Text>No Data</Text>}
          {reportData?.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.colors.background,
                padding: 10,
                borderRadius: 15,
                width: '100%',
                borderWidth: 1,
                borderColor: theme.colors.secondary,
                borderStyle: 'dashed',
                marginBottom: 8,
              }}>
              <View
                style={{
                  paddingHorizontal: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  {/* <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
                                        {new Date(item?.entry_dt)?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </Text> */}

                  {/* <Text variant='bodySmall' style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>•</Text> */}
                  {item?.clock_status && !item?.late_in ? (
                    <Text
                      variant="bodySmall"
                      style={{
                        color: theme.colors.tertiary,
                        fontWeight: 'thin',
                      }}>
                      {item?.clock_status == 'O' ? 'Out' : 'In'}
                    </Text>
                  ) : item?.late_in === 'L' ? (
                    <>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.error, fontWeight: 'thin' }}>
                        Late In
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.onBackground,
                          fontWeight: 'bold',
                        }}>
                        •
                      </Text>
                      <Icon
                        size={15}
                        source={'snail'}
                        color={theme.colors.error}
                      />
                    </>
                  ) : (""
                  )}

                  {item?.late_in === 'E' ? (
                    <>
                      {/* <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.onBackground,
                          fontWeight: 'bold',
                        }}>
                        •
                      </Text> */}
                      <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.primary,
                          fontWeight: 'thin',
                        }}>
                        Early Out
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{
                          color: theme.colors.onBackground,
                          fontWeight: 'bold',
                        }}>
                        •
                      </Text>
                      <Icon
                        size={15}
                        source={'flash-outline'}
                        color={theme.colors.primary}
                      />
                    </>
                  ) : null}

                  <Text
                    variant="bodySmall"
                    style={{
                      color: theme.colors.onBackground,
                      fontWeight: 'bold',
                    }}>
                    •
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{
                      color:
                        item?.attan_status === 'A'
                          ? theme.colors.tertiary
                          : theme.colors.primary,
                      fontWeight: 'thin',
                    }}>
                    {item?.attan_status === 'A'
                      ? 'Approved'
                      : item?.attan_status === 'R'
                        ? 'Rejected'
                        : 'Error'}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 5,
                  }}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                    }}>
                    <Text>Clock In</Text>

                    <Text
                      variant="bodySmall"
                      style={{
                        color:
                          item?.late_in === 'N'
                            ? theme.colors.green
                            : theme.colors.error,
                      }}>
                      {new Date(item?.in_date_time)
                        ?.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                        .replace('am', 'AM')
                        .replace('pm', 'PM')}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-end',
                    }}>
                    <Text>Clock Out</Text>

                    <Text
                      variant="bodySmall"
                      style={{
                        color:
                          item?.early_out === 'N'
                            ? theme.colors.green
                            : theme.colors.error,
                      }}>
                      {item?.out_date_time ? new Date(item?.out_date_time)
                        ?.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                        .replace('am', 'AM')
                        .replace('pm', 'PM') : 'Yet to clock out'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginTop: 5,
                    marginVertical: 10
                  }}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                    }}>
                    <Text>In Location</Text>

                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.green }}>
                      {item?.in_addr}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-start',
                    }}>
                    <Text>Out Location</Text>

                    <Text
                      variant="bodySmall"
                      style={{ color: item?.out_addr ? theme.colors.green : theme.colors.red }}>
                      {item?.out_addr || 'Yet to clock out'}
                    </Text>
                  </View>

                </View>
                {item?.attn_reject_remarks && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 5,
                    }}>
                    <View
                      style={{
                        alignItems: 'flex-start',
                      }}>
                      <Text>Rejection Reason</Text>

                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.error }}>
                        {item?.attn_reject_remarks}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </DialogBox>
    </SafeAreaView>
  );
};

export default AttendanceReportScreen;

const styles = StyleSheet.create({});
