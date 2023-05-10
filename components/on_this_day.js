import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text} from '@rneui/themed';
import { format } from 'date-fns';

export default function OnThisDay(props){

    return(
        <View>
            {props.data === null || props.refresh === true ? <ActivityIndicator/> :
                <View style={{marginVertical: 10}}>
                    <View style={styles.statsView}>
                        <View style={styles.statView}>
                            <Text style={styles.stat}>{props.data.mean}</Text>
                            <Text style={styles.statText}>Mean</Text> 
                        </View>
                        <View style={styles.statView}>
                            <Text style={styles.stat}>{props.data.min}</Text>
                            <Text style={styles.statText}>Min ({props.data.minYear})</Text> 
                        </View>
                        <View style={styles.statView}>
                            <Text style={styles.stat}>{props.data.max}</Text>
                            <Text style={styles.statText}>Max ({props.data.maxYear})</Text> 
                        </View>
                    </View>
                    <Text style={styles.statsDescription}>{format(Date.now(), "MMMM do")} stats since 2007</Text>
                </View> 
            }
           
        </View>
        
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#00a8e8',
        borderColor: '#00a8e8'
    },
    statsView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    statView: {
        flexDirection: 'column'
    },
    statText: {
        textAlign: 'center',
        fontSize: 10,
        color: '#AED6F1'
    },
    stat: {
        fontSize: 25,
        textAlign: 'center',
        color: '#0C2340'
    },
    statsDescription: {
        color: '#FDE3A7',
        textAlign: 'center',
        marginTop: 10
    }

});