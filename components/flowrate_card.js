import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import CurrentFlowrate from './current_flowrate';
import OnThisDay from './on_this_day';
import { LinearGradient } from 'expo-linear-gradient';
import { Skeleton,Icon } from '@rneui/themed';
import { PastFrioDischarge } from './past_frio_discharge';
import { getOnThisDayData } from '../services/api_helper';
import { format } from 'date-fns';

export default function FlowrateCard(props){
    const [mode,setMode] = useState("current");
    const [onThisDayData, setOnThisDayData] = useState(null);
    const firstRender = useRef(true);

    const toggleMode = () => {
        if (mode === "current") { setMode("past"); }
        else { setMode("current"); }
    }

    const getTodaysData = (responseData) => {
        /*
            0 - agency_cd	1 - site_no	
            2 - parameter_cd	3 - ts_id	
            4 - loc_web_ds	5 - month_nu	
            6 - day_nu	7 - begin_yr	
            8 - end_yr	9 - count_nu	
            10 - max_va_yr	11 - max_va	
            12 - min_va_yr	13 - min_va	
            14 - mean_va
        */
        const month = format(new Date(), "M");
        const day = format(new Date(), "d");
        let dayData = {};
        if (responseData){
            console.log("finding mean, min, and max");
            responseData.forEach(line => {
                if (line[0] === "U"){
                    let lineData = line.split("\t");
                    if (lineData[5] === month.toString() && lineData[6] === day.toString()){
                        console.log(lineData);
                        dayData["mean"] = lineData[14];
                        dayData["max"] = lineData[11];
                        dayData["maxYear"] = lineData[10];
                        dayData["min"] = lineData[13];
                        dayData["minYear"] = lineData[12];
                    }
                }
            });
        }
        return dayData;
    }

    useEffect(() => {
        if (firstRender.current === true){
            firstRender.current = false;
            getOnThisDayData().then((response) => {
                const responseData = response.data.split('\n')
                setOnThisDayData(getTodaysData(responseData));
            })
            .catch((error) => console.log(error));
            
        }
    })

    return(
        <View>
            {props.refresh === true ? 
            <Skeleton 
                skeletonStyle={styles.skeleton}
                width={'100%'}
                height={'100%'}
                animation='pulse'
            /> : 
            <TouchableOpacity onPress={toggleMode}>
                {mode === "current" ? 
                    <LinearGradient
                        colors={['#17AEBF','#4682B4']} 
                        style={styles.linearGradient}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <CurrentFlowrate refresh={props.refresh} data={props.dischargeData}/>
                        <OnThisDay refresh={props.refresh} data={onThisDayData}/>
                        <View style={styles.bottomPageIconView}>
                           <Icon type='font-awesome-5' name='circle' solid size={8} iconStyle={styles.bottomPageIcon}/>
                           <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/> 
                        </View>
                        
                    </LinearGradient> :
                    <LinearGradient
                        colors={['#17AEBF','#4682B4']} 
                        style={styles.linearGradient}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <PastFrioDischarge/>
                        <View style={styles.bottomPageIconView}>
                           <Icon type='font-awesome-5' name='circle' size={8} iconStyle={styles.bottomPageIcon}/>
                           <Icon type='font-awesome-5' name='circle' solid size={8} iconStyle={styles.bottomPageIcon}/> 
                        </View>
                    </LinearGradient>
                }
                
            </TouchableOpacity>
            }
        </View>
       
    );
}

const styles = StyleSheet.create({
    skeleton: {
        borderColor: '#FDE3A7',
        backgroundColor: '#17AEBF',
        alignSelf: 'center'
    },
    linearGradient: {
        borderRadius: 25, 
        borderColor: '#FDE3A7', 
        borderWidth: 1, 
        padding: 10, 
        width: '90%', 
        alignSelf: 'center', 
        marginVertical: 5
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