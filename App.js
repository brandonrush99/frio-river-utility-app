import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Weather } from './components/weather';
import DischargeLookup from './components/discharge_lookup';
import * as Linking from 'expo-linking';
import { Text,Header,Overlay,Image } from '@rneui/themed';
import {getData} from './services/apiHelper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlowrateGraph from './components/flowrate_graph';
import { LinearGradient } from 'expo-linear-gradient';
import FlowrateCard from './components/flowrate_card';

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

  const USGS_LINK = 'https://waterservices.usgs.gov/';
  const ICON_LINK = 'https://www.flaticon.com/';
  const WEATHER_LINK = 'https://www.weather.gov/';

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
            <LinearGradient 
              colors={['#4682B4', '#6C88A4', '#17AEBF', '#AED6F1'].reverse()} 
              style={styles.linearGradient}
            >
            <Header
              centerComponent={{ text:'Frio Watch', style: { color: '#fff', fontSize: 25} }}
              rightComponent={
                <Image 
                  source={require('./assets/floating_icon.png')} 
                  style={{width: Dimensions.get('window').width/12, height: Dimensions.get('window').width/12}}
                  onPress={() => {setInfoClicked(!infoClicked)}}
                />
              }
              backgroundColor='#17AEBF'
            />
            {infoClicked ? 
              <Overlay onBackdropPress={() => {setInfoClicked(!infoClicked)}} overlayStyle={styles.overlay}>
                  <Text h4 style={styles.infoText}>
                    Thank you for downloading Frio Watch!
                  </Text>
                  <Text style={styles.infoText}>This app was created to make it easy to view flowrate data from the Frio River.
                    Here are some things to know about the contents of the app:
                  </Text>
                  <Text style={styles.numberedText}>1. Most things in the app are 'Touchable', meaning that tapping on them will reveal more content.</Text>
                  <Text style={styles.numberedText}>2. All flowrates are in units of cubic feet per second.</Text>
                  <Text style={styles.numberedText}>3. Flowrate data is pulled from the{" "}
                    <Text style={styles.link} onPress={() => {Linking.openURL(USGS_LINK)}}>USGS website.</Text>
                  </Text>
                  <Text style={styles.numberedText}>4. Weather data is pulled from the{" "}
                    <Text style={styles.link} onPress={() => {Linking.openURL(WEATHER_LINK)}}>National Weather Service website.</Text>
                  </Text>
                  <Text style={styles.numberedText}>5. Icon for app created by{" "}
                    <Text style={styles.link} onPress={() => {Linking.openURL(ICON_LINK) }}>
                      Freepik - Flaticon
                    </Text>
                  </Text>
                  <Text style={styles.numberedText}>6. Tap the icon in the top right corner to bring this page up again. Tap anywhere outside to continue, and enjoy!</Text>
              </Overlay> : null
            }
              <View>
                  <Weather 
                    refresh={refresh} 
                    precipitationData={precipitationData} 
                    forecastHourlyData={forecastHourlyData}
                    forecastData={forecastData}
                  />
                  <FlowrateCard refresh={refresh} dischargeData={dischargeData}/>
                  <FlowrateGraph refresh={refresh} currentFlowrateData={dischargeData}/>
                  <DischargeLookup/>
              </View>
            </LinearGradient>
          </ScrollView>
        </SafeAreaProvider>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    minHeight: Dimensions.get("window").height, 
    paddingBottom: 10
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
  link: {
    fontSize: 17,
    textAlign: 'center',
    color: '#0398fc',
    textDecorationLine: 'underline'
  },
  overlay: {
    width: '90%',
    borderRadius: 15,
    backgroundColor: '#AED6F1'
  },
  infoText: {
    textAlign: 'center',
    marginVertical: 5,
    color: '#0C2340',
    fontSize: 20
  },
  numberedText: {
    fontSize: 17,
    marginVertical: 5,
    color: '#0C2340'
  }

})