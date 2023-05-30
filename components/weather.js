import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity} from 'react-native';
import { Text,Image,Icon,Skeleton } from '@rneui/themed';
import { format,parseISO,isPast,isThisHour  } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

export function Weather(props) {
      const [futureMode, setFutureMode] = useState(0);

    //29.503235512087382, -99.72173117275169
    const toggleFutureMode = () => {
      if (futureMode === 0){
        setFutureMode(1);
      }
      else if (futureMode === 1){
        setFutureMode(2);
      }
      else if (futureMode === 2){
        setFutureMode(0);
      }
      
    }

    const findPrecipitation = (data, time) => {
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

    const getFuturecast = (data) => {
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
              precipitation: findPrecipitation(props.precipitationData, data.properties.periods[i].startTime.slice(0,19))
            }
          );
          counter++;
        }
        
      }
      return futurecast;
    }
    const getFuturecastDaily = (data) => {
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
    
    let connectionIssue = true;
    let forecastNow = 'None';
    let futurecast = [];
    let windspeed = 'None';
    let iconUrl = '';
    let isDayTime = true;
    let daysMap = [];
    
    if (props.forecastHourlyData.length !== 0 && props.precipitationData.length !== 0){
      try {
          futurecast = getFuturecast(props.forecastHourlyData);
          windspeed = props.forecastHourlyData.properties.periods[0].windSpeed;
          forecastNow = props.forecastHourlyData.properties.periods[0].shortForecast;
          iconUrl = props.forecastHourlyData.properties.periods[0].icon;
          isDayTime = props.forecastHourlyData.properties.periods[0].isDaytime;
          connectionIssue = false;
          if (iconUrl.toString().includes(",0")){
            iconUrl = iconUrl.replace(",0","");
          }
      } catch (error) {
          console.log(error);
          //connectionIssue = true;
      }
      
    }
    if (props.forecastData.length !== 0){
      try{
        daysMap = getFuturecastDaily(props.forecastData);
      } catch(error) {
        console.log(error);
      }
    }
    return(
        <View style={styles.content}>
            {props.refresh ? 
            <Skeleton 
              skeletonStyle={{borderColor: '#FDE3A7', backgroundColor: '#17AEBF', alignSelf: 'center'}}
              width={'100%'}
              height={'100%'}
              animation='pulse'
          /> : (
            <View>
              <TouchableOpacity onPress={toggleFutureMode}>
              {connectionIssue === false ? 
                <LinearGradient
                  colors={['#17AEBF','#4682B4']} 
                  style={{borderRadius: 25, borderColor: '#FDE3A7', borderWidth: 1, padding: 10, width: '90%', alignSelf: 'center', marginVertical: 5}}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                >
                  
                  
                  
                  <View style={{marginBottom: 10}}>
                    {futureMode === 0 ? 
                      <View>
                        <View style={styles.container}>
                          <Text h2 style={{color:'white'}}>{futurecast[0].temperature}&#176;F</Text>
                          <Image source={{uri: iconUrl}} style={styles.image}/>  
                        </View>
                        <View>
                          <Text style={styles.textForecast}>{forecastNow}</Text>
                          <Text style={styles.textNow}>{futurecast[0].precipitation}% rain</Text>
                          <Text style={styles.textNow}>{windspeed} wind</Text>
                        </View>
                      </View>
                        :
                      <View>
                        {futureMode === 1 ?
                        <View style={{flexDirection: 'column', alignContent: 'flex-start'}}>
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
                 
                  <Text style={styles.asOf}>As of {format(parseISO(futurecast[0].time), 'M/d/yy h:mm a')}</Text>
                  {futureMode === 0 ? 
                    <View style={styles.bottomPageIconView}>
                        <Icon type='font-awesome-5' name='circle' solid size={8} iconStyle={styles.bottomPageIcon}/>
                        <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/>
                        <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/> 
                    </View> :
                    <View>
                      {futureMode === 1 ?
                        <View style={styles.bottomPageIconView}>
                          <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/>
                          <Icon type='font-awesome-5' name='circle' solid size={8} iconStyle={styles.bottomPageIcon}/>
                          <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/> 
                        </View>  :
                        <View style={styles.bottomPageIconView}>
                          <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/>
                          <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/>
                          <Icon type='font-awesome-5' name='circle' solid size={8} iconStyle={styles.bottomPageIcon}/> 
                        </View>
                      }
                    </View>
                  }
                  
                </LinearGradient> 
                :
                <LinearGradient
                  colors={['#17AEBF','#4682B4']} 
                  style={{borderRadius: 25, borderColor: '#FDE3A7', borderWidth: 1, padding: 10, width: '90%', alignSelf: 'center', marginVertical: 5}}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.container}>
                    <Text h1 style={{color:'white'}}>None&#176;F</Text>
                    <Text h4 style={{color:'white'}}>None</Text>
                  </View>
                  <Text style={styles.textNow}>Feels like -1&#176;F</Text>
                  <Text style={styles.textNow}>-1% chance of rain</Text>
                </LinearGradient>
              }
              </TouchableOpacity>
            </View>
            )} 
        </View>
    )
    
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    backgroundColor: '#4682B4',
    borderColor: '#FDE3A7'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  futureForecastContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
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
    color: '#0C2340',
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
    width: 45,
    height: 45,
    marginRight: 5
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
    fontSize: 15,
    color: '#0C2340',
  },
  textForecast: {
    fontSize: 16,
    color: '#0C2340'
  },
  textLaterTime: {
    fontSize: 16,
    color: '#0C2340',
  },
  textLater: {
    fontSize: 17,
    color: 'white',
    
  },
  asOf: {
    color: '#FDE3A7',
    textAlign: 'center',
    marginBottom: 10
  },
  bottomPageIconView: {
    flexDirection: 'row', 
    justifyContent: 'center'
  },
  bottomPageIcon: {
    marginHorizontal: 2,
    color: '#0C2340'
  }
})