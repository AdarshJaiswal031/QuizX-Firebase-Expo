import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native'
import { React, useState, useEffect } from 'react'
import Firebase from '../firebaseDev/firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedCircle from './AnimatedCircle';

export default function Quiz() {
    const [quizData, setquizData] = useState([])
    const [selectedOption, setSelectedOption] = useState({});
    const [scoreAnim, setscoreAnim] = useState(false);
    const [score, setscore] = useState(0);
    const [dataKey, setdataKey] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = quizData[currentQuestionIndex];
    const [quizzesAttended, setQuizzesAttended] = useState(15);
    const [isPremiumMember, setIsPremiumMember] = useState(true);
    const [hash, setHash] = useState('');
    const [coinsEarned, setCoinsEarned] = useState(0);


    const handleOptionPress = (option) => {

        let newScore = score;
        // console.log(selectedOption[currentQuestionIndex])
        // const selectVar = { ...selectedOption }
        // selectVar[currentQuestionIndex] = option
        // setSelectedOption(selectVar);
        console.log(!selectedOption[currentQuestionIndex])
        if (!selectedOption[currentQuestionIndex] && option == currentQuestion.answer) {
            newScore = score + 1;
            setscore(newScore)
            console.log(1, "#####", newScore)
        }
        else {
            if ((selectedOption[currentQuestionIndex] != currentQuestion.answer) && option == currentQuestion.answer) {
                newScore = score + 1;
                setscore(newScore)
                console.log(2, "#####", newScore)

            }
            else if ((selectedOption[currentQuestionIndex] == currentQuestion.answer) && option != currentQuestion.answer) {
                newScore = score - 1;
                setscore(newScore)
                console.log(3, "#####", newScore)

            }

        }
        setSelectedOption((prevOptions) => ({
            ...prevOptions,
            [currentQuestionIndex]: option,
        }));
        // setSelectedOption(selectVar);
    };

    useEffect(() => {
        getData();
        checkLocalStorage();
    }, []);
    const checkLocalStorage = async () => {
        const storedHash = await AsyncStorage.getItem('quizKey');
        if (storedHash) {
            setHash(storedHash);
            getData(storedHash)

        }

    };
    const getData = async () => {
        const dataKey = await AsyncStorage.getItem('dataKey');
        setdataKey(dataKey)
        if (dataKey) {
            const database = Firebase.database();

            const liveQuizes = database.ref(`dataQuizes/${dataKey}/allQuestions`);
            liveQuizes.once('value').then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const quizesArray = Object.values(data);
                    setquizData(quizesArray);
                    console.log(quizesArray)
                }
            });
        }
    }
    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            // setSelectedOption(null);
        }
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            // setSelectedOption(null);
        }
    };
    const handleSubmit = () => {
        setscoreAnim(true)
        const database = Firebase.database();
        const userRef = database.ref(`users/${hash}`);
        userRef.once('value').then((snapshot) => {
            const data = snapshot.val();
            if (data) {

                if (data.quizzesAttended) {
                    const quizzesAttendedArray = Object.values(data.quizzesAttended);
                    if (!quizzesAttendedArray.includes(dataKey)) {
                        const updatedData = {
                            quizzesAttended: [...quizzesAttendedArray, dataKey]
                        };
                        userRef.update(updatedData)
                        if (data.coinsEarned) {
                            const updatedData = {
                                coinsEarned: data.coinsEarned + score,
                            };
                            setCoinsEarned(score)
                            userRef.update(updatedData)

                        }
                        else {
                            const updatedData = {
                                coinsEarned: score,
                            };
                            setCoinsEarned(score)

                            userRef.update(updatedData)
                        }
                    }
                    else {
                        setCoinsEarned(0)

                    }
                }
                else {
                    const updatedData = {
                        quizzesAttended: [dataKey]
                    };
                    userRef.update(updatedData)
                    if (data.coinsEarned) {
                        const updatedData = {
                            coinsEarned: data.coinsEarned + score,
                        };
                        setCoinsEarned(score)

                        userRef.update(updatedData)

                    }
                    else {
                        const updatedData = {
                            coinsEarned: score,
                        };
                        setCoinsEarned(score)

                        userRef.update(updatedData)
                    }
                }

            }
        })

    }
    return (
        <View style={styles.mainContainer}>
            {
                currentQuestion && !scoreAnim ?
                    (
                        <View style={styles.container}>
                            <Text style={styles.textStyle}>{currentQuestion.question} </Text>
                            <View style={styles.containerOpt}>
                                {currentQuestion.options.map((option, index) => (
                                    <TouchableOpacity
                                        key={`${option}${index}`}
                                        style={[
                                            styles.optionContainer,
                                            selectedOption[currentQuestionIndex] === `${index}` && styles.selectedOption,
                                        ]}
                                        onPress={() => handleOptionPress(`${index}`)}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                                <Text>Selected Option: {selectedOption[currentQuestionIndex]}</Text>
                            </View>
                            <View style={[styles.navigationContainer]}>
                                <TouchableOpacity
                                    style={[styles.navigationButton, { opacity: currentQuestionIndex === 0 ? 0.5 : 1 }]}
                                    onPress={goToPreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    <Text style={styles.arrow}>⇜</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.navigationButton, { opacity: currentQuestionIndex === quizData.length - 1 ? 0.5 : 1 }]}
                                    onPress={goToNextQuestion}
                                    disabled={currentQuestionIndex === quizData.length - 1}
                                >
                                    <Text style={styles.arrow}>⇝</Text>
                                </TouchableOpacity>
                            </View>
                            {currentQuestionIndex === quizData.length - 1 && (
                                <View style={[styles.submitBtn]}>
                                    <TouchableOpacity onPress={handleSubmit}>
                                        <Text>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles.container}>
                            <AnimatedCircle progress={score / quizData.length} />
                            <Text style={[styles.textStyle, styles.scoreText]}>Your Score : {`${score}/${quizData.length}`} </Text>
                            <View style={styles.detailsContainer}>
                                <View style={styles.separator} />
                                <Text style={styles.heading}>Correct Answers</Text>

                                <View style={styles.separator} />
                                <View><View style={styles.detailItem}>
                                    <Text style={styles.label}>Coins Earned :</Text>
                                    <Text style={styles.amount}>{coinsEarned}</Text>
                                </View>
                                    <View style={styles.separator} /></View>
                                <ScrollView style={styles.scrollScore}>
                                    {quizData.map((item, index) => {
                                        return (<View><View style={styles.detailItem}>
                                            <Text style={styles.label}>Question {index} :</Text>
                                            <Text style={styles.amount}>{item.answer + 1} {selectedOption[index] ? (selectedOption[index] == item.answer ? " ✔" : "  ✘") : "❔"}</Text>
                                        </View>
                                            <View style={styles.separator} /></View>)
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    )
            }</View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#16161e",

        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        // flex: 1,
        backgroundColor: "#16161e",
        width: "85%",
        height: "70%",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        // position: "relative",
        // top: 20,
        // marginBottom: -20,

    },
    containerOpt: {
        backgroundColor: "#16161e",
        width: "85%",
        height: "70%",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        color: "white",


    },
    textStyle: {
        color: "#00643f",
        fontSize: 15,
        textAlign: "center",
        backgroundColor: "#49f5c6",
        width: "85%",
        lineHeight: 20,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontWeight: "bold",
        // marginTop: 40,



    },
    optionContainer: {
        width: "100%",
        height: 50,
        backgroundColor: '#2a2a32',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginVertical: 10,
        borderRadius: 8,
        // marginTop: -30,
    },
    optionText: {
        fontSize: 16,
        color: "#676768",
        marginLeft: 20,

    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: "flex-start",
        marginTop: -30,
        // backgroundColor: "red",
        width: "85%",
        // width: "100%",
        height: 50,
        backgroundColor: '#49f5c6',
        borderRadius: 8,
    },
    navigationButton: {
        paddingHorizontal: 20,
        // paddingVertical: 10,
        // backgroundColor: '#e0e0e0',
        // flex: 1,
        borderRadius: 8,
        color: "white",
        position: "relative",
        bottom: 10,
    },
    arrow: {
        color: "#00643f",
        fontSize: 40
    },
    selectedOption: {
        backgroundColor: 'white',
    },
    submitBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "white",
        width: "85%",
        // width: "100%",
        height: 50,
        // backgroundColor: '#49f5c6',
        borderRadius: 8,
        marginTop: 15
    },
    scoreText: {
        marginTop: 40
    },
    detailsContainer: {
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "white"
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 10,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        color: "white"

    },
    label: {
        flex: 1,
        color: "white"
    },
    amount: {
        flex: 1,
        textAlign: 'right',
        color: "white"
    },
    scrollScore: {
        // backgroundColor: "red",
        height: "30%"
    }
})
