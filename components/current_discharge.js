import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card,Icon,ListItem, Overlay} from 'react-native-elements';
import { format,parseISO } from 'date-fns';

export default function Discharge(props){

    const [showDescripton, setShowDescription] = useState(false);

    const data = props.data;
    const isLoading = props.refresh;
    let current_discharge;
    let connectionIssue = false;
    if (data.length !== 0 ) {
        try {
            current_discharge = parseFloat(data.value.timeSeries[0].values[0].value[0].value,10);  
        } catch (error) {
            connectionIssue = true;
        }
        
    }

    const floatVals = [
        "0-25 : Bad Floating",
        "25-50 : Average Floating",
        "50-250 : Good Floating",
        "250+ : Jack would drown probably"
    ];
    return (
        
        <View>
            {isLoading ? <ActivityIndicator/> : (
            <View>
                <Card containerStyle={styles.card}>
                <Card.Title key={props.refresh}>Current discharge (cubic feet per second)</Card.Title>
                <Card.Divider/>
                {
                    <View style={{alignItems: 'center'}}>
                        {connectionIssue === false ? 
                            <Text h3 style={styles.value}>
                                {current_discharge}{"   "}
                                    {current_discharge > 50 ? <Icon solid name='smile' size={35} type='font-awesome-5' color='#21db04' onPress={() => {setShowDescription(!showDescripton)}}/> : 
                                    current_discharge > 25 ? <Icon solid name='meh' size={35} type='font-awesome-5' color='#21db04' onPress={() => {setShowDescription(!showDescripton)}}/> : (
                                    <Icon solid name='frown' size={35} type='font-awesome-5' color='#f54842' onPress={() => {setShowDescription(!showDescripton)}}/>
                                    )}
                            </Text> :
                            <Text>Error</Text>
                        }
                    </View>
                }
                <Card.Divider/>
                {
                    <View>
                        {showDescripton === false ? null :
                            <Overlay backdropStyle={styles.backdrop} overlayStyle={styles.overlay} onBackdropPress={() => {setShowDescription(!showDescripton)}}>
                                {
                                    floatVals.map((v,i) => (
                                    <ListItem key={i} >
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.listValues}>{v}</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                        )
                                    ) 
                                }
                                
                            </Overlay>
                            
                        }
                        {data.length !== 0 ?<Text style={styles.date}>
                        Last Updated: {format(parseISO(data.value.timeSeries[0].values[0].value[0].dateTime), 'MM/dd/yyyy h:mm a')}
                        </Text> :
                        null

                        }
                        
                    </View>
                }
                </Card> 
            </View>
            
            )}
        </View>
    );
    
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 25
    },
    description: {
        color: 'grey'
    },
    date: {
        color: 'grey',
        textAlign: 'center'
    },
    value: {
        textAlign: 'center',
    },
    listValues: {
        textAlign: 'center',
        fontSize: 20,
        alignSelf: 'center'
    },
    overlay: {
        width: '90%',
        borderRadius: 15,
    },
    backdrop: {
        //backgroundColor: 'black',
        shadowOpacity: 100
    }

})