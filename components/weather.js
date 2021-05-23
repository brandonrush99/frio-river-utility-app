import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View} from 'react-native';
import { Text,Image,Card } from 'react-native-elements';
import { format,getHours,parseISO } from 'date-fns'
import { Dimensions } from 'react-native';

export class Weather extends Component {
    _isMounted = false;
    currentTime = new Date().getHours();

    constructor(props){
        super(props)
        this.state = {
            data: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this._isMounted = true;
        fetch('http://api.weatherstack.com/current?access_key=9e50a663b9fe95d5667241b215dc1c3c&query=78838&units=f')
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
   

    render(){
        const data = this.state.data;
        const isLoading = this.state.isLoading;
        let connectionIssue = false;
        let temperature = -1;
        try {
          temperature = data.current.temperature;
        } catch (error) {
          connectionIssue = true;
        }
        return(
            <View style={styles.content}>
                {isLoading ? <ActivityIndicator/> : (
                <View>
                  {connectionIssue === false ? 
                    <Card containerStyle={[styles.card, this.currentTime > 19 || this.currentTime < 7 ? styles.cardNight : styles.cardDay]}>
                      <View style={styles.container}>
                        <Text h1 style={{color:'white'}}>{data.current.temperature}&#176;F</Text>
                        <Text h4 style={{color:'white'}}>{data.current.weather_descriptions[0]}
                          <Image source={{uri:data.current.weather_icons[0]}} style={styles.image}/>
                        </Text>
                      </View>
                      <Text style={styles.text}>Feels like {data.current.feelslike}&#176;F</Text>
                      <Text style={styles.text}>{data.current.precip}% chance of rain</Text>
                      <Card.Divider style={{backgroundColor: 'white'}}/>
                      <Text style={styles.update}>Last updated: {format(parseISO(data.location.localtime), 'MM/dd/yyyy hh:mm a')}</Text>
                    </Card> :
                    <Card containerStyle={[styles.card, this.currentTime > 19 || this.currentTime < 7 ? styles.cardNight : styles.cardDay]}>
                      <View style={styles.container}>
                        <Text h1 style={{color:'white'}}>{temperature}&#176;F</Text>
                        <Text h4 style={{color:'white'}}>None</Text>
                      </View>
                      <Text style={styles.text}>Feels like -1&#176;F</Text>
                      <Text style={styles.text}>-1% chance of rain</Text>
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
  text: {
    fontSize: 17,
    color: 'white'
  }
})