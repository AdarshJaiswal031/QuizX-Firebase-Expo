import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { React, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
export default function Nav() {
    console.log("nav")
    const [selectedButton, setSelectedButton] = useState(null);
    const navigation = useNavigation();
    const handleButtonPress = (button) => {
        setSelectedButton(button);
    };
    const onPressButton1 = () => {
        navigation.navigate('LiveQuiz');
    };
    const onPressButton2 = () => {
        navigation.navigate('QuestionForm');
    };
    const onPressButton3 = () => {
        navigation.navigate('CoinRedeemPage');
    };
    const onPressButton4 = () => {
        navigation.navigate('ProfilePage');
    };
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button,
                ]} onPress={() => {
                    handleButtonPress('Home');
                    onPressButton1();
                    // onPressButton31();
                }}>
                    <Text style={[styles.textStyle,
                    selectedButton === 'Home' && styles.selectedButtonText,]}>⌂</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,
                ]} onPress={() => {
                    handleButtonPress('Upload');
                    onPressButton2()
                }}>
                    <Text style={[styles.textStyle,
                    selectedButton === 'Upload' && styles.selectedButtonText,]}>⏏</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,
                ]} onPress={() => {
                    handleButtonPress('Premium');
                    onPressButton3()
                }}>
                    <Text style={[styles.textStyle,
                    selectedButton === 'Premium' && styles.selectedButtonText,]}>⍟</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,
                ]} onPress={() => {
                    handleButtonPress('Profile');
                    onPressButton4()
                }}>
                    <Text style={[styles.textStyle,
                    selectedButton === 'Profile' && styles.selectedButtonText,]}>⎊</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#202124",
        flex: 0.2,
        flexDirection: "column",
        position: "absolute",
        top: "92%",
        height: "8%",
        width: "100%",
    },
    textStyle: {
        color: "grey",
        fontSize: 25
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        paddingVertical: 0,
    },
    button: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 8,
        // borderWidth: 1,
        // borderColor: '#333',
    },
    selectedButtonText: {
        color: "#49f5c6", // Change color when selected
    },
})