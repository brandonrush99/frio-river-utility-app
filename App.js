import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Weather } from './components/weather';
import { PastFrioDischarge } from './components/past_frio_discharge';
import Discharge from './components/current_discharge';
import DischargeLookup from './components/discharge_lookup';
import * as Linking from 'expo-linking';
import { Text,Header,Overlay,Card,Icon } from 'react-native-elements';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoClicked: false,
      refresh: false,
      data: [],
      precipitationData: [],
      forecastHourlyData: [],
      forecastUrl: '',
      forecastHourlyUrl: '',
      forecastGridDataUrl: ''
    };
    this.infoClick = this.infoClick.bind(this);
    this.toggleRefresh = this.toggleRefresh.bind(this);
  }

  GITHUB_LINK = 'https://github.com/brandonrush99/frio-river-utility-app';
  ICON_LINK = 'https://www.flaticon.com/';

  infoClick() {
    this.setState(previousState => ({ infoClicked: !previousState.infoClicked }));
  }
  toggleRefresh(bool){
    //this.setState(previousState => ({ refresh: !previousState.refresh }));
    this.setState({refresh: bool});
  }
  wait(){
    return new Promise(resolve => setTimeout(resolve,2000));
  }
  getUrls(){
    let url = 'https://api.weather.gov/points/29.21,-99.74';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/geo+json',
        'User-Agent': 'FrioWatch',
        'Cache-Control': 'no-cache'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        forecastUrl: json.properties.forecast,
        forecastHourlyUrl: json.properties.forecastHourly,
        forecastGridDataUrl: json.properties.forecastGridData
      },() => {
        this.getForecast();
      })
    })
    .catch((error) => console.error(error))
  }
  getPrecipitation() {
    //let url = 'https://api.weather.gov/gridpoints/EWX/79,58';
    fetch(this.state.forecastGridDataUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/geo+json',
        'User-Agent': 'FrioWatch',
        'Cache-Control': 'no-cache'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({precipitationData: json}, () => {
        //this._isMounted = true;
      });
    })
    .catch((error) => console.error(error))
    .finally(() => {
      this.wait().then(() => this.toggleRefresh(false));
      });
  }
  getForecastHourly() {
    //let url = 'https://api.weather.gov/gridpoints/EWX/79,58/forecast/hourly';
    fetch(this.state.forecastHourlyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/geo+json',
        'User-Agent': 'FrioWatch',
        'Cache-Control': 'no-cache'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({forecastHourlyData: json});
    })
    .catch((error) => console.error(error))
    .finally(() => {
      return this.getPrecipitation();
    });
  }
  getForecast(){
    fetch(this.state.forecastUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/geo+json',
        'User-Agent': 'FrioWatch',
        'Cache-Control': 'no-cache'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({forecastData: json});
    })
    .catch((error) => console.error(error))
    .finally(() => {
      return this.getForecastHourly();
    });
  }
  fetchCurrentDischarge(){
    //this._isMounted = true;
    let url = 'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08195000&parameterCd=00060,00065&siteStatus=all';
    fetch(url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FrioWatch',
        'Cache-Control': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        
          //console.log(json);
          this.setState({ data: json });
        
      })
      .catch((error) => console.error(error))
      .finally(() => {
        //this.setState({ isLoading: false });
        
      });
  }
  onRefresh(){
    this.toggleRefresh(true);
    this.fetchCurrentDischarge();
    this.getUrls();
    //this.wait().then(() => this.toggleRefresh(false));
  }

  componentDidMount(){
    this.onRefresh();
  }


  render() {
    return (
      
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl 
              refreshing={this.state.refresh} 
              onRefresh={this.onRefresh.bind(this)} 
              title="Refreshing..."
              />
          }
        >
          <Header
            rightComponent={{ icon: 'info', color: '#fff', onPress: this.infoClick }}
            centerComponent={{ text:'Frio Watch', style: { color: '#fff', fontSize: 25} }}
          />
          {this.state.infoClicked ? 
            <Overlay onBackdropPress={this.infoClick} overlayStyle={styles.overlay} backdropStyle={styles.backdrop}>
              <Card>
                <Text style={styles.infoText}>This app was created by Brandon Rush</Text>
                <Card.Divider/>
                <Text style={styles.githubLink} onPress={() => { Linking.openURL(this.GITHUB_LINK) }}>Click here for the GitHub for this project</Text>
                <Card.Divider/>
                <Text style={styles.infoText}>
                  Icon for app made by Freepik from{" "}
                  <Text style={styles.githubLink} onPress={() => {Linking.openURL(this.ICON_LINK) }}>
                    www.flaticon.com
                  </Text>
                </Text>
              </Card>
              
            </Overlay> :
            null
          }
            <Weather 
              refresh={this.state.refresh} 
              precipitationData={this.state.precipitationData} 
              forecastHourlyData={this.state.forecastHourlyData}
              forecastData={this.state.forecastData}
            />
            <View>
              <Discharge refresh={this.state.refresh} data={this.state.data}/>
              {/*  */}
              <DischargeLookup/>
              <PastFrioDischarge/>
            </View>
        </ScrollView>
    );
  }
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cff6ff'
    
  },
  icon: {
    textAlign: 'center'
  },
  listItem: {
    textAlign: 'center',
  },
  image: {
    height:'100%',
    width:'100%'
  },
  header: {
    backgroundColor: '#03a5fc'
  },
  infoText: {
    fontSize: 17,
    textAlign: 'center'
  },
  githubLink: {
    fontSize: 17,
    textAlign: 'center',
    color: '#0398fc',
    textDecorationLine: 'underline'
  },
  backdrop: {
    shadowOpacity: 100
  },
  overlay: {
    width: '90%',
    borderRadius: 15,
},
})