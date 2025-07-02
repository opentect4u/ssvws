import { Alert, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePaperColorScheme } from '../../theme/theme'
import InputPaper from '../../components/InputPaper'
import { Divider, IconButton, List, Text } from 'react-native-paper'
import LoadingOverlay from '../../components/LoadingOverlay'
import RadioComp from '../../components/RadioComp'
import ButtonPaper from '../../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import MenuPaper from '../../components/MenuPaper'
import { loginStorage } from '../../storage/appStorage'

const BMFamilyMemberDetailsForm = ({ formNumber, branchCode }) => {
    const theme = usePaperColorScheme()

    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    const [loading, setLoading] = useState(false)

    const [educations, setEducations] = useState(() => [])
    const [memberGenders, setMemberGenders] = useState(() => [])

    // Each form item has independent state now
    const [formArray, setFormArray] = useState([{
        sl_no: 0,
        name: '',
        relation: '',
        age: '',
        sex: '',
        education: '',
        studyingOrWorking: '',
        monthlyIncome: ''
    },])

    // Function to handle adding a new form
    const handleFormAdd = () => {
        setFormArray(prev => [
            ...prev,
            {
                sl_no: prev.length + 1,
                name: '',
                relation: '',
                age: '',
                sex: '',
                education: '',
                studyingOrWorking: '',
                monthlyIncome: ''
            }
        ])
    }

    const handleFormRemove = (index) => {
        setFormArray(prev => prev.filter((_, i) => i !== index))
    }

    // const handleInputChange = (index: number, field: string, value: any) => {
    //     const updatedForm = [...formArray]
    //     updatedForm[index][field] = value
    //     setFormArray(updatedForm)
    // }

    // const handleInputChange = (index: number, field: string, value: any) => {
    //     // Add safeguard to ensure the form item exists
    //     if (formArray[index]) {
    //         const updatedForm = [...formArray];
    //         updatedForm[index][field] = value; // Safely update the form field
    //         setFormArray(updatedForm);
    //     } else {
    //         console.error(`No form item found at index ${index}`);
    //     }
    // }

    const handleInputChange = (index: number, field: string, value: any) => {
        // Add check to ensure formArray[index] exists
        // if (index >= 0 && index < formArray.length) {
        if (formArray[index]) {
            const updatedForm = [...formArray];
            updatedForm[index][field] = value;
            setFormArray(updatedForm);
        } else {
            console.error(`No form item found at index ${index}`);
        }
    };

    const fetchFamilyMemberDetails = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${ADDRESSES.FETCH_FAMILY_DETAILS}?form_no=${formNumber}&branch_code=${branchCode}`);
            console.log(">>>>>>>>>>>>>>>>>>>>", res?.data);

            if (res?.data?.suc === 1) {
                const apiData = res?.data?.msg || [];

                if (apiData?.length > 0) {
                    // Transform the API response to match the form structure
                    const transformedData = apiData.map((member, index) => ({
                        sl_no: member.sl_no || index + 1,
                        name: member.name || '',
                        relation: member.relation || '',
                        age: member.age?.toString() || '',
                        sex: member.sex || '',
                        education: member.education || '',
                        studyingOrWorking: member.studyingOrWorking || '',
                        monthlyIncome: member.monthlyIncome?.toString() || ''
                    }));
                    setFormArray(transformedData);
                }
                // else {
                //     handleFormAdd()
                // }
            }
        } catch (err) {
            console.log("XXXXXXXXXXXXXXXX", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchFamilyMemberDetails()
    }, [])

    const handleFetchEducations = async () => {
        setLoading(true);
        setEducations(() => []);
        await axios.get(`${ADDRESSES.GET_EDUCATIONS}`).then(res => {
            res?.data?.forEach(item => {
                setEducations(prev => [
                    ...prev,
                    {
                        title: item?.name,
                        func: (formIndex) => handleInputChange(formIndex, "education", item?.id)
                    }
                ]);
            });
        }).catch(err => {
            ToastAndroid.show("Some error occurred {handleFetchEducations}!", ToastAndroid.SHORT);
        });
        setLoading(false);
    }

    useEffect(() => {
        handleFetchEducations()
    }, [])

    useEffect(() => {
        setMemberGenders([
            { title: "Male", func: (formIndex) => handleInputChange(formIndex, "sex", "M") },
            { title: "Female", func: (formIndex) => handleInputChange(formIndex, "sex", "F") },
            { title: "Others", func: (formIndex) => handleInputChange(formIndex, "sex", "O") }
        ]);
    }, []);

    const handleFormUpdate = async () => {
        setLoading(true)

        const creds = {
            form_no: formNumber,
            branch_code: branchCode,
            created_by: loginStore?.emp_name,
            modified_by: loginStore?.emp_name,
            memberdtls: formArray
        }

        console.log("YYYYYYYYYYYYYYYYYYYYY", creds)

        await axios.post(`${ADDRESSES.SAVE_FAMILY_DETAILS}`, creds).then(res => {
            console.log("UUUUUUUUUUUUUUUUUUUU", res?.data)
            if (res?.data?.suc === 1) {
                ToastAndroid.show("Family member details updated successfully!", ToastAndroid.SHORT)
            }
        }).catch(err => {
            console.log("88888888888888888888", err)
        })

        setLoading(false)
    }

    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^", formArray)

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                {formArray?.map((item, i) => (
                    <View key={i} style={{ paddingTop: 10, gap: 10 }}>
                        {/* {console.log("BBBBBBBBBBBBBBBBBB", item, i)} */}
                        <Text variant='titleMedium' style={{
                            color: theme.colors.primary
                        }}>Member {i + 1}</Text>
                        <Divider />

                        <InputPaper
                            label="Name"
                            leftIcon='account-edit-outline'
                            keyboardType="default"
                            value={item?.name}
                            onChangeText={(txt) => handleInputChange(i, 'name', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        <InputPaper
                            label="Relation"
                            maxLength={15}
                            leftIcon='account-child-outline'
                            keyboardType="default"
                            value={item?.relation}
                            onChangeText={(txt) => handleInputChange(i, 'relation', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        <InputPaper
                            label="Age"
                            maxLength={3}
                            leftIcon='account-clock-outline'
                            keyboardType="numeric"
                            value={item?.age}
                            onChangeText={(txt) => handleInputChange(i, 'age', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        {/* <RadioComp
                            title="Sex"
                            icon="gender-male-female"
                            dataArray={[
                                {
                                    optionName: "MALE",
                                    optionState: item?.sex,
                                    currentState: "m",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'sex', value)
                                },
                                {
                                    optionName: "FEMALE",
                                    optionState: item?.sex,
                                    currentState: "f",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'sex', value)
                                },
                            ]}
                        /> */}

                        <List.Item
                            title="Choose Gender"
                            description={`Gender: ${item.sex}`}
                            left={props => <List.Icon {...props} icon="gender-male-female" />}
                            right={props => {
                                return <MenuPaper menuArrOfObjects={memberGenders.map(gender => ({
                                    ...gender,
                                    func: () => gender.func(i)  // Pass current form index (i)
                                }))} />
                            }}
                            descriptionStyle={{
                                color: theme.colors.tertiary,
                            }}
                        />

                        {/* <InputPaper
                            label="Education"
                            maxLength={50}
                            leftIcon='book-education-outline'
                            keyboardType="default"
                            value={item?.education}
                            onChangeText={(txt) => handleInputChange(i, 'education', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        /> */}

                        {console.log("====++++===+++===", educations.map(education => ({
                            ...education,
                            func: () => education.func(i)  // Pass current form index (i)
                        })))}

                        <List.Item
                            title="Choose Education"
                            description={`Education: ${item.education}`}
                            left={props => <List.Icon {...props} icon="book-education-outline" />}
                            right={props => {
                                return <MenuPaper menuArrOfObjects={educations.map(education => ({
                                    ...education,
                                    func: () => education.func(i)  // Pass current form index (i)
                                }))} />
                            }}
                            descriptionStyle={{
                                color: theme.colors.tertiary,
                            }}
                        />

                        <RadioComp
                            title="Study/Work"
                            icon="office-building-cog-outline"
                            dataArray={[
                                {
                                    optionName: "STUDY",
                                    optionState: item?.studyingOrWorking,
                                    currentState: "Studying",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'studyingOrWorking', value)
                                },
                                {
                                    optionName: "WORK",
                                    optionState: item?.studyingOrWorking,
                                    currentState: "Working",
                                    optionSetStateDispathFun: (value) => handleInputChange(i, 'studyingOrWorking', value)
                                },
                            ]}
                        />

                        <InputPaper
                            label="Monthly Income"
                            maxLength={15}
                            leftIcon='account-cash-outline'
                            keyboardType="numeric"
                            value={item?.monthlyIncome}
                            onChangeText={(txt) => handleInputChange(i, 'monthlyIncome', txt)}
                            customStyle={{ backgroundColor: theme.colors.background }}
                        />

                        {formArray?.length > 1 && <IconButton icon="minus" iconColor={theme.colors.onErrorContainer} onPress={() => handleFormRemove(i)} style={{
                            alignSelf: "flex-end",
                            backgroundColor: theme.colors.errorContainer
                        }} />}
                    </View>
                ))}

                <IconButton icon="plus" iconColor={theme.colors.onTertiaryContainer} onPress={() => handleFormAdd()} style={{
                    alignSelf: "flex-end",
                    backgroundColor: theme.colors.tertiaryContainer,
                    marginTop: formArray?.length === 1 ? 10 : 0
                }} />

                <ButtonPaper mode='text' icon="cloud-upload-outline" onPress={() => {
                    Alert.alert("Update Family Members Details", "Are you sure you want to update this?", [
                        { text: "No", onPress: () => null },
                        { text: "Yes", onPress: () => handleFormUpdate() },
                    ])
                }} disabled={loading}
                    loading={loading}>UPDATE</ButtonPaper>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default BMFamilyMemberDetailsForm
