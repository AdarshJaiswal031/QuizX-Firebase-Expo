import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Firebase from '../firebaseDev/firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';


const QuestionForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // const [answer, setAnswer] = useState(0);
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''] }]);
    const [hash, setHash] = useState('');
    useEffect(() => {
        checkLocalStorage();
    }, []);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: 0 }]);
    };

    const handleQuestionChange = (index, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = text;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, text) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = text;
        setQuestions(updatedQuestions);
    };

    const answerChange = (questionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answer = value;
        setQuestions(updatedQuestions);
    }
    const handleSubmit = async () => {
        const quizData = {
            name,
            description,
            allQuestions: questions,
            uploader: hash
        };
        const quizLive = {
            name,
            description,
            uploader: hash
        }

        console.log(quizData);
        if (hash) {
            const database = await Firebase.database();
            if (database) {
                const dataQuizes = database.ref(`dataQuizes`);
                const liveQuizes = database.ref(`liveQuizes`);
                const pushKey = dataQuizes.push().key
                dataQuizes.child(pushKey).set(quizData);
                quizLive.key = pushKey
                liveQuizes.child(pushKey).set(quizLive);
                console.log("LiveQuiz Updated")
            }
            else {
                console.log("something wronge with db")
            }

        }
        else {
            console.log("something went wrong")
        }
        setName('');
        setDescription('');
        setQuestions([{ question: '', options: ['', '', '', ''], answer: 0 }]);
    };

    const checkLocalStorage = async () => {
        const storedHash = await AsyncStorage.getItem('quizKey');
        if (storedHash) {
            setHash(storedHash);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.textStyles}>Create Quiz</Text>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#555353"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor="#555353"
                />
                {questions.map((q, questionIndex) => (
                    <View key={questionIndex} style={styles.questionContainer}>
                        <TextInput
                            style={styles.questionInput}
                            placeholder={`Question ${questionIndex + 1}`}
                            placeholderTextColor="#555353"
                            value={q.question}
                            onChangeText={(text) => handleQuestionChange(questionIndex, text)}
                        />
                        {q.options.map((option, optionIndex) => (
                            <View>
                                <TextInput
                                    key={`${optionIndex}${q}`}
                                    style={styles.optionInput}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    placeholderTextColor="#555353"
                                    value={option}
                                    onChangeText={(text) => handleOptionChange(questionIndex, optionIndex, text)}
                                />
                            </View>
                        ))}
                        <RNPickerSelect
                            key={`${questionIndex}+selector`}
                            onValueChange={(value) => answerChange(questionIndex, value)}
                            items={[
                                { label: `Option 1`, value: 0 },
                                { label: `Option 2`, value: 1 },
                                { label: `Option 3`, value: 2 },
                                { label: `Option 4`, value: 3 },
                            ]}
                            style={[styles.optionInput, styles.dropBox]}
                        />
                    </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
                    <Text style={styles.addButtonText}>+ Add Question</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

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
        // marginTop: "5%",
        // marginBottom: "40%",
        // backgroundColor: "yellow",
    },
    scrollContent: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        // borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#2a2a32',
        color: "#999",

    },
    questionContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: "#999",
        // backgroundColor: 'white',

    },
    questionInput: {
        borderWidth: 1,
        // borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: "#999",
        backgroundColor: '#2a2a32',




    },
    optionInput: {
        borderWidth: 1,
        // borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
        color: "#999",
        backgroundColor: '#2a2a32',

    },
    addButton: {
        backgroundColor: '#49f5c6',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    dropBox: {
        color: "white"
    }
});

export default QuestionForm;
