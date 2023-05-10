import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text,ListItem,Button,Overlay } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';


export function PastFrioDischarge(){
  
    const [showHistoricalData, setShowHistoricalData] = useState(false);

    const toggleHistoricalData = () => {
      setShowHistoricalData(!showHistoricalData);
    }
   
    const years = [
        {
          year: '2022',
          discharge: '6'
        },
        {
          year: '2021',
          discharge: '86'
        },
        {
          year: '2020',
          discharge: '27'
        },
        {
          year: '2019',
          discharge: '99'
        },
        {
          year: '2018',
          discharge: '21'
        },
        {
          year: '2017',
          discharge: '70'
        },
        {
          year: '2016',
          discharge: '201'
        },
        {
          year: '2015',
          discharge: '303'
        },
        {
          year: '2014',
          discharge: '48'
        },
        {
          year: '2013',
          discharge: '29'
        },
        {
          year: '2011',
          discharge: '7'
        },
        {
          year: '2010',
          discharge: '49'
        },
        {
          year: '2009',
          discharge: '23'
        },
        {
          year: '2008',
          discharge: '26'
        },
        {
          year: '2007',
          discharge: '195'
        }
      ];
    return(
      <View style={styles.mainView}>
        <Text style={styles.titleText}>Past Wade Family Frio Trip Flowrates</Text>
        <View style={styles.listView}>
              {
                years.map((y,i) => (
                // <ListItem key={i} bottomDivider>
                //     <ListItem.Content>
                //     <ListItem.Title style={styles.listItem}>{y.year} : {y.discharge}</ListItem.Title>
                //     </ListItem.Content>
                // </ListItem>
                <View key={i} style={styles.yearView}>
                  <Text style={styles.dischargeText}>{y.discharge}</Text>
                  <Text style={styles.yearText}>{y.year}</Text>
                </View>
                )
              )}
        </View>
      </View>
    )
    
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column'
  },
  listView: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  yearView: {
    flexDirection: 'column',
    marginVertical: 5,
    alignItems: 'center',
    flexBasis: '20%'
  },
  dischargeText: {
    fontSize: 20,
    color: '#0C2340'
  },
  yearText: {
    color: '#AED6F1'
  },
  titleText: {
    color: '#FDE3A7',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 15
  }

})


