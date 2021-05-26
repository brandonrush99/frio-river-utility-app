import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text,Image,Card } from 'react-native-elements';
import { format,parseISO,isPast,isThisHour  } from 'date-fns';

export class Weather extends Component {
    _isMounted = false;

    constructor(props){
        super(props)
        this.state = {
            forecastData: [],
            precipitationData: [],
            isLoading: true,
            futureMode: false
        }
        this.toggleFutureMode = this.toggleFutureMode.bind(this);
    }

    //29.503235512087382, -99.72173117275169
    toggleFutureMode(){
      this.setState(previousState => ({ futureMode: !previousState.futureMode }));
    }
    
    getPrecipitation() {
      let url = 'https://api.weather.gov/gridpoints/EWX/79,58';
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/geo+json',
          'User-Agent': 'FrioWatch'
        }
      })
      .then((response) => response.json())
      .then((json) => {
        this.setState({precipitationData: json}, () => {
          this._isMounted = true;
        });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false }, () => {
          return 0;
        });
      });
    }
    getForecastHourly() {
      let url = 'https://api.weather.gov/gridpoints/EWX/79,58/forecast/hourly';
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/geo+json',
          'User-Agent': 'FrioWatch'
        }
      })
      .then((response) => response.json())
      .then((json) => {
        this.setState({forecastData: json});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        return this.getPrecipitation();
      });
    }

    componentDidMount() {
        let r1 = this.getForecastHourly();
        console.log(r1);
    }
    
      componentWillUnmount(){
        this._isMounted = false;
      }

      findPrecipitation(data, time){
        let precipitationData = data.properties.probabilityOfPrecipitation;
        let index = 0;
        for (let i = 0; i < precipitationData.values.length; i++){
          if (precipitationData.values[i].validTime.slice(0,11) === time.slice(0,11) && 
              parseInt(precipitationData.values[i].validTime.slice(11,13)) >= parseInt(time.slice(11,13))){
                index = i;
                break;
          }
        }
        return precipitationData.values[index].value;
      }

    getFuturecast(data){
      let futurecast = [];
      let counter = 0;
      for (let i = 0; i < data.properties.periods.length; i++){
        if (isPast(parseISO(data.properties.periods[i].startTime.slice(0,19))) && 
            !isThisHour(parseISO(data.properties.periods[i].startTime.slice(0,19)))){
          continue;
        }
        else if (counter >= 6){
          break;
        }
        else {
          futurecast.push(
            {
              time: data.properties.periods[i].startTime.slice(0,19),
              temperature: data.properties.periods[i].temperature,
              precipitation: this.findPrecipitation(this.state.precipitationData, data.properties.periods[i].startTime.slice(0,19))
            }
          );
          counter++;
        }
        
      }
      return futurecast;
    }

    render(){
        const isLoading = this.state.isLoading;
        const data = this.state.forecastData;
        let connectionIssue = false;
        let forecastNow = 'None';
        let futurecast = [];
        let windspeed = 'None';
        let iconUrl = '';
        let isDayTime = true;
        if (this._isMounted === true){
          try {
              futurecast = this.getFuturecast(data);
              windspeed = data.properties.periods[0].windSpeed;
              forecastNow = data.properties.periods[0].shortForecast;
              iconUrl = data.properties.periods[0].icon;
              isDayTime = data.properties.periods[0].isDaytime;
          } catch (error) {
              console.log(error);
              connectionIssue = true;
          }
          
        }
        return(
            <View style={styles.content}>
                {isLoading ? <ActivityIndicator/> : (
                <View>
                  <TouchableOpacity onPress={this.toggleFutureMode}>
                  {connectionIssue === false ? 
                    <Card containerStyle={[styles.card, isDayTime === false ? styles.cardNight : styles.cardDay]}>
                      <View style={styles.container}>
                        <Text h1 style={{color:'white'}}>{futurecast[0].temperature}&#176;F</Text>
                        
                        <Image source={{uri: iconUrl}} style={styles.image}/>  
                      </View>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                      <View>
                        {this.state.futureMode ? 
                          <View>
                            {
                              futurecast.slice(1,).map((f,i) => (
                                <View key={i} style={styles.futureForecastContainer}>
                                  <Text style={styles.textLaterTime}>{format(parseISO(f.time), 'h a')}: </Text>  
                                  <Text style={styles.textLater}>{f.temperature}&#176;F</Text>
                                  <Text style={styles.textLater}>{f.precipitation}% rain</Text>
                                </View>
                              ))
                            }
                          </View> :
                          <View>
                            <Text style={styles.textForecast}>{forecastNow}</Text>
                            <Text style={styles.textNow}>{futurecast[0].precipitation}% rain</Text>
                            <Text style={styles.textNow}>{windspeed} wind</Text>
                          </View>
                        }

                      </View>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                      <Text style={styles.asOf}>As of {format(parseISO(futurecast[0].time), 'MM/dd/yyyy h:mm a')}</Text>
                    </Card> 
                    :
                    <Card containerStyle={[styles.card, isDayTime === false ? styles.cardNight : styles.cardDay]}>
                      <View style={styles.container}>
                        <Text h1 style={{color:'white'}}>{futurecast[0].temperature}&#176;F</Text>
                        <Text h4 style={{color:'white'}}>None</Text>
                      </View>
                      <Text style={styles.textNow}>Feels like -1&#176;F</Text>
                      <Text style={styles.textNow}>-1% chance of rain</Text>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                    </Card>
                  }
                  </TouchableOpacity>
                </View>
                )} 
            </View>
        )
    }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 25
  },
  cardDay: {
    backgroundColor: '#94b4e3',
  },
  cardNight: {
    backgroundColor: '#3c4a91',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  futureForecastContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  futureForecast: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    alignContent: 'center',
    width: 50,
    height: 50
  },
  update: {
    color: '#D3D3D3',
    textAlign: 'center'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  textNow: {
    fontSize: 17,
    color: 'white',
  },
  textForecast: {
    fontSize: 18,
    color: 'white'
  },
  textLaterTime: {
    fontSize: 16,
    color: 'gray',
  },
  textLater: {
    fontSize: 17,
    color: 'white',
    
  },
  asOf: {
    color: 'gray',
    textAlign: 'center'
  },
  icon: {
    
    
  }
})