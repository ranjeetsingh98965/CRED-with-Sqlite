import React, {useEffect, useState} from 'react';
import {Modal, View, StyleSheet, Text, TextInput, Button} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const UpdateModal = props => {
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [age, setAge] = useState(undefined);
  const [id, setId] = useState(undefined);

  useEffect(() => {
    setName(props.name);
    setEmail(props.email);
    setAge(props.age);
    setId(props.id);
  }, [props.age, props.email, props.id, props.name]);

  let db = openDatabase({name: 'UserDatabase2.db'});

  const updateUser = () => {
    console.log(name, email, age, id);
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE table_user set user_name=?, user_email=?, user_age=? WHERE user_id=?',
        [name, email, age, id],
      );
    });
    props.setShowUpdateModal(false);
    props.refreshUser();
  };

  return (
    <Modal
      visible={props.showUpdateModal}
      transparent={true}
      animationType="fade">
      <View style={styles.bg}>
        <View style={styles.body}>
          <Text style={styles.text}>UPDATE DETAILS</Text>

          <TextInput
            style={[styles.inputField, {marginTop: 20}]}
            placeholder="Name"
            value={name}
            placeholderTextColor="#898c91"
            onChangeText={text => setName(text)}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Email"
            value={email}
            placeholderTextColor="#898c91"
            onChangeText={text => setEmail(text)}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Age"
            value={String(age)}
            keyboardType="numeric"
            placeholderTextColor="#898c91"
            onChangeText={text => setAge(text)}
          />

          <View style={styles.btn}>
            <Button title="Update" onPress={updateUser} />
          </View>
          <View style={styles.cancelBtn}>
            <Button
              title="Cancel"
              onPress={() => props.setShowUpdateModal(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.6)',
  },
  body: {
    shadowColor: 'dodgerblue',
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 14,
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    marginTop: 10,
    color: 'dodgerblue',
    borderBottomWidth: 3,
    borderColor: 'dodgerblue',
    fontWeight: 'bold',
  },
  inputField: {
    borderWidth: 2,
    marginVertical: 10,
    width: '90%',
    paddingLeft: 10,
    borderColor: 'dodgerblue',
    borderRadius: 10,
    color: 'black',
  },
  btn: {
    width: '60%',
    marginTop: 20,
    marginBottom: 0,
  },
  cancelBtn: {
    width: '60%',
    marginTop: 15,
    marginBottom: 30,
  },
  login: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    fontWeight: 'bold',
    color: 'dodgerblue',
  },
});

export default UpdateModal;
