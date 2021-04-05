import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View} from 'react-native';
import { Text,Image,Card } from 'react-native-elements';
import { format,parseISO } from 'date-fns'

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

        return(
            <View>
                {isLoading ? <ActivityIndicator/> : (
                <View>
                  <Card containerStyle={styles.card}>
                    <Card.Title>Current Weather</Card.Title>
                    <Text h2 style={styles.temperature}>{data.current.temperature}&#176;F</Text>
                    <Text h4 style={styles.description}>{data.current.weather_descriptions[0]}{"     "}
                      <Image containerStyle={styles.image}
                          source={{uri: data.current.weather_icons[0]}}
                          style={{ width: 50, height: 50 }}
                          PlaceholderContent={<ActivityIndicator />}
                      />
                    </Text>
                    
                    <Text h4>{data.current.precip}% chance of rain</Text>
                    <Card.Divider/>
                    <Text style={styles.update}>Last updated: {format(parseISO(data.location.localtime), 'MM/dd/yyyy hh:mm a')}</Text>
                  </Card>

          
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
  temperature: {
    color: 'grey'
  },
  description: {
    color: 'black'
  },
  image: {
    alignContent: 'center'
  },
  update: {
    color: 'grey',
    textAlign: 'center'
  }
})