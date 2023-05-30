import React, { useState, useEffect } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card} from 'react-native-elements';
import { format } from 'date-fns';
import { getStats } from '../services/api_helper';

export function HistoricDischargeService(props){

    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    
    useEffect(() => {
        let cancel = false;
        let startDate = format(props.startDate, 'yyyy-MM-dd');
        let endDate = format(props.endDate, 'yyyy-MM-dd');
        getStats(startDate, endDate)
        .then((response) => {
          if (cancel) return;
          setData(response.data);
          
        })
        .catch((error) => {
          console.error(error);
          if (cancel) return;
          setError(true);
        });
        return () => {
          cancel = true;
        }
      
    }, [data])

  
    let maximum = -1;
    let minimum = 100000000;
    let meanValue = 0;
    if (data.length !== 0 && error === false) {
      let maxValues = data.value.timeSeries[3].values[0].value;
      let minValues = data.value.timeSeries[4].values[0].value;
      let meanValues = data.value.timeSeries[5].values[0].value;
      for(let i = 0; i < maxValues.length; i++){
        if(parseFloat(maxValues[i].value,10) > maximum){
          maximum = parseFloat(maxValues[i].value,10);
        }
      }
      for(let i = 0; i < minValues.length; i++){
        if(parseFloat(minValues[i].value,10) < minimum){
          minimum = parseFloat(minValues[i].value,10);
        }
      }
      for(let i = 0; i < meanValues.length; i++){
        meanValue += parseFloat(meanValues[i].value,10);
      }
      meanValue /= meanValues.length;
      meanValue = Math.round(meanValue);
    }

    return(
        <View style={styles.container}>
          <Card containerStyle={styles.card}>
            {minimum === 100000000 && maximum === -1 ? <ActivityIndicator/> :
              <View style={styles.statsView}>
                <View style={styles.statView}>
                    <Text style={styles.stat}>{minimum}</Text>
                    <Text style={styles.statText}>Min</Text> 
                </View>
                <View style={styles.statView}>
                    <Text style={styles.stat}>{meanValue}</Text>
                    <Text style={styles.statText}>Mean</Text> 
                </View>
                <View style={styles.statView}>
                    <Text style={styles.stat}>{maximum}</Text>
                    <Text style={styles.statText}>Max</Text> 
                </View>
            </View>
            }
            
          </Card>
            
            
        </View>
        
    );
    
}

const styles = StyleSheet.create({
  container : {
    textAlign: 'center'
  },
  card: {
   borderColor: '#17AEBF',
   borderRadius: 25
  },
  statsView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  statView: {
      flexDirection: 'column'
  },
  statText: {
      textAlign: 'center',
      fontSize: 12,
      color: '#4682B4'
  },
  stat: {
      fontSize: 25,
      textAlign: 'center',
      color: '#0C2340'
  }
    
})