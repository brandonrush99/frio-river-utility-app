import React, { useState } from 'react';
import { ActivityIndicator,View,StyleSheet } from 'react-native';
import { Text,Card,Button,Overlay} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dimensions } from 'react-native';
import { HistoricDischargeService } from "./historic_discharge_service";

export default function DischargeLookup() {
    const [showStartSpinner, setShowStartSpinner] = useState(false);
    const [showEndSpinner, setShowEndSpinner] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [lookupDischarge, setLookupDischarge] = useState(false);
    const [startDischarge, setStartDischarge] = useState(false);


    const onStartDateChange = (event, date) => {
        setStartDate(date);
    };

    const onEndDateChange = (event, date) => {
        setEndDate(date);
    };

    const toggleStartSpinner = () => {
        setShowStartSpinner(!showStartSpinner);
    }

    const toggleEndSpinner = () => {
        setShowEndSpinner(!showEndSpinner);
    }

    const toggleLookup = () => {
        setLookupDischarge(!lookupDischarge);
    }

    const toggleStartDischarge = () => {
        setStartDischarge(!startDischarge);
        setLookupDischarge(false);
    }


    return(
        <View>
            <Card containerStyle={styles.card}>
                <Card.Title>Lookup historical discharge data</Card.Title>
                <Card.Divider/>
                {startDischarge === false ? <Button title="Start now!" type="solid" onPress={toggleStartDischarge}/> :
                    <Overlay backdropStyle={styles.backdrop} overlayStyle={styles.overlay} onBackdropPress={toggleStartDischarge}>
                        <Text style={styles.text}>Start Date: </Text>
                        {showStartSpinner === false ? <Button title={startDate.toDateString()} type="outline" onPress={toggleStartSpinner}/> : 
                            <View>
                                <DateTimePicker
                                    mode="date"
                                    onChange={onStartDateChange}
                                    value={startDate}
                                    display="spinner"
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1950,8,30)}
                                    textColor='#000000'
                                />
                                <Button style={styles.doneButton} title="Done" type="solid" onPress={toggleStartSpinner}/>
                            </View>
                            
                        }
                        <Card.Divider/>
                        <Text style={styles.text}>End Date: </Text>
                        {showEndSpinner === false ? <Button title={endDate.toDateString()} type="outline" onPress={toggleEndSpinner}/> : 
                            <View>
                                <DateTimePicker
                                    onChange={onEndDateChange}
                                    value={endDate}
                                    display="spinner"
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1950,8,30)}
                                    textColor='#000000'
                                />
                                <Button style={styles.doneButton} title="Done" type="solid" onPress={toggleEndSpinner}/>
                            </View>
                            
                        }
                        <Card.Divider/>
                        
                        {lookupDischarge === false ? <Button title="Lookup" type="solid" onPress={toggleLookup}/>  : 
                            <View>
                                <HistoricDischargeService startDate={startDate} endDate={endDate}/>
                                <Text>{"\n"}</Text>
                                <Button title="Press to lookup again" type="solid" onPress={toggleLookup}/>
                            </View>
                            
                        } 
                    </Overlay>
                }
                
                
                
                
            </Card>
            
        </View>
    );
    

}
const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: "center"
    },
    doneButton: {
        width: Dimensions.get('window').width / 3,
        alignSelf: 'center'
    },
    card: {
        borderRadius: 25
    },
    overlay: {
        width: '90%',
        borderRadius: 15,
    },
    backdrop: {
        //backgroundColor: 'black',
        shadowOpacity: 100
    }

});