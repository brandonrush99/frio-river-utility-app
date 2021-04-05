import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Weather } from './components/weather';
import { PastFrioDischarge } from './components/past_frio_discharge';
import Discharge from './components/current_discharge';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
            <Discharge/>
            <View>
              <Weather/>
              <PastFrioDischarge/>
            </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#03a5fc'
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
  }
    
})