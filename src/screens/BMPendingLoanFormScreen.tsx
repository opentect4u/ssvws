import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import StepIndicator from 'react-native-step-indicator'
import HeadingComp from '../components/HeadingComp'
import ButtonPaper from '../components/ButtonPaper'
import { Icon } from 'react-native-paper'
import BMBasicDetailsForm from "./forms/BMBasicDetailsForm"
import BMOccupationDetailsForm from "./forms/BMOccupationDetailsForm"
import BMHouseholdDetailsForm from "./forms/BMHouseholdDetailsForm"
// import BMFamilyMemberDetailsForm from "./forms/BMFamilyMemberDetailsForm"
import { useRoute } from '@react-navigation/native'

const BMPendingLoanFormScreen = () => {
    const theme = usePaperColorScheme()
    const { params } = useRoute<any>()
    const [currentPosition, setCurrentPosition] = useState(0)
    const [basicDetailsUpdateDisabled, setBasicDetailsUpdateDisabled] = useState(true)
    const [occupationUpdateDisabled, setOccupationUpdateDisabled] = useState(true)

    const labels = ["Basic Details", "Occupation Details", "Household Details"]

    const customStyles = {
        stepIndicatorSize: 40,
        currentStepIndicatorSize: 45,
        separatorStrokeWidth: 3,
        currentStepStrokeWidth: 5,
        stepStrokeCurrentColor: theme.colors.greenContainer,
        stepStrokeWidth: 2,
        stepStrokeFinishedColor: theme.colors.green,
        stepStrokeUnFinishedColor: theme.colors.outlineVariant,
        separatorFinishedColor: theme.colors.onGreenContainer,
        separatorUnFinishedColor: theme.colors.outline,
        stepIndicatorFinishedColor: theme.colors.green,
        stepIndicatorUnFinishedColor: theme.colors.surface,
        stepIndicatorCurrentColor: theme.colors.surface,
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: theme.colors.onBackground,
        stepIndicatorLabelFinishedColor: theme.colors.green,
        stepIndicatorLabelUnFinishedColor: theme.colors.surface,
        labelColor: theme.colors.secondary,
        labelSize: 13,
        currentStepLabelColor: theme.colors.green,
    }

    // Create a ref for the Basic & Occupation Details form.
    const basicDetailsFormRef = useRef(null)
    const occupationFormRef = useRef(null)

    // onSubmit callback moves to the next step.
    const handleFormSubmit = () => {
        setCurrentPosition(prev => prev + 1)
    }

    // NEXT button handler.
    // For the Basic Details and Occupation Details step, it triggers the update logic.
    const handleNextButton = () => {
        if (currentPosition === 0) {
            basicDetailsFormRef.current?.updateAndNext()
        }
        else if (currentPosition === 1) {
            occupationFormRef.current?.updateAndNext()
        } else {
            setCurrentPosition(prev => prev + 1)
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{ backgroundColor: theme.colors.background, height: 'auto' }}>
                <HeadingComp title="GRT Form" subtitle={`Form no. ${params?.formNumber}`} isBackEnabled />
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    gap: 10,
                    paddingBottom: 20,
                    height: "auto",
                    justifyContent: "space-between",
                    alignItems: "stretch"
                }}>
                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={currentPosition}
                        labels={labels}
                        stepCount={3}
                        renderStepIndicator={
                            ({ position, stepStatus }) =>
                                position === 0
                                    ? <Icon size={20} source="account" color={(stepStatus === "current" || stepStatus === "unfinished") ? theme.colors.green : theme.colors.greenContainer} />
                                    : position === 1
                                        ? <Icon size={20} source="office-building-outline" color={(stepStatus === "current" || stepStatus === "unfinished") ? theme.colors.green : theme.colors.greenContainer} />
                                        : position === 2
                                            ? <Icon size={20} source="home-city-outline" color={(stepStatus === "current" || stepStatus === "unfinished") ? theme.colors.green : theme.colors.greenContainer} />
                                            : null
                        }
                    />

                    {currentPosition === 0 && (
                        <BMBasicDetailsForm
                            ref={basicDetailsFormRef}
                            formNumber={params?.formNumber}
                            branchCode={params?.branchCode}
                            onSubmit={handleFormSubmit}
                            onUpdateDisabledChange={setBasicDetailsUpdateDisabled}
                        />
                    )}
                    {currentPosition === 1 && (
                        <BMOccupationDetailsForm
                            ref={occupationFormRef}
                            formNumber={params?.formNumber}
                            branchCode={params?.branchCode}
                            onSubmit={handleFormSubmit}
                            onUpdateDisabledChange={setOccupationUpdateDisabled}
                        />
                    )}
                    {currentPosition === 2 && (
                        <BMHouseholdDetailsForm
                            formNumber={params?.formNumber}
                            branchCode={params?.branchCode}
                            onSubmit={handleFormSubmit}
                        />
                    )}
                    {/* BMFamilyMemberDetailsForm can be added similarly */}
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <ButtonPaper
                            mode='outlined'
                            icon="arrow-left-thick"
                            onPress={() => setCurrentPosition(prev => prev - 1)}
                            disabled={currentPosition === 0}
                        >
                            PREVIOUS
                        </ButtonPaper>
                        <ButtonPaper
                            mode='text'
                            icon="arrow-right-bold-outline"
                            onPress={handleNextButton}
                            disabled={
                                // If on the Occupation step, disable if the update button would be disabled.
                                currentPosition === 2 ||
                                (currentPosition === 1 && occupationUpdateDisabled) ||
                                (currentPosition === 0 && basicDetailsUpdateDisabled)
                            }
                        >
                            NEXT
                        </ButtonPaper>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BMPendingLoanFormScreen

const styles = StyleSheet.create({})
