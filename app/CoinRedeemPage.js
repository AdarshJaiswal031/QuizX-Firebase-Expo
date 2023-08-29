import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Firebase from '../firebaseDev/firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
const CoinRedeemPage = () => {
    const [availableCoins, setAvailableCoins] = useState(0);
    const [redeemAmount, setRedeemAmount] = useState('');
    const [hash, setHash] = useState('');

    useEffect(() => {
        checkLocalStorage();
    }, []);
    const checkLocalStorage = async () => {
        const storedHash = await AsyncStorage.getItem('quizKey');
        if (storedHash) {
            setHash(storedHash);
            getCoins(storedHash)

        }

    };
    const getCoins = (hash) => {
        const database = Firebase.database();
        const userRef = database.ref(`users/${hash}`);
        userRef.on(('value'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAvailableCoins(data.coinsEarned)
            }
        })
    }
    const handleRedeemPress = () => {
        const amountToRedeem = parseInt(redeemAmount, 10);

        if (!isNaN(amountToRedeem) && amountToRedeem <= availableCoins) {
            setAvailableCoins(availableCoins - amountToRedeem);
            const database = Firebase.database();
            const userRef = database.ref(`users/${hash}`);
            userRef.once('value').then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    if (data.coinsEarned) {
                        const updatedData = {
                            coinsEarned: data.coinsEarned - amountToRedeem,
                        };
                        userRef.update(updatedData)

                    }
                }
            })

            setRedeemAmount('');
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.heading}>Available</Text>
                <View style={styles.coinContainer}>
                    <Text style={styles.coinsText}>{availableCoins}  </Text>
                    <Text style={styles.coinEmoji}>⍟</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Enter coins to redeem"
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    value={redeemAmount}
                    onChangeText={setRedeemAmount}
                />
                {redeemAmount && parseInt(redeemAmount, 10) > availableCoins && (
                    <Text style={styles.notEnoughText}>Not enough coins</Text>
                )}
                <TouchableOpacity style={styles.redeemButton} onPress={handleRedeemPress}>
                    <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#16161e",
        justifyContent: "center",
        alignContent: "center"
    },
    container: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: '#f0f0f0',
        padding: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        width: "80%",
        marginHorizontal: "10%",

    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'flex-start',
        color: "white"

    },
    coinContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'gray',
        width: "100%"
    },
    coinsText: {
        fontSize: 28,
    },
    coinEmoji: {
        fontSize: 36,
        color: "#49f5c6",
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        width: '100%',
        color: "#49f5c6",

    },
    redeemButton: {
        backgroundColor: 'yellow',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        backgroundColor: "#49f5c6"

    },
    redeemButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    notEnoughText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CoinRedeemPage;
