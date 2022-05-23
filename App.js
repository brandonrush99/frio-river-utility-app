import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Weather } from './components/weather';
import { PastFrioDischarge } from './components/past_frio_discharge';
import Discharge from './components/current_discharge';
import DischargeLookup from './components/discharge_lookup';
import * as Linking from 'expo-linking';
import { Text,Header,Overlay,Card,Icon } from 'react-native-elements';
import {getData} from './services/apiHelper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [infoClicked, setInfoClicked] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [dischargeData, setDischargeData] = useState([]);
  const [precipitationData, setPrecipitationData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [forecastHourlyData, setForecastHourlyData] = useState([]);
  const [urls, setUrls] = useState({
    forecastUrl: '',
    forecastHourlyUrl: '',
    forecastGridDataUrl: ''
  });

  const firstRender = useRef(true);

  const GITHUB_LINK = 'https://github.com/brandonrush99/frio-river-utility-app';
  const ICON_LINK = 'https://www.flaticon.com/';

  const wait = () => {
    return new Promise(resolve => setTimeout(resolve,2000));
  }

  const getPrecipitation = () => {
    console.log("Fetching precipitation data");
    getData(urls.forecastGridDataUrl)
    .then((response) => {
      setPrecipitationData(response.data);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      wait().then(() => {setRefresh(false);})
      
    });
  }
  const getForecastHourly = () => {
    console.log("Fetching hourly forecast data");
    getData(urls.forecastHourlyUrl)
    .then((response) => {
      setForecastHourlyData(response.data);
      getPrecipitation();
    })
    .catch((error) => console.error(error))
  }
  const getForecast = () => {
    console.log("Fetching forecast data");
    getData(urls.forecastUrl)
    .then((response) => {
      setForecastData(response.data);
      getForecastHourly();
    })
    .catch((error) => console.error(error))
  }

  const getUrls = () => {
    console.log("Fetching urls");
    let url = 'https://api.weather.gov/points/29.21,-99.74';
    getData(url)
    .then((response) => {
      setUrls({
        forecastUrl: response.data.properties.forecast,
        forecastHourlyUrl: response.data.properties.forecastHourly,
        forecastGridDataUrl: response.data.properties.forecastGridData
      });
    })
    .catch((error) => console.error(error))
  }

  const fetchCurrentDischarge = () => {
    console.log("Fetching discharge data");
    let url = 'https://waterservices.usgs.gov/nwis/iv/?format=json&sites=08195000&parameterCd=00060,00065&siteStatus=all';
    getData(url)
    .then((response) => {
      setDischargeData(response.data);
      getUrls();
    })
    .catch((error) => console.error(error))
  }
  const onRefresh = () => {
    console.log("Refreshing");
    setRefresh(true);
    fetchCurrentDischarge();
  }

  useEffect(() => {
    if (refresh){
      if (dischargeData.length === 0){
        fetchCurrentDischarge();
      }
      if (urls.forecastUrl){
        console.log(urls.forecastUrl);
        getForecast();
      }
    }
  }, [refresh, urls])

    return (
        <SafeAreaProvider>
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
              <Overlay onBackdropPress={() => {setInfoClicked(!infoClicked)}} overlayStyle={styles.overlay} backdropStyle={styles.backdrop}>
                <Card>
                  <Text style={styles.infoText}>This app was created by Brandon Rush</Text>
                  <Card.Divider/>
                  <Text style={styles.githubLink} onPress={() => { Linking.openURL(GITHUB_LINK) }}>Click here for the GitHub for this project</Text>
                  <Card.Divider/>
                  <Text style={styles.infoText}>
                    Icon for app made by Freepik from{" "}
                    <Text style={styles.githubLink} onPress={() => {Linking.openURL(ICON_LINK) }}>
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
                <Discharge refresh={refresh} data={dischargeData}/>
                <DischargeLookup/>
                <PastFrioDischarge/>
              </View>
          </ScrollView>
        </SafeAreaProvider>
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