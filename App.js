import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import DetailsModal from './modals/DetailsModal';
import {openDatabase} from 'react-native-sqlite-storage';
import UpdateModal from './modals/UpdateModal';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userList, setUserList] = useState([]);

  let db = openDatabase({name: 'UserDatabase2.db'});

  useEffect(() => {
    refreshUser();
    console.log(userList);
  }, []);

  const refreshUser = () => {
    db.transaction(txn => {
      txn.executeSql('SELECT * From table_user', [], (txn, res) => {
        let temp = [];
        for (var i = 0; i < res.rows.length; ++i) {
          temp.push(res.rows.item(i));
        }
        setUserList(temp);
      });
    });
  };

  const deleteUser = id => {
    db.transaction(txn => {
      txn.executeSql('DELETE FROM table_user WHERE user_id=?', [id]);
    });
    refreshUser();
  };

  var name, email, age, id;

  function selectedUser(name, email, age, id) {
    global.name = name;
    global.email = email;
    global.age = age;
    global.id = id;
    // console.log(
    //   'selected user',
    //   global.name,
    //   ' ',
    //   global.email,
    //   ' ',
    //   global.age,
    //   ' ',
    //   global.id,
    // );
  }

  return (
    <View style={styles.container}>
      <DetailsModal
        showModal={showModal}
        setShowModal={setShowModal}
        refreshUser={refreshUser}
      />

      <UpdateModal
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        refreshUser={refreshUser}
        name={global.name}
        email={global.email}
        age={global.age}
        id={global.id}
      />
      <View style={styles.title}>
        <Text style={{fontSize: 25, color: '#fff', padding: 5}}>
          USERS DETAILS
        </Text>
      </View>

      {userList.length ? (
        <FlatList
          data={userList}
          renderItem={({item, index}) => {
            return (
              <ScrollView>
                <View>
                  <View style={styles.infoBody}>
                    <View style={{flex: 1, paddingLeft: 10}}>
                      <Text style={{color: 'black'}}>
                        {'Name: ' + item.user_name}
                      </Text>
                      <Text style={{color: 'black'}}>
                        {'Email: ' + item.user_email}
                      </Text>
                      <Text style={{color: 'black'}}>
                        {'Age: ' + item.user_age}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                      }}>
                      <Pressable
                        onPress={() => {
                          setShowUpdateModal(true);
                          let data = {
                            name: item.user_name,
                            email: item.user_email,
                            age: item.user_age,
                            id: item.user_id,
                          };
                          selectedUser(
                            item.user_name,
                            item.user_email,
                            item.user_age,
                            item.user_id,
                          );
                        }}>
                        <Image
                          source={require('./icons/edit.png')}
                          style={{width: 50, height: 50, marginRight: 10}}
                        />
                      </Pressable>
                      <Pressable onPress={() => deleteUser(item.user_id)}>
                        <Image
                          source={require('./icons/delete.png')}
                          style={{width: 50, height: 50, marginRight: 10}}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </ScrollView>
            );
          }}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 25, color: 'dodgerblue', marginBottom: 25}}>
            DATA NOT FOUND!
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.addUser}
        onPress={() => setShowModal(true)}>
        <Text style={{textAlign: 'center', color: '#fff', fontSize: 20}}>
          ADD USER
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    padding: 4,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 10,
  },
  addUser: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    margin: 8,
    borderRadius: 15,
    elevation: 10,
    width: '50%',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  infoBody: {
    paddingVertical: 10,
    paddingLeft: 10,
    borderRadius: 15,
    marginHorizontal: 7,
    marginVertical: 5,
    elevation: 4,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});

export default App;
