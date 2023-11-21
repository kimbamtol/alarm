import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function startsWithEnglish(inputString) {
    const regex = /^[a-zA-Z]/; // 영어 알파벳 대소문자로 시작하는지 확인
    return regex.test(inputString);
}

async function formSubmit(theUserName, thePassword) {
    if (!startsWithEnglish(theUserName)) {
        Alert.alert("아이디는 영어로 시작해야됩니다.", "다시 입력해주세요");
        return;
    }
    try {
        const value = await AsyncStorage.getItem(theUserName);
        if (value == null) {
            try {
                await AsyncStorage.setItem(theUserName, thePassword);
            } catch (e) {
                console.log(e);
            }

            Alert.alert("회원가입 완료!");
        }
        else {
            Alert.alert("이미 존재하는 아이디입니다.", "다른 아이디를 써보세요.");
            return;
        }
    } catch (error) {
        console.error('Error checking AsyncStorage:', error);
        return false; // 오류가 발생하면 false를 반환
    }
}
function SignScreen() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return (
        <ImageBackground source={require('../assets/images/background1.jpg')} style={{ flex: 1, width: '100%', height: '100%' }}>
            <View style={styles.inputs}>
                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 50 }}>What To Do!</Text>
            </View>
            <View style={styles.inputs}>
                <TextInput style={styles.input} value={userName} onChangeText={(text) => setUserName(text)} placeholder="Your Id" />
                <TextInput style={styles.input} value={password} onChangeText={(text) => setPassword(text)} placeholder="Your Password" />
                <TouchableOpacity
                    style={{ borderWidth: 3, borderColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 30, marginTop: 30, width: '80%' }} onPress={() => formSubmit(userName, password)}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff' }}>Sign</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
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
export default SignScreen;

