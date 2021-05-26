import React, { Component } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card,Icon,ListItem, Overlay} from 'react-native-elements';
import { format,parseISO } from 'date-fns';

export default class Discharge extends Component {
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        data: [],
        isLoading: true,
        showHistoricalData: false,
        showDescripton: false
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

    iconClick(){
        this.setState(previousState => ({ showDescripton: !previousState.showDescripton }));
    }

    render() {
        const data = this.state.data;
        const isLoading = this.state.isLoading;
        let current_discharge;
        let connectionIssue = false;

        if (this._isMounted) {
            try {
                current_discharge = parseFloat(data.value.timeSeries[0].values[0].value[0].value,10);  
            } catch (error) {
                connectionIssue = true;
            }
            
        }

        const floatVals = [
            "0-25 : Bad Floating",
            "25-50 : Average Floating",
            "50-250 : Good Floating",
            "250+ : Jack would drown probably"
        ];

        return (
            <View>
                {isLoading ? <ActivityIndicator/> : (
                <View>
                    <Card containerStyle={styles.card}>
                    <Card.Title>Current discharge (cubic feet per second)</Card.Title>
                    <Card.Divider/>
                    {
                        <View style={{alignItems: 'center'}}>
                            {connectionIssue === false ? 
                                <Text h3 style={styles.value}>
                                    {current_discharge}{"   "}
                                        {current_discharge > 50 ? <Icon solid name='smile' type='font-awesome-5' color='#21db04' onPress={this.iconClick.bind(this)}/> : 
                                        current_discharge > 25 ? <Icon solid name='meh' size={35} type='font-awesome-5' color='#21db04' onPress={this.iconClick.bind(this)}/> : (
                                        <Icon solid name='frown' type='font-awesome-5' color='#f54842' onPress={this.iconClick.bind(this)}/>
                                        )}
                                </Text> :
                                <Text>Error</Text>
                            }
                        </View>
                    }
                    <Card.Divider/>
                    {
                        <View>
                            {this.state.showDescripton === false ? null :
                                <Overlay backdropStyle={styles.backdrop} overlayStyle={styles.overlay} onBackdropPress={this.iconClick.bind(this)}>
                                    {
                                        floatVals.map((v,i) => (
                                        <ListItem key={i} >
                                            <ListItem.Content>
                                                <ListItem.Title style={styles.listValues}>{v}</ListItem.Title>
                                            </ListItem.Content>
                                        </ListItem>
                                            )
                                        ) 
                                    }
                                    
                                </Overlay>
                                
                            }
                            <Text style={styles.date}>
                            Last Updated: {format(parseISO(data.value.timeSeries[0].values[0].value[0].dateTime), 'MM/dd/yyyy h:mm a')}
                            </Text>
                        </View>
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
    description: {
        color: 'grey'
    },
    date: {
        color: 'grey',
        textAlign: 'center'
    },
    value: {
        textAlign: 'center',
    },
    listValues: {
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center'
    },
    overlay: {
        width: '90%',
        borderRadius: 15,
    },
    backdrop: {
        //backgroundColor: 'black',
        shadowOpacity: 100
    }

})