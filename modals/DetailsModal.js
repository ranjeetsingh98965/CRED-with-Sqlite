import React, {useEffect, useState} from 'react';
import {Modal, View, StyleSheet, Text, TextInput, Button} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const DetailsModal = props => {
  const [name, setName] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [age, setAge] = useState(undefined);

  let db = openDatabase({name: 'UserDatabase2.db'});

  useEffect(() => {
    createTable();
  }, []);

  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (txn, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(50), user_email VARCHAR(10), user_age INT(20))',
              [],
            );
          } else {
            console.log('Already Created table!');
          }
        },
      );
    });
  };

  const saveData = () => {
    // console.warn(name, email, age);
    if (!name) {
      alert('Please enter your Name');
      return;
    }
    if (!email) {
      alert('Please enter your Name');
      return;
    }
    if (!age) {
      alert('Please enter your Name');
      return;
    }
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO table_user(user_name, user_email, user_age) VALUES (?,?,?)',
        [name, email, age],
        (txn, res) => {
          console.log(res);
        },
        error => {
          console.log(error);
        },
      );
    });
    props.refreshUser();
    props.setShowModal(false);
  };
  return (
    <Modal visible={props.showModal} transparent={true} animationType="fade">
      <View style={styles.bg}>
        <View style={styles.body}>
          <Text style={styles.text}>ADD DETAILS</Text>

          <TextInput
            style={[styles.inputField, {marginTop: 20}]}
            placeholder="Name"
            placeholderTextColor="#898c91"
            onChangeText={text => setName(text)}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Email"
            placeholderTextColor="#898c91"
            onChangeText={text => setEmail(text)}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Age"
            keyboardType="numeric"
            placeholderTextColor="#898c91"
            onChangeText={text => setAge(text)}
          />

          <View style={styles.btn}>
            <Button title="Save" onPress={saveData} />
          </View>
          <View style={styles.cancelBtn}>
            <Button title="Cancel" onPress={() => props.setShowModal(false)} />
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

export default DetailsModal;
