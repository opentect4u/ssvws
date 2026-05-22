import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Linking,
    ToastAndroid,
} from 'react-native';

import {
    Card,
    Text,
    Chip,
    Searchbar,
    Portal,
    Modal,
    Divider,
    Button,
    TextInput,
    Icon,
} from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { usePaperColorScheme } from '../theme/theme';
import HeadingComp from "../components/HeadingComp";

import ImagePicker from 'react-native-image-crop-picker';
import { Image } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';
import { ADDRESSES } from '../config/api_list';
import { loginStorage } from '../storage/appStorage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from "react-native-ui-datepicker";
import useGeoLocation from '../hooks/useGeoLocation';
import CustomText from '../components/CustomText';
import { fp, hp, isTablet, wp } from '../utils/responsive';
import { COLORS, SIZES } from '../config/theme';
import LoadingOverlay from '../components/LoadingOverlay';
import InputPaper from '../components/InputPaper';

const overdueData = [
    {
        loanId: 'LN1001',
        custName: 'Rahul Roy',
        accTypeDesc: 'Crop Loan',
        ovdPrn: 12000,
        outstandingPrn: 55000,
        disbAmt: 80000,
        emi: 2500,
        instlNo: 24,
        category: 'SMA0',
        phone: '9876543210',
        disbDt: '2025-01-12',
        loanDueDt: '2026-03-15',
        remarks: 'Customer promised payment next week',
    },
    {
        loanId: 'LN1002',
        custName: 'Sourav Das',
        accTypeDesc: 'Gold Loan',
        ovdPrn: 8000,
        outstandingPrn: 30000,
        disbAmt: 50000,
        emi: 1800,
        instlNo: 18,
        category: 'SMA1',
        phone: '9123456780',
        disbDt: '2024-11-20',
        loanDueDt: '2026-01-10',
        remarks: 'Phone switched off',
    },
    {
        loanId: 'LN1003',
        custName: 'Priya Sen',
        accTypeDesc: 'SHG Loan',
        ovdPrn: 22000,
        outstandingPrn: 78000,
        disbAmt: 100000,
        emi: 4200,
        instlNo: 36,
        category: 'SMA2',
        phone: '9007007000',
        disbDt: '2024-09-10',
        loanDueDt: '2025-12-25',
        remarks: 'Visit required',
    },
];

// const categories = ['SMA0', 'SMA1', 'SMA2'];

const OVERDUE_CATEGORIES = [
    { label: '6', value: '6' },
    { label: '12', value: '12' },
    { label: '24', value: '24' },
    { label: 'Above 24', value: '25' },
];

