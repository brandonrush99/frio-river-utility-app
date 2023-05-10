import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card,Icon,ListItem, Overlay,Skeleton} from '@rneui/themed';
import { format,parseISO } from 'date-fns';

export default function CurrentFlowrate(props){

    const [showDescripton, setShowDescription] = useState(false);
    const [currentDischarge, setCurrentDischarge] = useState(null);
    const [connectionIssue, setConnectionIssue] = useState(false);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current){
            firstRender.current = false;
            const data = props.data;
            if (data.length !== 0 ) {
                try {
                    setCurrentDischarge(parseFloat(data.value.timeSeries[0].values[0].value[0].value,10));  
                } catch (error) {
                    setConnectionIssue(true);
                }
                
            } 
        }
        
    })
    

    const floatVals = [
        "0-25 : Bad Floating",
        "25-50 : Average Floating",
        "50-250 : Good Floating",
        "250+ : Jack would drown probably"
    ];
    return (
        
        <View>
            {props.refresh ? <Skeleton/> : (
            <View >
                
                {
                    <View style={{marginBottom: 10}}>
                        {connectionIssue === false ?
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                            <View></View>
                            <Text style={styles.value}>{currentDischarge}</Text>
                            <Text style={{alignSelf: 'center'}}>
                                    {currentDischarge > 50 ? <Icon solid name='smile' size={35} type='font-awesome-5' color='#21db04' onPress={() => {setShowDescription(!showDescripton)}}/> : 
                                    currentDischarge > 25 ? <Icon solid name='meh' size={35} type='font-awesome-5' color='#21db04' onPress={() => {setShowDescription(!showDescripton)}}/> : (
                                    <Icon solid name='frown' size={35} type='font-awesome-5' color='#8B0000' onPress={() => {setShowDescription(!showDescripton)}}/>)}
                            </Text> 
                        </View>:
                            <Text>Error</Text>
                        }
                    </View>
                }
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
                        {props.data.length !== 0 ?<Text style={styles.date} key={props.refresh}>
                        Flowrate as of {format(parseISO(props.data.value.timeSeries[0].values[0].value[0].dateTime), 'M/d/yy h:mm a')}
                        </Text> :
                        null

                        }
                        
                    </View>
                }
                
            </View>
            
            )}
        </View>
    );
    
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderColor: '#ffffff'
    },
    description: {
        color: 'grey'
    },
    date: {
        color: '#FDE3A7',
        textAlign: 'center'
    },
    value: {
        fontSize: 40,
        color: '#fff',
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
    },
    title: {
        textAlign: 'center',
        fontSize: 15        
    }

})