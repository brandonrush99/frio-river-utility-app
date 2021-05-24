import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View} from 'react-native';
import { Text,Image,Card } from 'react-native-elements';
import { format,getHours,parseISO } from 'date-fns'
import { Dimensions } from 'react-native';

export class Weather extends Component {
    _isMounted = false;

    constructor(props){
        super(props)
        this.state = {
            data: [],
            isLoading: true
        }
    }

    componentDidMount() {
        let url = 'https://api.weather.gov/gridpoints/EWX/87,62/forecast';
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/geo+json',
            'User-Agent': 'FrioWatch'
          }
        })
        .then((response) => response.json())
        .then((json) => {
          this.setState({data: json}, () => {
            this._isMounted = true;
          });
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
        const isLoading = this.state.isLoading;
        const data = this.state.data;
        let connectionIssue = false;
        let temperatureNow = -1;
        let temperatureLater = -1;
        let precipitationNow = '';
        let precipitationLater = '';
        let forecastNow = 'None';
        //let forecastLater = 'None';
        let windspeed = 'None';
        let iconUrl = '';
        let later = '';
        let isDayTime = true;
        if (this._isMounted === true){
          try {
            temperatureNow = data.properties.periods[0].temperature;
            temperatureLater = data.properties.periods[1].temperature;
            windspeed = data.properties.periods[0].windSpeed;
            forecastNow = data.properties.periods[0].shortForecast;
            //forecastLater = data.properties.periods[1].shortForecast;
            iconUrl = data.properties.periods[0].icon;
            let posNow = data.properties.periods[0].detailedForecast.indexOf('%');
            let posLater = data.properties.periods[1].detailedForecast.indexOf('%');
            precipitationNow = data.properties.periods[0].detailedForecast.slice(posNow-2,posNow+1);
            precipitationLater = data.properties.periods[1].detailedForecast.slice(posLater-2,posLater+1);
            later = data.properties.periods[1].name;
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
                  {connectionIssue === false ? 
                    <Card containerStyle={[styles.card, isDayTime === false ? styles.cardNight : styles.cardDay]}>
                      <View style={styles.container}>
                        <Text h1 style={{color:'white'}}>{temperatureNow}&#176;F</Text>
                        <Image source={{uri: iconUrl}} style={styles.image}/>  
                      </View>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                      <Text style={styles.textNow}>{forecastNow}</Text>
                      <Text style={styles.textNow}>{windspeed} wind</Text>
                      <Text style={styles.textNow}>{precipitationNow} chance of rain</Text>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                      <Text style={styles.textLater}>{later}: {temperatureLater}&#176;F and {precipitationLater} chance of rain</Text>
                    </Card> :
                    <Card containerStyle={[styles.card, this.currentTime > 19 || this.currentTime < 7 ? styles.cardNight : styles.cardDay]}>
                      <View style={styles.container}>
                        <Text h1 style={{color:'white'}}>{temperature}&#176;F</Text>
                        <Text h4 style={{color:'white'}}>None</Text>
                      </View>
                      <Text style={styles.textNow}>Feels like -1&#176;F</Text>
                      <Text style={styles.textNow}>-1% chance of rain</Text>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                    </Card>
                  }
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
  textLater: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center'
  }
})