const Overdue = () => {

    const theme = usePaperColorScheme();

    const [search, setSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<any>([]);
    const [visible, setVisible] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    
    // const [sitePhoto, setSitePhoto] = useState<string | null>(null);
    const [sitePhoto, setSitePhoto] = useState<any>(null);
    const [promiseAmount, setPromiseAmount] = useState('');
    const [promiseDate, setPromiseDate] = useState('');
    const [loading, setLoading] = useState(() => false)
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    const isFocused = useIsFocused()

    const [memberLoanList, setMemberLoanList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loadingMore, setLoadingMore] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [promiseDateObj, setPromiseDateObj] = useState<any>(null);
    const [itemOnclick, setItemOnclick] = useState<any>({});
    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")
    

    // const [memberLoanList, setMemberLoanList] = useState<any[]>([]);
// const [page, setPage] = useState(1);

// const [limit] = useState(20);

// const [loading, setLoading] = useState(false);

// const [loadingMore, setLoadingMore] = useState(false);

const [hasMore, setHasMore] = useState(true);

    // const toggleCategory = (value: string) => {

    //     setSelectedCategories(prev => {

    //         if (prev.includes(value)) {

    //             return prev.filter(item => item !== value);
    //         }

    //         return [...prev, value];
    //     });
    // };

    const toggleCategory = (value: string) => {

    setSelectedCategories(prev => {

        // IF SAME ITEM CLICKED AGAIN → UNSELECT
        if (prev.includes(value)) {
            return [];
        }

        // ONLY ONE ITEM SELECTED
        return [value];
    });
    };

    const requestCameraPermission = async () => {

    if (Platform.OS === 'android') {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Camera Permission',
                message: 'App needs camera permission',
                buttonPositive: 'OK',
            },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
};

    const fetchMemberLoanList = async (pageNumber = 1,isLoadMore = false) => {

    // setSelectedCategories([])

    try {

        if (isLoadMore) {

            setLoadingMore(true);

        } else {

            setLoading(true);
        }

        const creds = {
            id: loginStore?.id,
            branch_code: loginStore?.brn_code,
            emp_id: loginStore?.emp_id,
            limit: limit,
            offset: (pageNumber - 1) * limit,
            filter_type: selectedCategories.length < 1 ? 0 : selectedCategories[0]
        };

        // console.log('REQUEST => ', creds);

        const res = await axios.post(
            ADDRESSES.FETCH_OD_LIST,
            creds,
            {
                headers: {
                    Authorization: loginStore?.token,
                    'Content-Type': 'application/json',
                },
            },
        );

        // console.log(res?.data?.data[0], 'newDatanewDatanewDatanewDatanewData', creds);

        if (res?.data?.suc) {

            const newData = res?.data?.data || [];

            if (isLoadMore) {

                setMemberLoanList(prev => [
                    ...prev,
                    ...newData,
                ]);

            } else {

                setMemberLoanList(newData);
            }

            /*
                IF RETURN DATA < LIMIT
                THEN NO MORE DATA
            */

            if (newData.length < limit) {

                setHasMore(false);

            } else {

                setHasMore(true);
            }
        }

    } catch (err) {

        console.log(err);

        ToastAndroid.show(
            'Error fetching overdue list',
            ToastAndroid.SHORT,
        );

    } finally {

        setLoading(false);

        setLoadingMore(false);
    }
};


    useFocusEffect(
    useCallback(() => {

    setPage(1);

    setHasMore(true);

    fetchMemberLoanList(1, false);

    }, [selectedCategories])
    );

    useEffect(() => {

    if (page > 1) {
    fetchMemberLoanList(page, true);
    }

    }, [page]);

    useEffect(()=>{
    if(isFocused){
    fetchMemberLoanList(1, false);
    setSelectedCategories([])
    }
    }, [isFocused])

    // const filteredAccounts = useMemo(() => {

    //     return overdueData.filter(item => {

    //         const searchMatch =
    //             item.custName.toLowerCase().includes(search.toLowerCase()) ||
    //             item.loanId.toLowerCase().includes(search.toLowerCase());

    //         const categoryMatch =
    //             selectedCategories.length === 0 ||
    //             selectedCategories.includes(item.category);

    //         return searchMatch && categoryMatch;
    //     });

    // }, [search, selectedCategories]);

const filteredAccounts = useMemo(() => {

    return memberLoanList.filter((item: any) => {

        return (
            item?.member_name
                ?.toLowerCase()
                ?.includes(search.toLowerCase()) ||

            item?.group_name
                ?.toLowerCase()
                ?.includes(search.toLowerCase()) ||

            String(item?.group_code)
                ?.toLowerCase()
                ?.includes(search.toLowerCase())
        );
    });

}, [search, memberLoanList]);


// const filteredAccounts = useMemo(() => {

//     return memberLoanList.filter((item: any) => {

//         const searchMatch =
//             item?.member_name
//                 ?.toLowerCase()
//                 ?.includes(search.toLowerCase()) ||

//             item?.group_name
//                 ?.toLowerCase()
//                 ?.includes(search.toLowerCase()) ||

//             String(item?.group_code)
//                 ?.toLowerCase()
//                 ?.includes(search.toLowerCase());

//         const overdueMonth =
//             Number(item?.overdue_month || 0);

//         let categoryMatch = true;

//         if (selectedCategories.length > 0) {

//             categoryMatch = selectedCategories.some(category => {
//                 console.log(category, 'categorycategorycategory');
                
//                 // <= 6 MONTHS
//                 if (category === '6') {
//                     return overdueMonth <= 6;
//                 }

//                 // > 6 AND <= 12
//                 if (category === '12') {
//                     return overdueMonth <= 12;
//                         // overdueMonth <= 12;
//                 }

//                 // > 12 AND <= 24
//                 if (category === '24') {
//                     return overdueMonth <= 24
//                         // overdueMonth <= 24;
//                 }

//                 // > 24
//                 if (category === '25') {
//                     return overdueMonth >= 25;
//                 }

//                 return false;
//             });
//         }

//         return searchMatch && categoryMatch;

//     });

// }, [search, memberLoanList, selectedCategories]);


    const handleView = async (item: any) => {

        console.log(item, 'itemitemitemitem');
        
        setSelectedAccount([]);
        setRemarks('');
        setPromiseAmount('')
        setPromiseDate('')
        setSitePhoto(null)
        setVisible(true);
        setItemOnclick({})
        setActiveTab(0)

        try {

        setLoading(true);

        const creds = {
            branch_code: loginStore?.brn_code,
            member_code: item?.member_code,
            group_code: item?.group_code
        };

        const res = await axios.post(ADDRESSES.FETCH_DETAILS_FR_VIEW, creds, {
            headers: {
            Authorization: loginStore?.token,
            'Content-Type': 'application/json',
            },
            },
        );
        console.log(res?.data, 'itemitemitem__res');
        if (res?.data?.suc) {
             console.log('itemitemitem__START', res?.data, 'END__itemitemitem');
            // const newData = res?.data?.data || [];
            setSelectedAccount(res?.data);
            setItemOnclick(item)
        }

    } catch (err) {
        console.log(err);
        ToastAndroid.show('Error fetching overdue list', ToastAndroid.SHORT,);

    } finally {
        setLoading(false);
    }

    };

    const handleCall = (phone: string) => {

        if (!phone) {
            ToastAndroid.show('Phone number not available', ToastAndroid.SHORT,);
            return;
        }

        Linking.openURL(`tel:${phone}`);
    };

    // const handleWhatsApp = (phone: string) => {

    //     Linking.openURL(`tel:${phone}`);
    // };


    const handleWhatsApp = (phone?: string) => {

        if (!phone) {
            ToastAndroid.show('Phone number not available', ToastAndroid.SHORT,);
            return;
        }

        const cleanPhone = phone.replace(/\D/g, '');

        Linking.openURL(
            `https://wa.me/91${cleanPhone}`
        );
    };

    const renderItem = ({ item }: any) => (

        <Card
            mode="outlined"
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outlineVariant,
                }
            ]}
        >
            <Card.Content>

                <View style={styles.cardHeader}>

                    <View style={{ flex: 1 }}>

                        <Text
                            variant="titleMedium"
                            style={{ fontWeight: '700' }}
                        >
                            {item.member_name}  
                            {/* {JSON.stringify(selectedCategories, null, 2)} {selectedCategories.length < 1 ? 0 : selectedCategories} */}
                        </Text>

                        <View style={styles.loanInfoRow}>

                            <Text style={styles.smallChip}>
                                Group: {item.group_name} - ({item.group_code})
                            </Text>

                            {/* <Chip compact style={styles.smallChip}>
                               Code: {item.group_code}
                            </Chip> */}

                        </View>

                    </View>

                    <TouchableOpacity
                        onPress={() => handleView(item)}
                    >
                        <MaterialCommunityIcons
                            name="eye-outline"
                            size={26}
                            color={theme.colors.primary}
                        />
                    </TouchableOpacity>

                </View>

                <Divider style={{ marginVertical: 10 }} />

                <View style={styles.bottomRow}>

                    <Text
                        variant="bodyMedium"
                        style={{
                            color: '#d32f2f',
                            fontWeight: '700',
                        }}
                    >
                        Overdue ₹{item.overdue_amount} 
                        {/* // {item.overdue_month}  */}
                    </Text>

                    <View style={styles.actionRow}>

                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => handleCall(item.client_mobile)}
                        >
                            <MaterialCommunityIcons
                                name="phone"
                                size={22}
                                color="#2e7d32"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconBtn}
                            onPress={() => handleWhatsApp(item.client_mobile)}>
                            <MaterialCommunityIcons
                                name="whatsapp"
                                size={22}
                                color="#25D366"
                            />
                        </TouchableOpacity>

                    </View> 

                </View>

                {/* LAST VISIT DATE */}
            <CustomText
                body4
                color={COLORS.gray}
                style={{ marginTop: 8 }}
            >
                Last Visit:{' '}
                {/* {item.visitDttime
                    ? new Date(item.visitDttime).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : 'No Visit'} */}

                    {item.date_time_visit
                    ? item.date_time_visit
                    : 'No Visit'}

                    
            </CustomText>

            </Card.Content>
        </Card>
    );

    // const pickImage = async () => {

    //     try {

    //         const image = await ImagePicker.openCamera({
    //             width: 400,
    //             height: 400,
    //             cropping: true,
    //         });

    //         setSitePhoto(image.path);

    //     } catch (error) {

    //         console.log(error);
    //     }
    // };

   const pickImage = async () => {

    try {

        const permissionGranted =
            await requestCameraPermission();

        if (!permissionGranted) {
            return;
        }

        const image = await ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
        });

        console.log('IMAGE => ', image);

        setSitePhoto(image);

    } catch (error) {

        console.log('CAMERA ERROR => ', error);
    }
};

    const handleSubmitAction = async () => {

    setLoading(true)

    // await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=AIzaSyDdA5VPRPZXt3IiE3zP15pet1Nn200CRzg`)
    // .then(res => {
    // handleSave(res?.data?.results[0]?.formatted_address);
    // }).catch(err => {
    // console.log("Error fetching geolocation address", err?.message);
    // setLoading(false);
    // })
    handleSave();

    }

    // const handleSave = async (lat_long_addr: string | null | undefined = '') => {
    const handleSave = async () => {
    if (!sitePhoto) {
        setLoading(false)
        ToastAndroid.show('Capture Photo is mandatory', ToastAndroid.SHORT);
        return;
    }

    if (!remarks?.trim()) {
        setLoading(false)
        ToastAndroid.show('Remarks is mandatory', ToastAndroid.SHORT);
        return;
    }

    console.log(itemOnclick?.group_code, 'itemOnclick');
    

    try {
        setLoading(true);

        const formData = new FormData();
        formData.append('branch_code',loginStore?.brn_code || '');
        formData.append('group_code', itemOnclick?.group_code || '');
        // formData.append('group_name', selectedAccount?.member_details?.group_name || '');
        formData.append('member_code', selectedAccount?.member_details?.member_code || '');
        // formData.append('member_name', selectedAccount?.member_details?.member_name || '');
        // formData.append('member_address', selectedAccount?.member_details?.client_addr || '');
        formData.append('phone_no', selectedAccount?.member_details?.client_mobile || '');
        formData.append('loan_id', selectedAccount?.loan_details?.[0]?.loan_id || '');
        // formData.append('disb_date', selectedAccount?.loan_details?.[0]?.disb_dt || '');
        // formData.append('start_date', selectedAccount?.loan_details?.[0]?.instl_start_dt || '');
        // formData.append('end_date', selectedAccount?.loan_details?.[0]?.instl_end_dt || '');
        // formData.append('disb_amt_gp', String(selectedAccount?.loan_details?.[0]?.group_disb_amount || ''));
        // formData.append('disb_amt_mem', String(selectedAccount?.loan_details?.[0]?.member_disb_amount || ''));
        // formData.append('scheme', selectedAccount?.loan_details?.[0]?.scheme_id || '');
        // formData.append('tot_emi', String(selectedAccount?.loan_details?.[0]?.tot_emi || ''));
        formData.append('od_date', selectedAccount?.overdue_details?.[0]?.overdue_date || '');
        formData.append('od_amt_grp', String(selectedAccount?.overdue_details?.[0]?.group_overdue_amount || ''));
        formData.append('od_amt_mem', String(selectedAccount?.overdue_details?.[0]?.member_overdue_amount || ''));
        formData.append('outstanding_gp', String(selectedAccount?.overdue_details?.[0]?.group_outstanding || ''));
        formData.append('outstanding_mem', String(selectedAccount?.overdue_details?.[0]?.member_outstanding || ''));
        formData.append('promise_date', promiseDate || '');
        formData.append('promise_amt', promiseAmount || '');
        formData.append('remarks',remarks || '');
        formData.append('created_by', loginStore?.emp_id || '');
        
        formData.append('visit_lat', location?.latitude || '');
        formData.append('visit_long', location?.longitude || '');
        // formData.append('visit_address', lat_long_addr || '');
        // IMAGE FILE
        formData.append('upload_img', {uri: sitePhoto?.path, type: sitePhoto?.mime || 'image/jpeg', name: sitePhoto?.filename || `photo_${Date.now()}.jpg`,});

        console.log(formData, 'formDataformDataformDataformData', selectedAccount);
        

        const res = await axios.post(ADDRESSES.SAVE_VISIT_OPTION, formData, {
            headers: {
            Authorization: loginStore?.token,
            'Content-Type': 'multipart/form-data',
            },
            },
        );

        console.log('FORM DATA => ', formData, ' <= FORM DATA');

        if (res?.data?.suc) {
             console.log('itemitemitem__START', res?.data, 'END__itemitemitem');
             fetchMemberLoanList(1, false);
            // const newData = res?.data?.data || [];
            // setSelectedAccount(res?.data);
            ToastAndroid.show(res?.data?.msg, ToastAndroid.SHORT,);
        }

    } catch (err) {
        console.log(err);
        ToastAndroid.show('Error fetching overdue list', ToastAndroid.SHORT,);

    } finally {
        setLoading(false);
    }

    // const payload = {

    //     member_code:
    //         selectedAccount?.member_details?.member_code,

    //     member_name:
    //         selectedAccount?.member_details?.member_name,

    //     promise_amount: promiseAmount || null,

    //     promise_date: promiseDate || null,

    //     remarks: remarks,

    //     file: {
    //         path: sitePhoto?.path,
    //         mime: sitePhoto?.mime,
    //         filename: sitePhoto?.filename || `photo_${Date.now()}.jpg`,
    //     },
    // };

    // console.log(
    //     'SAVE DATA => ',
    //     JSON.stringify(payload, null, 2)
    // );

    // ToastAndroid.show(
    //     'Data logged in console',
    //     ToastAndroid.SHORT
    // );

    setVisible(false);
};

    return (

        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >

            <SafeAreaView
    style={{
        flex: 1,
        backgroundColor: theme.colors.background,
    }}
>

    

    <HeadingComp title="Overdue" subtitle="Overdue Member or Group List" />

    
    <FlatList
        data={filteredAccounts}
        keyExtractor={(item, index) =>
            item?.member_code?.toString() ||
            index.toString()
        }

        renderItem={renderItem}

        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled"

        contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 120,
            flexGrow:
                filteredAccounts.length === 0 ? 1 : 0,
        }}

        // ListHeaderComponent={
        //     <>
        //         <Searchbar
        //             placeholder="Search Member or Group Name"
        //             value={search}
        //             onChangeText={setSearch}
        //             style={{ marginBottom: 15 }}
        //         />
        //     </>
        // }

        ListHeaderComponent={
    <>

       
        <Searchbar
            placeholder="Search Member or Group Name"
            value={search}
            onChangeText={setSearch}
            style={{ marginBottom: 15 }}
        />

        <View style={styles.keywordWrapper}>
                    <View style={styles.keywordHeader}>
                        <CustomText h4 bold color={COLORS.black}>
                            Categories (Monthly)
                        </CustomText>

                        {selectedCategories.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSelectedCategories([])}
                            >
                                <CustomText
                                    body4
                                    color={COLORS.black}
                                    style={{ opacity: 0.9 }}
                                >
                                    Clear All
                                </CustomText>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.keywordContainer}>
                        {OVERDUE_CATEGORIES
                            .filter(item => item.value !== 'all')
                            .map(item => {
                                const selected =
                                    selectedCategories.includes(item.value);
                                return (
                                    <TouchableOpacity
                                        key={item.value}
                                        activeOpacity={0.85}
                                        onPress={() => toggleCategory(item.value)}
                                        style={[
                                            styles.keywordChip,
                                            selected && styles.keywordChipActive,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                selected && styles.checkboxActive,
                                            ]}
                                        >
                                            {selected && (
                                                <MaterialCommunityIcons
                                                name="check-circle"
                                                size={15}
                                                color="#cc9705"
                                                />
                                            )}
                                        </View>

                                        <CustomText
                                            numberOfLines={1}
                                            bold={selected}
                                            color={selected ? COLORS.white : COLORS.text}
                                            style={{
                                                // flex: 1,
                                                textAlign: 'center',
                                                fontSize: fp(12),
                                            }}
                                        >
                                            {item.label}
                                        </CustomText>
                                    </TouchableOpacity>
                                );
                            })}

                            {/* <Text> {JSON.stringify(selectedAccount, null, 2)} </Text> */}
                    </View>
                </View>
    </>
}

        onEndReached={() => {

            console.log('END REACHED');

            if (
                !loading &&
                !loadingMore &&
                hasMore &&
                memberLoanList.length >= limit
            ) {

                setPage(prev => prev + 1);
            }
        }}

        onEndReachedThreshold={0.2}

        ListFooterComponent={
            loadingMore ? (
                <View
                    style={{
                        paddingVertical: 20,
                        alignItems: 'center',
                    }}
                >
                    {/* <Text>Loading more...</Text> */}
                    <LoadingOverlay />
                </View>
                
            ) : null
        }

        ListEmptyComponent={
            loading ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 100,
                    }}
                >
                    <Text>
                        Loading overdue accounts...
                    </Text>
                </View>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 100,
                    }}
                >
                    <Text>
                        No overdue accounts found
                    </Text>
                </View>
            )
        }
    />

    {loading && (
    <LoadingOverlay />
    )}

