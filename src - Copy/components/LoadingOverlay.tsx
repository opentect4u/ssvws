import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

const LoadingOverlay = () => {
    return (
        <View style={styles.container}>
            <BlurView
                style={styles.blurView}
                blurType="light" // You can change it to 'light', 'xlight' or 'dark'
                blurAmount={5} // Adjust this value to control the blur intensity
            // reducedTransparencyFallbackColor="rgba(0,0,0,0.7)" // Fallback for Android
            />
            <ActivityIndicator size="large" color="#333333" />
        </View>
    );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
    },
});
