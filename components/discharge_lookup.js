import React, { Component } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card,Button,Overlay} from 'react-native-elements';
import { format,parseISO } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';
import { HistoricDischargeService } from "./historic_discharge_service";

export default class DischargeLookup extends Component {
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        data: [],
        isLoading: true,
        showStartSpinner: false,
        showEndSpinner: false,
        startDate: new Date(2020,6,1),
        endDate: new Date(2020,6,2),
        lookupDischarge: false,
        startDischarge: false,
      };
    }

    // componentDidMount() {
    //     this._isMounted = true;

    //     let url = `https://waterservices.usgs.gov/nwis/dv/?format=json&indent=on&sites=08195000&startDT=${this.state.startDate}&\
    //     endDT=${this.state.endDate}&statCD=00001,00002,00003&siteStatus=all`;

    //     fetch(url)
    //       .then((response) => response.json())
    //       .then((json) => {
    //         if (this._isMounted){
    //           //console.log(json);
    //           this.setState({ data: json });
    //         }
    //       })
    //       .catch((error) => console.error(error))
    //       .finally(() => {
    //         this.setState({ isLoading: false });
    //       });
    // }
    
    // componentWillUnmount(){
    // this._isMounted = false;
    // }

    setStartDate = (event, date) => {
        this.setState({startDate: date});
        console.log("start date changed to " + date.toDateString());
    };

    setEndDate = (event, date) => {
        this.setState({endDate: date});
    };

    toggleStartSpinner(){
        this.setState(previousState => ({ showStartSpinner: !previousState.showStartSpinner }));
    }

    toggleEndSpinner(){
        this.setState(previousState => ({ showEndSpinner: !previousState.showEndSpinner }));
    }

    toggleLookup(){
        this.setState(previousState => ({ lookupDischarge: !previousState.lookupDischarge }));
    }

    toggleStartDischarge(){
        this.setState(previousState => ({ startDischarge: !previousState.startDischarge }));
        this.setState({lookupDischarge: false});
    }


    render(){
        return(
            <View>
                <Card containerStyle={styles.card}>
                    <Card.Title>Lookup historical discharge data</Card.Title>
                    <Card.Divider/>
                    {this.state.startDischarge === false ? <Button title="Start now!" type="solid" onPress={this.toggleStartDischarge.bind(this)}/> :
                        <Overlay backdropStyle={styles.backdrop} overlayStyle={styles.overlay} onBackdropPress={this.toggleStartDischarge.bind(this)}>
                            <Text style={styles.text}>Start Date: </Text>
                            {this.state.showStartSpinner === false ? <Button title={this.state.startDate.toDateString()} type="outline" onPress={this.toggleStartSpinner.bind(this)}/> : 
                                <View>
                                    <DateTimePicker
                                        onChange={this.setStartDate}
                                        value={this.state.startDate}
                                        display="spinner"
                                        maximumDate={new Date()}
                                        minimumDate={new Date(1950,8,30)}
                                    />
                                    <Button style={styles.doneButton} title="Done" type="solid" onPress={this.toggleStartSpinner.bind(this)}/>
                                </View>
                                
                            }
                            <Card.Divider/>
                            <Text style={styles.text}>End Date: </Text>
                            {this.state.showEndSpinner === false ? <Button title={this.state.endDate.toDateString()} type="outline" onPress={this.toggleEndSpinner.bind(this)}/> : 
                                <View>
                                    <DateTimePicker
                                        onChange={this.setEndDate}
                                        value={this.state.endDate}
                                        display="spinner"
                                        maximumDate={new Date()}
                                        minimumDate={new Date(1950,8,30)}
                                    />
                                    <Button style={styles.doneButton} title="Done" type="solid" onPress={this.toggleEndSpinner.bind(this)}/>
                                </View>
                                
                            }
                            <Card.Divider/>
                            
                            {this.state.lookupDischarge === false ? <Button title="Lookup" type="solid" onPress={this.toggleLookup.bind(this)}/>  : 
                                <View>
                                    <HistoricDischargeService startDate={this.state.startDate} endDate={this.state.endDate}/>
                                    <Text>{"\n"}</Text>
                                    <Button title="Press to lookup again" type="solid" onPress={this.toggleLookup.bind(this)}/>
                                </View>
                                
                            } 
                        </Overlay>
                    }
                    
                    
                    
                    
                </Card>
                
            </View>
        );
    }

}
const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: "center"
    },
    doneButton: {
        width: Dimensions.get('window').width / 3,
        alignSelf: 'center'
    },
    card: {
        borderRadius: 25
    },
    overlay: {
        width: '90%',
        borderRadius: 15,
    },
    backdrop: {
        //backgroundColor: 'black',
        shadowOpacity: 100
    }

});