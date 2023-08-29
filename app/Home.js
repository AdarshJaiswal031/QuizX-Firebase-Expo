import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Home = () => {
    console.log("inside home")
    return (
        <View>
            <Text style={styles.textStyle}>Home</Text>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    textStyle: {
        color: "white"
    }
})