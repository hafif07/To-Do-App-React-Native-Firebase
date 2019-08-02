// import React from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, TextInput, StatusBar } from 'react-native';
// import * as firebase from 'firebase'
// import { Button, Icon } from 'native-base'


// const firebaseConfig = {
//   apiKey: "AIzaSyCCJ6UMdSEnBij1RxRL9QLMoTKns8DmeT0",
//   authDomain: "to-do-app-2257f.firebaseapp.com",
//   databaseURL: "https://to-do-app-2257f.firebaseio.com",
//   projectId: "to-do-app-2257f",
//   storageBucket: "",
//   messagingSenderId: "874962099812",
// };

// firebase.initializeApp(firebaseConfig)

// class App extends React.Component {
//   state = {
//     text: '',
//     list: []
//   }
//   add = (nama) => {
//     firebase.database().ref('Users/').once('value', function (snapshot) {
//         console.log(snapshot.val())
//     });
//     this.setState({text:firebase.database().ref('Users/-LlGFnrF5Jce6VzZ0nng').once('value', function (snapshot) {
//       console.log(snapshot.val())
//   })})
//   }
//   render() {
//     let item = this.state.list.map((val, key) => {
//       return (
//         <View key={key}>
//           <Text>{val}</Text>
//         </View>
//       )
//     })
//     return (
//       <View style={{ flex: 1 }}>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', height: 50, marginTop: StatusBar.currentHeight, alignItems: 'center' }}>
//           <View style={{ height: 50, width: '80%', backgroundColor: 'white', justifyContent: 'center', borderWidth: 1 }}>
//             <TextInput
//               value={this.state.text}
//               maxLength={50}
//               multiline={true}
//               placeholder='Tulis'
//               style={{ fontSize: 20 }}
//               onChangeText={(text) => this.setState({ text: text })} />
//           </View>
//           <Button onPress={() => this.add(this.state.text)}>
//             <Icon name='add' />
//           </Button>
//         </View>
//         <Text>{this.state.text.nama}</Text>
//       </View>
//     )
//   }
// }

// export default App



import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  TextInput,
  Button,
  Alert,
  ToolbarAndroid
} from 'react-native';
import * as firebase from 'firebase'


const config = {
  apiKey: "AIzaSyCCJ6UMdSEnBij1RxRL9QLMoTKns8DmeT0",
  authDomain: "to-do-app-2257f.firebaseapp.com",
  databaseURL: "https://to-do-app-2257f.firebaseio.com",
  projectId: "to-do-app-2257f",
  storageBucket: "",
  messagingSenderId: "874962099812",
};

firebase.initializeApp(config)

export default class todo extends Component {

  constructor() {
    super()

    

    const database = firebase.database()

    this.dbRef = database.ref('react-todo')

    this.state = {
      item: {},
      items: [],
      itemDatasource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 != row2 })
    }

  }

  componentDidMount() {
    // Firebase Listener
    this.dbRef.on('child_added', (data) => {
      this.state.items.push({ id: data.key, title: data.val() })
      this.setState({
        itemDatasource: this.state.itemDatasource.cloneWithRows(this.state.items)
      })
    })

    this.dbRef.on('child_removed', (data) => {
      console.log(`child_removed ${data.key} : ${data.val()}`)

      let items = this.state.items.filter((item) => item.id != data.key)

      this.setState({
        itemDatasource: this.state.itemDatasource.cloneWithRows(items)
      })

      this.setState({
        items: items
      })
    })


  }

  renderRow(row) {

    return (
      <TouchableHighlight
        style={styles.itemRow}
        underlayColor="#000000">

        <View style={{ flexDirection: 'row' }}>

          <Text style={styles.itemText}>{row.title}</Text>

          <TouchableHighlight onPress={() => this.removeItem(row)} style={styles.itemDelete} underlayColor="#000000">
            <Text style={{ fontSize: 20 }}>X</Text>
          </TouchableHighlight>

        </View>
      </TouchableHighlight>
    )
  }

  addItem() {

    // Validate Form
    if (this.state.item == '' || this.state.item.title == '') {
      Alert.alert('Kosong?', 'Data Tidak boleh kosong :(')
      return
    }

    this.dbRef.push(this.state.item.title)

    // Reset item state
    this.setState({ item: '' })
  }

  removeItem(item) {
    console.log('Delete')
    console.log(item)
    this.dbRef.child(item.id).remove()
  }

  render() {
    return (

      <View>
        <ToolbarAndroid title="React Native Catatan" titleColor="#fff" style={{ height: 58, backgroundColor: '#2DB6A3' }} />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Masukkan teks"
            onChangeText={(text) => this.setState({ item: { title: text } })}
            value={this.state.item.title}
            style={styles.inputText}
          />

          <View style={{ flex: 2, justifyContent: 'center' }}>
            <Button
              onPress={this.addItem.bind(this)}
              title="Tambahkan" />
          </View>

        </View>

        <ListView
          style={styles.listView}
          dataSource={this.state.itemDatasource}
          renderRow={this.renderRow.bind(this)} />

      </View>
    );
  }
}

const styles = StyleSheet.create({

  rowItem: {
    backgroundColor: '#f3f3f3',
    padding: 10
  },

  inputContainer: {
    padding: 5,
    marginTop: 10,
    flexDirection: 'row'
  },

  inputText: {
    marginRight: 4,
    borderRadius: 4,
    borderColor: '#2DB6A3',
    flex: 4,
    fontSize: 18,

  },

  inputButton: {
    backgroundColor: '#22C7A9',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    borderRadius: 4,
    height: 45
  },

  buttonText: {
    fontSize: 20,
    color: '#ffffff'
  },

  listView: {
    margin: 4
  },

  itemRow: {
    marginBottom: 2,
    padding: 8,
    backgroundColor: '#FEF3CC'
  },

  itemText: {
    flex: 6,
    fontSize: 20,
    padding: 4
  },

  itemDelete: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 50,
    padding: 3,
    flex: 1
  }
});


