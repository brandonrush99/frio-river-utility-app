import React, { Component } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card,Button} from 'react-native-elements';
import { format,parseISO } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';

export class HistoricDischargeService extends Component{
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        data: [],
        isLoading: true,
      };
    }

    componentDidMount() {
        this._isMounted = true;
        let startDate = format(this.props.startDate, 'yyyy-MM-dd');
        let endDate = format(this.props.endDate, 'yyyy-MM-dd');
        let url = `https://waterservices.usgs.gov/nwis/dv/?format=json&indent=on&sites=08195000&startDT=${startDate}&endDT=${endDate}&statCD=00001,00002,00003&siteStatus=all`;
        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            if (this._isMounted){
              //console.log(json);
              this.setState({ data: json });
            }
          })
          .catch((error) => console.error(error))
          .finally(() => {
            this.setState({ isLoading: false });
          });
    }
    
    componentWillUnmount(){
    this._isMounted = false;
    }

    render(){
      const data = this.state.data;
      const isLoading = this.state.isLoading;
      let maximum = -1;
      let minimum = 100000000;
      let meanValue = 0;
      if (this._isMounted) {
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
              <Text h4 style={styles.text}>Maximum Value: {maximum}</Text>
              <Text h4 style={styles.text}>Minimum Value: {minimum}</Text>
              <Text h4 style={styles.text}>Mean Value: {meanValue}</Text>
            </Card>
              
              
          </View>
          
      );
    }
}

const styles = StyleSheet.create({
  container : {
    textAlign: 'center'
  },
  text: {
    textAlign: 'center'
  },
  card: {
   borderColor: 'red'
  }
    
})