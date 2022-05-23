import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text,ListItem,Button,Overlay } from 'react-native-elements';


export function PastFrioDischarge(){
  
    const [showHistoricalData, setShowHistoricalData] = useState(false);

    const toggleHistoricalData = () => {
      setShowHistoricalData(!showHistoricalData);
    }
   
    const years = [
        {
          year: '2021',
          discharge: '~86.0'
        },
        {
          year: '2020',
          discharge: '~27.4'
        },
        {
          year: '2019',
          discharge: '~100.2'
        },
        {
          year: '2018',
          discharge: '~21.4'
        },
        {
          year: '2017',
          discharge: '~70.0'
        },
        {
          year: '2016',
          discharge: '~201.3'
        },
        {
          year: '2015',
          discharge: '~303.2'
        }
      ];
    return(
        <View>
          <Text>{"\n"}</Text>
          <Button                
            title='Quick Wade Family Historical Frio Rates'       
            onPress={toggleHistoricalData} 
            buttonStyle={styles.button}
            ></Button>
          {showHistoricalData == false ? null : (
            <Overlay backdropStyle={styles.backdrop} overlayStyle={styles.overlay} onBackdropPress={toggleHistoricalData}>
              {
                years.map((y,i) => (
                <ListItem key={i} bottomDivider>
                    <ListItem.Content>
                    <ListItem.Title style={styles.listItem}>{y.year} : {y.discharge}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                )
              )}
            </Overlay>
          )}
          
        </View>
    )
    
}

const styles = StyleSheet.create({
  button: {
    width: '75%',
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: 'black',
  },
  overlay: {
    width: '90%',
    borderRadius: 15,
  },
  backdrop: {
      //backgroundColor: 'black',
      shadowOpacity: 100
  },
  listItem: {
    alignSelf: 'center',
    fontSize: 20
  }

})


