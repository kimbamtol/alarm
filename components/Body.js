import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

class Body extends Component {
  state = {
    modalVisible: false,
    newip: '', // 추가
    currentTodoId: null, // 현재 선택된 할 일의 ID
  };

  setModalVisible = (visible, currentip = '', currentTodoId = null) => {
    this.setState({ modalVisible: visible, newip: currentip, currentTodoId });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.todos.map((data) => (
          <View style={styles.todo} key={data.id}>
            <View style={styles.todoText}>
              <TouchableOpacity
                style={styles.todoCheckbox}
                onPressOut={() => this.props.checkTodo(data.id)}
              >
                {data.completed ? (
                  <MaterialCommunityIcons size={20} name="checkbox-marked-circle-outline" />
                ) : (
                  <MaterialCommunityIcons size={20} name="checkbox-blank-circle-outline" />
                )}
              </TouchableOpacity>
              <Text style={data.completed ? styles.todoCompleted : null}>{data.text}</Text>
            </View>
            <View style={styles.todoButtons}>
              <TouchableOpacity onPressOut={() => this.props.deleteTodo(data.id)}>
                <MaterialCommunityIcons style={styles.todoDelBtn} size={30} name="delete-outline" />
              </TouchableOpacity>
              <TouchableOpacity onPressOut={() => this.setModalVisible(true, data.ip, data.id)}>
                <Ionicons style={styles.todoAddBtn} size={30} name="md-wifi-outline" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Enter ip:</Text>
              <TextInput
                style={styles.input}
                placeholder="ip"
                onChangeText={(newip) => this.setState({ newip })}
                value={this.state.newip}
              />
              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  this.props.saveip(this.state.currentTodoId, this.state.newip); // 현재 선택된 할 일 항목의 ip 업데이트
                }}
              >
                <Text style={styles.textStyle}>Save ip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  todo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  todoCheckbox: {
    marginRight: 5,
  },
  todoText: {
    flexDirection: 'row',
  },
  todoDelBtn: {
    color: '#777',
    marginRight: 10,
  },
  todoAddBtn: {
    color: '#4169E1',
  },
  todoButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoCompleted: {
    color: '#bbb',
    textDecorationLine: 'line-through',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Body;
