import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { Weather } from './components/weather';
import { PastFrioDischarge } from './components/past_frio_discharge';
import Discharge from './components/current_discharge';
import DischargeLookup from './components/discharge_lookup';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-elements';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  
  

  render() {
    const Tab = createBottomTabNavigator();
    const myTheme = {
      dark: true,
      colors: {
        primary: 'rgb(255, 45, 85)',
        background: '#03a5fc',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
      }
    };
    return (
      <SafeAreaView style={styles.container} >
        <ScrollView>
          <Text h3 style={styles.header}>Welcome to Frio Watch</Text>
            <Weather/>
            <View>
              <Discharge/>
              {/*  */}
              <DischargeLookup/>
              <PastFrioDischarge/>
            </View>
        </ScrollView>
      </SafeAreaView>
      
    //   <NavigationContainer theme={myTheme}>
    //     <Tab.Navigator
    //       screenOptions={({ route }) => ({
    //         tabBarIcon: ({ focused, color, size }) => {
    //           let iconName;

    //           if (route.name === 'Home') {
    //             iconName = 'home';
    //           } else if (route.name === 'Weather') {
    //             iconName = 'weather-cloudy';
    //           }

    //           // You can return any component that you like here!
    //           return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    //         },
    //       })}
    //       tabBarOptions={{
    //         activeTintColor: 'tomato',
    //         inactiveTintColor: 'gray',
    //       }}
    //     >
    //       <Tab.Screen name="Home" component={Discharge} />
    //       <Tab.Screen name="Weather" component={Weather} />
    //     </Tab.Navigator>
    // </NavigationContainer>
    );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  header: {
    textAlign: 'center',
    marginTop: 40,
  }
    
})