</SafeAreaView>

            {/* DETAILS MODAL */}

            {/* DETAILS MODAL */}

<Portal>
    <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={[
            styles.modalContainer,
            {
                backgroundColor: theme.colors.background,
            }
        ]}
    >
        {selectedAccount && (

            <>
                {/* TAB HEADER */}

                <View style={styles.tabHeader}>

                    {['Member', 'Loan', 'Overdue', 'Actions'].map((tab, index) => {

                        const active = activeTab === index;

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setActiveTab(index)}
                                style={[
                                    styles.tabButton,
                                    active && {
                                        borderBottomWidth: 2,
                                        borderBottomColor: theme.colors.primary,
                                    }
                                ]}
                            >
                                <Text
                                    style={{
                                        fontWeight: active ? '700' : '500',
                                        color: active
                                            ? theme.colors.primary
                                            : theme.colors.outline,
                                    }}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 20,
                    }}
                >

                    {/* Member TAB */}

                    {activeTab === 0 && (

                        <>
                        
                        
                        
                        <View style={{ marginTop: 20 }}>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Address</Text>
                                <Text>
                                    {selectedAccount?.member_details?.client_addr}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Phone</Text>
                                <Text>
                                    {selectedAccount?.member_details?.client_mobile}
                                </Text>
                            </View>

                        </View>
                        {loading && (
                        <LoadingOverlay />
                        )}
                        </>
                    )}

                    {/* Loan TAB */}

                    {activeTab === 1 && (
                        <>
                        

                        <View style={{ marginTop: 20 }}>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Loan ID
                                </Text>

                                <Text>
                                    {selectedAccount?.loan_details[0]?.loan_id}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Disbursement Date
                                </Text>

                                <Text>
                                    {selectedAccount?.loan_details[0]?.disb_dt}
                                </Text>
                            </View>

                            {/* <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Start Date
                                </Text>

                                <Text>
                                    {selectedAccount?.loan_details[0]?.instl_start_dt}
                                </Text>
                            </View> */}

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Due Date
                                </Text>

                                <Text>
                                    {selectedAccount?.loan_details[0]?.instl_end_dt}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Disbursement Amount (Group)
                                </Text>

                                <Text>
                                    ₹{selectedAccount?.loan_details[0]?.group_disb_amount}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Disbursement Amount (Member)
                                </Text>

                                <Text>
                                    ₹{selectedAccount?.loan_details[0]?.member_disb_amount}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Scheme
                                </Text>

                                <Text>
                                    {selectedAccount?.loan_details[0]?.scheme_name}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    EMI
                                </Text>

                                <Text>
                                    {selectedAccount?.loan_details[0]?.tot_emi}
                                </Text>
                            </View>

                        </View>
                        {loading && (
                        <LoadingOverlay />
                        )}
                        </>
                    )}

                    {/* Overdue TAB */}

                    {activeTab === 2 && (

                        <>
                        <View style={{ marginTop: 20 }}>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Overdue Date
                                </Text>

                                <Text>
                                    {selectedAccount?.overdue_details[0]?.overdue_date}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Overdue Amount (Group)
                                </Text>

                                <Text>
                                    ₹{selectedAccount?.overdue_details[0]?.group_overdue_amount}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Overdue Amount (Member)
                                </Text>

                                <Text style={{ color: 'red' }}>
                                    ₹{selectedAccount?.overdue_details[0]?.member_overdue_amount}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Outstanding Amount (Group)
                                </Text>

                                <Text>
                                    ₹{selectedAccount?.overdue_details[0]?.group_outstanding}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>
                                    Outstanding Amount (Member)
                                </Text>

                                <Text>
                                    ₹{selectedAccount?.overdue_details[0]?.member_outstanding}
                                </Text>
                            </View>

                        </View>
                        {loading && (
                        <LoadingOverlay />
                        )}
                        </>
                    )}


                    {/* ACTION TAB */}

                    {activeTab === 3 && (
                     <>
                    <View style={{ marginTop: 20 }}>

                    {/* PHOTO SECTION */}

                    <Text
                    variant="titleMedium"
                    style={{
                    fontWeight: '700',
                    marginBottom: 15,
                    }}
                    >
                    Site / Collection Photo
                    </Text>

                    <View style={styles.photoContainer}>

                    {sitePhoto ? (

                    <View style={styles.previewWrapper}>

                    {/* <Image
                    source={{ uri: sitePhoto }}
                    style={styles.previewImage}
                    /> */}
                    <Image
                        source={{ uri: sitePhoto?.path }}
                        style={styles.previewImage}
                    />

                    <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => setSitePhoto(null)}
                    >
                    <MaterialCommunityIcons
                    name="close-circle"
                    size={28}
                    color="red"
                    />
                    </TouchableOpacity>

                        </View>

                    ) : (

                        <View style={styles.photoButtonsRow}>

                            <TouchableOpacity
                                style={[
                                    styles.photoBtn,
                                    {
                                        backgroundColor:
                                            theme.colors.surfaceVariant,
                                    }
                                ]}
                                onPress={pickImage}
                            >
                                <MaterialCommunityIcons
                                    name="camera"
                                    size={28}
                                    color={theme.colors.primary}
                                />

                                <Text
                                    style={{
                                        marginTop: 5,
                                        fontWeight: '600',
                                    }}
                                >
                                    Capture Photo
                                </Text>

                            </TouchableOpacity>

                        </View>
                    )}

        </View>

        {/* PROMISE AMOUNT */}

        <TextInput
            mode="outlined"
            label="Promise Amount"
            keyboardType="numeric"
            value={promiseAmount}
            onChangeText={setPromiseAmount}
            style={{ backgroundColor: theme.colors.background, marginTop: 20 }}
        />

       

        {/* PROMISE DATE */}

        
        <TouchableOpacity
    onPress={() => setShowDatePicker(true)}
>
    <TextInput
        // mode="outlined"
        label="Promise Date"
        value={promiseDate}
        editable={false}
        pointerEvents="none"
        style={{ backgroundColor: theme.colors.background, marginTop: 20 }}
        right={
            <TextInput.Icon icon="calendar" />
        }
    />
    
</TouchableOpacity>

{showDatePicker && (

    <View style={{ marginTop: 15 }}>

        <DateTimePickerModal
    mode="single"
    date={promiseDateObj || new Date()}

    minDate={new Date()}

    styles={{
        disabled: {
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
        },

        disabled_label: {
            color: '#c0c0c0',
            textDecorationLine: 'line-through',
        },
    }}

    onChange={(params: any) => {

        setPromiseDateObj(params.date);

        if (params?.date) {

            const dt = new Date(params.date);

            const formatted =
                `${dt.getFullYear()}-${String(
                    dt.getMonth() + 1
                ).padStart(2, '0')}-${String(
                    dt.getDate()
                ).padStart(2, '0')}`;

            setPromiseDate(formatted);
        }

        setShowDatePicker(false);
    }}
/>

    </View>
)}

        {/* REMARKS */}

        <TextInput
            mode="outlined"
            label="Remarks"
            multiline
            numberOfLines={4}
            value={remarks}
            onChangeText={setRemarks}
            style={{backgroundColor: theme.colors.background, minHeight: 95, marginTop: 15 }}
        />

        

        {/* SAVE BUTTON */}

        <Button
            mode="contained"
            style={{
                marginTop: 20,
            }}
            onPress={() => {

                // alert('Demo Save Success');

                // setVisible(false);
                handleSubmitAction()
            }}
        >
            Update & Save
        </Button>

                    </View>
                    {loading && (
                    <LoadingOverlay />
                    )}
                    </>
                    )}

                </ScrollView>
            </>
        )}
        {/* {selectedAccount && selectedAccount.length < 1 && (
            <Text style={{textAlign: 'center'}}>No Data Found</Text>
        )} */}
    </Modal>
</Portal>

        </SafeAreaView>
    );
};

export default Overdue;

const styles = StyleSheet.create({

    card: {
        marginBottom: 15,
        borderRadius: 14,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    loanInfoRow: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 8,
        flexWrap: 'wrap',
    },

    smallChip: {
        height: 30,
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },

    iconBtn: {
        padding: 6,
    },

    categoryWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },

    categoryChip: {
        borderRadius: 50,
    },

    modalContainer: {
        margin: 20,
        borderRadius: 16,
        padding: 20,
        maxHeight: '85%',
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    label: {
        fontWeight: '700',
    },

    tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
},

tabButton: {
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
},

photoContainer: {
    marginTop: 10,
},

photoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
},

photoBtn: {
    width: 140,
    height: 120,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
},

previewWrapper: {
    position: 'relative',
    alignSelf: 'center',
},

previewImage: {
    width: 220,
    height: 220,
    borderRadius: 14,
},

removePhoto: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 50,
},

keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
},

keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#fff',
},

keywordChipActive: {
    backgroundColor: '#cc9705',
    borderColor: '#99740e',
},

checkbox: {
    width: 18,
    height: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
},

checkboxActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
},

keywordWrapper: {
        marginTop: 10,
    },

keywordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

});