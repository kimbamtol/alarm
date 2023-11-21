import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function formCheck(theUserName, thePassword, navigation) {
    try {
        const value = await AsyncStorage.getItem(theUserName);
        if (value == null) {
            Alert.alert("아이디나 비밀번호가 틀렸습니다.");

            console.log(thePassword);
        }
        else if (value === thePassword) {
            Alert.alert("로그인 완료!");
            navigation.navigate('Main', { currentUser: '__' + theUserName, });
        }
        else {
            Alert.alert("아이디나 비밀번호가 틀렸습니다!");
        }


    } catch (error) {
        console.error('Error checking AsyncStorage:', error);
    }
}
export default function LogIn({ navigation }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return (
        <ImageBackground source={require('../assets/images/background1.jpg')} style={{ flex: 1, width: '100%', height: '100%' }}>
            <View style={styles.titles}>
                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 50 }}>What To Do!</Text>
            </View>
            <View style={styles.inputs}>
                <TextInput style={styles.input} value={userName} onChangeText={(text) => setUserName(text)} placeholder="Your Id" />
                <TextInput style={styles.input} value={password} onChangeText={(text) => setPassword(text)} placeholder="Your Password" />
                <TouchableOpacity
                    style={{ borderWidth: 3, borderColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 30, width: '80%' }}
                    onPress={() => formCheck(userName, password, navigation)}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff' }}>LogIn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Sign')}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#0080ff' }}> 회원가입 </Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    titles: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
    },

    inputs: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        paddingBottom: 8,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
        opacity: 0.2,
        width: '80%',

    },
});
