import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Share, TextInput } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import Firebase from '../firebaseDev/firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
const ProfilePage = () => {
    const [displayName, setDisplayName] = useState('John Doe');
    const [profileImage, setProfileImage] = useState('http://surl.li/khjuh');
    const [quizzesAttended, setQuizzesAttended] = useState(0);
    const [coinsEarned, setCoinsEarned] = useState(0);
    const [isPremiumMember, setIsPremiumMember] = useState(false);
    const [hash, setHash] = useState('');
    const [editing, setEditing] = useState(false);
    useEffect(() => {
        checkLocalStorage();
    }, []);
    const checkLocalStorage = async () => {
        const storedHash = await AsyncStorage.getItem('quizKey');
        if (storedHash) {
            setHash(storedHash);
            getData(storedHash)

        }

    };
    const getData = (hash) => {
        const database = Firebase.database();
        const userRef = database.ref(`users/${hash}`);
        userRef.on(('value'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.profileImage) {

                    setProfileImage(data.profileImage)
                }
                if (data.displayName) {

                    setDisplayName(data.displayName)
                }
                setIsPremiumMember(data.isPremiumMember)
                setQuizzesAttended(Object.values(data.quizzesAttended).length)
                setCoinsEarned(data.coinsEarned)
            }
        });
    }
    const handleShareApp = async () => {
        Share.share({
            message: "Coding sprint",
        })
            //after successful share return result
            .then((result) => console.log(result))
            //If any thing goes wrong it comes here
            .catch((errorMsg) => console.log(errorMsg));
    };
    const handleChangeProfileImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.cancelled) {
                setProfileImage(result.uri)
                const database = Firebase.database();
                const dataQuizes = database.ref(`users/${hash}`);
                const storageRef = Firebase.storage().ref();
                const imageRef = storageRef.child('profileImages/' + result.uri.split('/').pop());
                const response = await fetch(result.uri);
                const blob = await response.blob();
                await imageRef.put(blob);
                const imageUrl = await imageRef.getDownloadURL();
                console.log(imageUrl)

                const updatedData = {
                    profileImage: imageUrl,
                };

                dataQuizes.update(updatedData)
            }
        } catch (error) {
            console.error('Error changing profile image:', error);
        }
    };
    const handleTextPress = () => {
        setEditing(true);
    };

    const handleInputBlur = () => {
        setEditing(false);
    };

    const handleInputChange = (newText) => {
        setDisplayName(newText);
        const database = Firebase.database();
        const dataQuizes = database.ref(`users/${hash}`);
        const updatedData = {
            displayName: newText,
        };

        dataQuizes.update(updatedData)
    };
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={handleChangeProfileImage} style={styles.profileImageContainer}>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                </TouchableOpacity>
                {editing ? (<TextInput
                    value={displayName}
                    onChangeText={handleInputChange}
                    onBlur={handleInputBlur}
                    autoFocus
                />) : (<View>
                    <TouchableOpacity onPress={handleTextPress} >
                        <Text style={styles.displayName}>{displayName}</Text>
                    </TouchableOpacity>
                </View>)
                }
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.heading}>Profile Details</Text>
                <View style={styles.separator} />
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Quizzes Attended:</Text>
                    <Text style={styles.amount}>{quizzesAttended}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Coins Earned:</Text>
                    <Text style={styles.amount}>{coinsEarned}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Premium Member:</Text>
                    <Text style={styles.amount}>{isPremiumMember ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.separator} />
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareApp}>
                <Text style={styles.shareButtonText}>Share App</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
    },
    profileImageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        marginBottom: 10,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    displayName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
    },
    label: {
        flex: 1,
    },
    amount: {
        flex: 1,
        textAlign: 'right',
    },
    shareButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
    },
    shareButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProfilePage;
