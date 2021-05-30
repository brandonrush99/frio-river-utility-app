import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text,Image,Card } from 'react-native-elements';
import { format,parseISO,isPast,isThisHour  } from 'date-fns';

export class Weather extends Component {
    constructor(props){
        super(props)
        this.state = {
            forecastHourlyData: [],
            precipitationData: [],
            refresh: true,
            futureMode: 0
        }
        this.toggleFutureMode = this.toggleFutureMode.bind(this);
    }

    //29.503235512087382, -99.72173117275169
    toggleFutureMode(){
      if (this.state.futureMode === 0){
        this.setState({futureMode: 1});
      }
      else if (this.state.futureMode === 1){
        this.setState({futureMode: 2});
      }
      else if (this.state.futureMode === 2){
        this.setState({futureMode: 0});
      }
      
    }

    findPrecipitation(data, time){
      let precipitationData = data.properties.probabilityOfPrecipitation;
      let index = 0;
      
      for (let i = 0; i < precipitationData.values.length; i++){
        let validTime = precipitationData.values[i].validTime;
        let end = parseInt(validTime.split("/")[1].replace("PT","").replace("H",""));
        //the -5 is for converting to central time from utc
        
        if (validTime.slice(0,11) === time.slice(0,11) && 
          parseInt(validTime.slice(11,13))+ end - 5 >= parseInt(time.slice(11,13))){
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
              precipitation: this.findPrecipitation(this.props.precipitationData, data.properties.periods[i].startTime.slice(0,19))
            }
          );
          counter++;
        }
        
      }
      return futurecast;
    }
    getFuturecastDaily(data){
      let days = data.properties.periods;
      let daysMap = [];
      let number = 0;
      for (let i = 0; i < days.length; i++){
        if (number < 4 && i < days.length - 1){

          if (days[i+1].name.toLowerCase().includes("night")){
            number++;
            daysMap.push({
              name: format(parseISO(days[i].startTime.slice(0,10)),"EEE d"),
              temperatureHigh: days[i].temperature,
              temperatureLow: days[i+1].temperature,
              icon: days[i].icon
            })
          }
        }
        
        
      }
      return daysMap;
    }

    render(){
        const isLoading = this.props.refresh;
        const forecastHourlyData = this.props.forecastHourlyData;
        const forecastData = this.props.forecastData;
        let connectionIssue = true;
        let forecastNow = 'None';
        let futurecast = [];
        let windspeed = 'None';
        let iconUrl = '';
        let isDayTime = true;
        let daysMap = [];
        if (typeof forecastHourlyData !== "undefined"){
          try {
              futurecast = this.getFuturecast(forecastHourlyData);
              windspeed = forecastHourlyData.properties.periods[0].windSpeed;
              forecastNow = forecastHourlyData.properties.periods[0].shortForecast;
              iconUrl = forecastHourlyData.properties.periods[0].icon;
              isDayTime = forecastHourlyData.properties.periods[0].isDaytime;
              connectionIssue = false;
          } catch (error) {
              console.log(error);
              //connectionIssue = true;
          }
          
        }
        if (typeof forecastData !== "undefined"){
          try{
            daysMap = this.getFuturecastDaily(forecastData);
          } catch(error) {
            console.log(error);
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
                        {this.state.futureMode === 0 ? 
                          <View>
                            <Text style={styles.textForecast}>{forecastNow}</Text>
                            <Text style={styles.textNow}>{futurecast[0].precipitation}% rain</Text>
                            <Text style={styles.textNow}>{windspeed} wind</Text>
                          </View>
                           :
                          <View>
                            {this.state.futureMode === 1 ?
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
                              <View style={styles.dailyContainer}>
                                {
                                  daysMap.map((d,i) => (
                                    <View key={i}>
                                      <Text style={styles.day}>{d.name}</Text>
                                      <View style={styles.temperatureContainer}>
                                        <Text style={styles.highTemperature}>{d.temperatureHigh}&#176;F</Text>
                                        <Text style={styles.lowTemperature}>{d.temperatureLow}&#176;F</Text>
                                        <Image source={{uri: d.icon}} style={styles.futureImage}/>
                                      </View>
                                      
                                    </View>
                                  ))
                                }
                              </View>
                            }
                            
                          </View>
                        }

                      </View>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                      <Text style={styles.asOf}>As of {format(parseISO(futurecast[0].time), 'MM/dd/yyyy h:mm a')}</Text>
                    </Card> 
                    :
                    <Card containerStyle={[styles.card, isDayTime === false ? styles.cardNight : styles.cardDay]}>
                      <View style={styles.container}>
                        <Text h1 style={{color:'white'}}>None&#176;F</Text>
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
  dailyContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  temperatureContainer: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  day: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'center'
  },
  highTemperature: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center'
  },
  lowTemperature: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center'
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
  futureImage: {
    width: 50,
    height: 50,
    alignSelf: 'center'
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