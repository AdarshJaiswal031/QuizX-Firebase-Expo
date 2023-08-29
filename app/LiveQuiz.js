import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Firebase from '../firebaseDev/firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LiveQuiz() {
    useEffect(() => {
        getData();
    }, []);
    const [quizData, setquizData] = useState([])
    const getData = () => {
        const database = Firebase.database();
        const liveQuizes = database.ref(`liveQuizes`);
        liveQuizes.on(('value'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const quizesArray = Object.values(data);
                setquizData(quizesArray);
                console.log(quizesArray)
            }
        });
    }
    const navigation = useNavigation();
    const handleQuizCardPress = async (key) => {
        await AsyncStorage.setItem('dataKey', key);
        navigation.navigate('Quiz');
    };
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.textStyles}>Live Quizes</Text>
            {quizData.length != 0 ? (<ScrollView style={styles.container}>
                {quizData.map((quiz) => (
                    <TouchableOpacity
                        key={quiz.key}
                        style={styles.quizCardContainer}
                        onPress={() => handleQuizCardPress(quiz.key)}
                    >
                        <View style={styles.quizCardContent}>
                            <Text style={styles.uploaderText}>{quiz.name}</Text>
                            <Text style={styles.quizNameText}>{quiz.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>) : (<Text style={[styles.quizNameText, styles.mar]}>No quiz found !!</Text>)
            }


        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#16161e",
    },
    textStyles: {
        marginTop: "20%",
        marginBottom: "5%",
        marginLeft: "6%",
        color: "white",
        fontSize: 30,
    },
    container: {
        flexGrow: 0.9,
        width: "95%",
        marginLeft: "2%",
    },

    quizCardContainer: {
        backgroundColor: '#2a2a32',
        borderRadius: 12,
        elevation: 5,
        margin: 10,
    },
    quizCardContent: {
        padding: 16,
    },
    uploaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "white"
    },
    quizNameText: {
        fontSize: 14,
        marginTop: 4,
        color: "#676768"
    },
    mar: {
        marginLeft: "6%"
    }
})