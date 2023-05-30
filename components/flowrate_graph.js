import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator,View,StyleSheet, Dimensions,TouchableOpacity,Platform } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { format } from 'date-fns';
import {LineChart} from "react-native-chart-kit";
import { getLineGraphData } from '../services/api_helper';
import { LinearGradient } from 'expo-linear-gradient';

export default function FlowrateGraph(props){

    const [dayLabels, setDayLabels] = useState([]);
    const [yearLabels, setYearLabels] = useState([]);
    const [flowrateDayData, setFlowrateDayData] = useState([]);
    const [flowrateYearData, setFlowrateYearData] = useState([]);
    const [graphVersion, setGraphVersion] = useState(true);
    const [currentFlowrate, setCurrentFlowrate] = useState(-1);
    const [chartParentWidth, setChartParentWidth] = useState(0);

    const firstRender = useRef(true);

    const toggleGraph = () => {
        setGraphVersion(!graphVersion);
    }

    const calculateDayLabels = () => {
        let labels = [];
        let date = new Date();
        for (let i = 4; i > 0; i--){
            let day = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));
            labels.push(day);
        }
        return labels;
    }

    const calculateYearLabels = () => {
        let labels = [];
        let date = new Date();
        for (let i = 4; i > 0; i--){
            let day = new Date(new Date().setFullYear(date.getFullYear() - i));
            labels.push(day);
        }
        return labels;
    }

    useEffect(() => {
        if (props.currentFlowrateData.length !== 0) {
            try {
                setCurrentFlowrate(parseFloat(props.currentFlowrateData.value.timeSeries[0].values[0].value[0].value,10)); 
                firstRender.current = true;
            } catch (error) {
                console.log("error connecting: " + error);
            }
        }
        if (firstRender.current && currentFlowrate !== -1){
            firstRender.current = false;
            //Setup the labels
            let dateLabels = calculateDayLabels();
            let formattedLabels = [];
            dateLabels.forEach(label => {
                formattedLabels.push(format(label, "M/d/yy"))
            });
            formattedLabels.push(format(new Date(), "M/d/yy"));
            setDayLabels(formattedLabels);
            if (currentFlowrate !== -1 ) {
                //Get the data for the last 5 days
                getLineGraphData(dateLabels).then((response) => {
                    response.push(currentFlowrate);
                    setFlowrateDayData(response);
                });
            }
            
            
            //Get data for the past 5 years
            dateLabels = calculateYearLabels();
            formattedLabels = [];
            dateLabels.forEach(label => {
                formattedLabels.push(format(label, "M/d/yy"))
            });
            formattedLabels.push(format(new Date(), "M/d/yy"));
            setYearLabels(formattedLabels);
            if (currentFlowrate !== -1 ) {
                //Get the data for the last 5 days
                getLineGraphData(dateLabels).then((response) => {
                    response.push(currentFlowrate);
                    setFlowrateYearData(response);
                });
            }
        }
        
    },[props.currentFlowrateData, currentFlowrate]);
    
    const dayData = {
        labels: dayLabels,
        datasets: [
          {
            data: flowrateDayData,
            
            strokeWidth: 2 // optional
          }
        ]
      };
      const yearData = {
        labels: yearLabels,
        datasets: [
          {
            data: flowrateYearData,
            
            strokeWidth: 2 // optional
          }
        ]
      };
      const chartConfig={
        backgroundGradientFromOpacity: 0,
        backgroundGradientFrom: "#17AEBF",
        backgroundGradientTo: "#4682B4",
        decimalPlaces: 1, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(253, 227, 167, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 25,
          marginVertical: 5
        },
        propsForDots: {
          r: "5",
          strokeWidth: "1",
          stroke: "rgb(253, 227, 167)"
        }
      };

    return(
        <View style={styles.mainView}>
            
            {flowrateDayData.length === 0 || flowrateYearData.length === 0 || props.refresh === true ? 
            <ActivityIndicator color='#0C2340'/> : 
            <View>
                {graphVersion ?
                    <View onLayout={({ nativeEvent }) => setChartParentWidth(nativeEvent.layout.width)}
                    style={styles.chartWrapper}>
                       <TouchableOpacity onPress={toggleGraph}>
                            <LinearGradient
                                colors={['#17AEBF','#4682B4']} 
                                style={styles.linearGradient}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                            >
                            <Text style={styles.graphTitle}>Flowrate last 5 days</Text>
                            <LineChart
                                data={dayData}
                                width={Platform.OS === 'android' ? Dimensions.get("window").width : Dimensions.get("window").width * .9}
                                height={Platform.OS === 'android' ? Dimensions.get("window").height / 4 : Dimensions.get("window").height / 5}
                                chartConfig={chartConfig}
                                bezier
                                withDots={true}
                                withShadow={false}
                                getDotColor={(opacity=0) => {`rgba(12,35,64, ${opacity}`}}
                                style={styles.graph}
                            />
                            <View style={styles.bottomPageIconView}>
                                <Icon type='font-awesome-5' name='circle' solid size={8} iconStyle={styles.bottomPageIcon}/>
                                <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/> 
                            </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> :
                    <View>
                        <TouchableOpacity onPress={toggleGraph}>
                            
                            <LinearGradient
                                colors={['#17AEBF','#4682B4']} 
                                style={styles.linearGradient}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                            >
                            <Text style={styles.graphTitle}>Flowrate on this day last 5 years</Text>    
                            <LineChart
                                data={yearData}
                                width={Platform.OS === 'android' ? Dimensions.get("window").width : Dimensions.get("window").width * .9}
                                height={Platform.OS === 'android' ? Dimensions.get("window").height / 4 : Dimensions.get("window").height / 5}
                                chartConfig={chartConfig}
                                bezier
                                withDots={true}
                                withShadow={false}
                                getDotColor={(opacity=0) => {`rgba(12,35,64, ${opacity}`}}
                                style={styles.graph}
                            />
                            <View style={styles.bottomPageIconView}>
                                <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/>
                                <Icon type='font-awesome-5' name='circle' solid size={8} iconStyle={styles.bottomPageIcon}/> 
                            </View>
                            </LinearGradient>
                            
                        </TouchableOpacity>
                        
                    </View>
                }
                
            </View>
                
                    
                

            } 
            
        </View>
        
        
        
    );
}

const styles = StyleSheet.create({
    mainView: {
        alignItems: 'center'
    },
    graphTitle: {
        textAlign: 'center',
        fontSize: 15,
        marginVertical: 5,
        color: '#FDE3A7'
    },
    graph: {
        marginVertical: 5,
        
    },
    linearGradient: {
        borderRadius: 25, 
        borderColor: '#FDE3A7', 
        borderWidth: 1, 
        padding: 10, 
        width: '95%', 
        alignSelf: 'center', 
        marginTop: 5
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