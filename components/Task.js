import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';  // Added Alert
import Header from './Header';
import Body from './Body';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import Clipboard from '@react-native-clipboard/clipboard';
import messaging from '@react-native-firebase/messaging';

const Task = () => {
  const [todos, setTodos] = useState([]);
  const [currentip, setCurrentip] = useState('');
  const [wifiIp, setWifiIp] = useState('');

  const firestore = getFirestore();
  const todosCollection = collection(firestore, 'todos');

  const getTodos = async () => {
    try {
      const querySnapshot = await getDocs(todosCollection);
      const todosData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTodos(todosData);
    } catch (e) {
      console.error('할 일을 가져오는 중 오류 발생:', e);
    }
  };

  useEffect(() => {
    getTodos();

    const handleFCMMessage = async (remoteMessage) => {
      console.log('FCM Message:', remoteMessage);

      const wifiIP = remoteMessage.data && remoteMessage.data.wifiIP;
      const matchingTodos = todos.filter((todo) => todo.ip === wifiIP);

      if (matchingTodos.length > 0) {
        Alert.alert('Wi-Fi IP Match', 'Wi-Fi IP와 일치하는 할 일이 있습니다.');
      }
    };

    const unsubscribeOnMessage = messaging().onMessage(handleFCMMessage);

    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('Connected to Wi-Fi:', state.details);
        const newWifiIP = state.details && state.details.ipAddress;

        if (newWifiIP !== wifiIp) {
          console.log('Wi-Fi IP Changed:', newWifiIP);

          try {
            const fcmToken = await messaging().getToken();
            await messaging().sendMessage({
              to: fcmToken,
              data: {
                wifiIP: newWifiIP,
              },
            });
          } catch (error) {
            console.error('FCM Message Sending Error:', error);
          }

          setWifiIp(newWifiIP);
        }
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeNetInfo();
    };
  }, [todos, wifiIp]);

  const handleCheckWifiIp = async () => {
    try {
      await Clipboard.setString(wifiIp);
      console.log('Wi-Fi IP Copied:', wifiIp);
    } catch (e) {
      console.error('Wi-Fi IP 복사 중 오류 발생:', e);
    }
  };

  const addTodo = async (todoText) => {
    try {
      const newTodo = {
        text: todoText,
        ip: currentip,
        completed: false,
      };

      const docRef = await addDoc(todosCollection, newTodo);
      setTodos((prevTodos) => [{ ...newTodo, id: docRef.id }, ...prevTodos]);
    } catch (e) {
      console.error('할 일 추가 중 오류 발생:', e);
    }
  };

  const checkTodo = async (id) => {
    try {
      const todoRef = doc(todosCollection, id);
      await updateDoc(todoRef, { completed: true });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
      );
    } catch (e) {
      console.error('할 일 업데이트 중 오류 발생:', e);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todoRef = doc(todosCollection, id);
      await deleteDoc(todoRef);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (e) {
      console.error('할 일 삭제 중 오류 발생:', e);
    }
  };

  const saveip = async (todoId, newip) => {
    try {
      const todoRef = doc(todosCollection, todoId);
      await updateDoc(todoRef, { ip: newip });
      setCurrentip(newip);
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? { ...todo, ip: newip } : todo))
      );
    } catch (e) {
      console.error('IP 업데이트 중 오류 발생:', e);
    }
  };

  const handlePrint = () => {
    console.log(todos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <Header addTodo={addTodo} />
      <Body
        todos={todos}
        checkTodo={checkTodo}
        deleteTodo={deleteTodo}
        saveip={saveip}
        addTodo={addTodo}
      />

      <TouchableOpacity onPress={handlePrint} style={styles.printButton}>
        <Text style={styles.printButtonText}>Print</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCheckWifiIp} style={styles.checkWifiIpButton}>
        <Text style={styles.checkWifiIpButtonText}>Check WIFI-IP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50,
    backgroundColor: '#EEE',
  },
  title: {
    fontWeight: '800',
    fontSize: 30,
    marginLeft: 20,
    marginBottom: 20,
  },
  printButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  printButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkWifiIpButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  checkWifiIpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Task;
