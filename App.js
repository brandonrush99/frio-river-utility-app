import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Weather } from './components/weather';
import { PastFrioDischarge } from './components/past_frio_discharge';
import Discharge from './components/current_discharge';
import DischargeLookup from './components/discharge_lookup';
import * as Linking from 'expo-linking';
import { Text,Header,Overlay,Card,Icon } from 'react-native-elements';
import getData from './services/apiHelper';

export default function App() {
  const [infoClicked, setInfoClicked] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState([]);
  const [precipitationData, setPrecipitationData] = useState([]);
  const [forecastHourlyData, setForecastHourlyData] = useState([]);
  const [forecastUrl, setForecastUrl] = useState('');
  const [forecastHourlyUrl, setForecastHourlyUrl] = useState('');
  const [forecastGridDataUrl, setForecastGridDataUrl] = useState('');

  const firstRender = useRef(true);

  GITHUB_LINK = 'https://github.com/brandonrush99/frio-river-utility-app';
  ICON_LINK = 'https://www.flaticon.com/';

  const getPrecipitation = () => {
    //let url = 'https://api.weather.gov/gridpoints/EWX/79,58';
    getData(this.state.forecastGridDataUrl)
    .then((response) => response.json())
    .then((json) => {
      setPrecipitationData(json);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      setRefresh(false);
    });
  }
  const getForecastHourly = () => {
    //let url = 'https://api.weather.gov/gridpoints/EWX/79,58/forecast/hourly';
    getData(this.state.forecastHourlyUrl)
    .then((response) => response.json())
    .then((json) => {
      setForecastHourlyData(json);
    })
    .catch((error) => console.error(error))
  }
  const getForecast = () => {
    getData(this.state.forecastUrl)
    .then((response) => response.json())
    .then((json) => {
      this.setState({forecastData: json});
    })
    .catch((error) => console.error(error))
  }

  const getUrls = () => {
    let url = 'https://api.weather.gov/points/29.21,-99.74';
    getData(url)
    .then((response) => response.json())
    .then((json) => {
      setForecastUrl(json.properties.forecast);
      setForecastHourlyUrl(json.properties.forecastHourly);
      setForecastGridDataUrl(json.properties.forecastGridData);
    })
    .catch((error) => console.error(error))
  }

  const fetchCurrentDischarge = () => {
    //this._isMounted = true;
    let url = 'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08195000&parameterCd=00060,00065&siteStatus=all';
    getData(url)
    .then((response) => response.json())
    .then((json) => {
        setData(json);
    })
    .catch((error) => console.error(error))
  }
  const onRefresh = () => {
    setRefresh(true);
    fetchCurrentDischarge();
    getUrls();
  }

  useEffect(() => {
    if (refresh){
      console.log("refreshing");
      fetchCurrentDischarge();
      getUrls();
      if (forecastUrl){
        getForecast();
      }
      if (forecastHourlyUrl){
        getForecastHourly();
      }
      if (forecastGridDataUrl){
        getPrecipitation();
      }
    }
  })

    return (
      
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl 
              refreshing={refresh} 
              onRefresh={onRefresh} 
              title="Refreshing..."
              />
          }
        >
          <Header
            rightComponent={{ icon: 'info', color: '#fff', onPress: () => {setInfoClicked(!infoClicked)}} }
            centerComponent={{ text:'Frio Watch', style: { color: '#fff', fontSize: 25} }}
          />
          {infoClicked ? 
            <Overlay onBackdropPress={infoClicked} overlayStyle={styles.overlay} backdropStyle={styles.backdrop}>
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
              refresh={refresh} 
              precipitationData={precipitationData} 
              forecastHourlyData={forecastHourlyData}
              forecastData={forecastData}
            />
            <View>
              <Discharge refresh={refresh} data={data}/>
              <DischargeLookup/>
              <PastFrioDischarge/>
            </View>
        </ScrollView>
    );
  }

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