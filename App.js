import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Weather } from './components/weather';
import { PastFrioDischarge } from './components/past_frio_discharge';
import Discharge from './components/current_discharge';
import DischargeLookup from './components/discharge_lookup';
import * as Linking from 'expo-linking';
import { Text,Header,Overlay,Card } from 'react-native-elements';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoClicked: false
    };
    this.infoClick = this.infoClick.bind(this);
  }

  GITHUB_LINK = 'https://github.com/brandonrush99/frio-river-utility-app';
  ICON_LINK = 'https://www.flaticon.com/';

  infoClick() {
    this.setState(previousState => ({ infoClicked: !previousState.infoClicked }));
  }
  

  render() {
    return (
      
        <ScrollView style={styles.container}>
          <Header
            rightComponent={{ icon: 'info', color: '#fff', onPress: this.infoClick }}
            centerComponent={{ text:'Frio Watch', style: { color: '#fff', fontSize: 25} }}
          />
          {this.state.infoClicked ? 
            <Overlay onBackdropPress={this.infoClick} overlayStyle={styles.overlay} backdropStyle={styles.backdrop}>
              <Card>
                <Text style={styles.infoText}>This app was created by Brandon Rush</Text>
                <Card.Divider/>
                <Text style={styles.githubLink} onPress={() => { Linking.openURL(this.GITHUB_LINK) }}>Click here for the GitHub for this project</Text>
                <Card.Divider/>
                <Text style={styles.infoText}>
                  Icon for app made by Freepik from{" "}
                  <Text style={styles.githubLink} onPress={() => {Linking.openURL(this.ICON_LINK) }}>
                    www.flaticon.com
                  </Text>
                </Text>
              </Card>
              
            </Overlay> :
            null
          }
            <Weather/>
            <View>
              <Discharge/>
              {/*  */}
              <DischargeLookup/>
              <PastFrioDischarge/>
            </View>
        </ScrollView>
    );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cff6ff'
    
  },
  icon: {
    textAlign: 'center'
  },
  listItem: {
    textAlign: 'center',
  },
  image: {
    height:'100%',
    width:'100%'
  },
  header: {
    backgroundColor: '#03a5fc'
  },
  infoText: {
    fontSize: 17,
    textAlign: 'center'
  },
  githubLink: {
    fontSize: 17,
    textAlign: 'center',
    color: '#0398fc',
    textDecorationLine: 'underline'
  },
  backdrop: {
    shadowOpacity: 100
  },
  overlay: {
    width: '90%',
    borderRadius: 15,
},
})