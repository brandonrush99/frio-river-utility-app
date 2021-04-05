import React, { Component } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card,Icon} from 'react-native-elements';
import { format,parseISO } from 'date-fns'

export default class Discharge extends Component {
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        data: [],
        isLoading: true,
        showHistoricalData: false
      };
    }

    componentDidMount() {
        this._isMounted = true;
        fetch('https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08195000&parameterCd=00060,00065&siteStatus=all')
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

    render() {
        const data = this.state.data;
        const isLoading = this.state.isLoading;
        var current_discharge;

        if (this._isMounted) {
        current_discharge = parseFloat(data.value.timeSeries[0].values[0].value[0].value,10);
        }

        return (
            <View>
                <Text h3 style={styles.header}>Welcome to Frio Watch!</Text>
                {isLoading ? <ActivityIndicator/> : (
                <View>
                    <Card containerStyle={styles.card}>
                    <Card.Title>Current discharge (cubic feet per second)</Card.Title>
                    <Card.Divider/>
                    {
                        <View style={{alignItems: 'center'}}>
                            <Text h4 style={styles.value}>
                                {current_discharge}{"   "}
                                {current_discharge > 50 ? <Icon solid name='smile' type='font-awesome-5' color='#0ffc03'/> : 
                                current_discharge > 25 ? <Icon solid name='meh' type='font-awesome-5' color='#ebe534'/> : (
                                <Icon solid name='frown' type='font-awesome-5' color='#f54842'/>
                                )}
                            </Text>
                            
                        </View>
                    }
                    <Card.Divider/>
                    {
                        <Text style={styles.date}>
                        Last Updated: {format(parseISO(data.value.timeSeries[0].values[0].value[0].dateTime), 'MM/dd/yyyy hh:mm a')}
                        </Text>
                    }
                    </Card> 
                </View>
                
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 25
    },
    header: {
        textAlign: 'center',
        marginTop: 50,
    },
    date: {
        color: 'grey',
        textAlign: 'center'
    },
    value: {
        textAlign: 'center',
    }

})