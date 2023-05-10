import React, { useState } from 'react';
import { ActivityIndicator,View,StyleSheet,Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text,Card,Button,Overlay,Icon} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format,parseISO,isPast,isThisHour  } from 'date-fns';
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
            <LinearGradient
                colors={['#17AEBF','#4682B4']} 
                style={styles.linearGradient}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                {startDischarge === false ? 
                <Button 
                    buttonStyle={styles.startNowButton} 
                    title="Lookup historical flowrate stats" 
                    type="solid" 
                    onPress={toggleStartDischarge}
                    icon={<Icon name="search"/>}
                /> :
                    <Overlay backdropStyle={styles.backdrop} overlayStyle={styles.overlay} onBackdropPress={toggleStartDischarge}>
                        <Text style={styles.text}>Start Date: </Text>
                        {showStartSpinner === false ? 
                            <Button 
                                title={startDate.toDateString()}
                                titleStyle={{color: '#17AEBF'}}
                                type="outline" 
                                onPress={toggleStartSpinner}
                                disabled={lookupDischarge}
                            /> : 
                            <View>
                                <DateTimePicker
                                    mode="date"
                                    onChange={onStartDateChange}
                                    value={startDate}
                                    display="spinner"
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1950,8,30)}
                                    textColor='#17AEBF'
                                    disabled={lookupDischarge}
                                />
                                <Button 
                                    buttonStyle={[styles.button, styles.doneButton]} 
                                    title="Done" 
                                    type="solid" 
                                    onPress={toggleStartSpinner}
                                />
                                <Card.Divider/>
                            </View>
                        
                        }
                        <Text style={styles.text}>End Date: </Text>
                        {showEndSpinner === false ? 
                            <Button 
                                title={endDate.toDateString()}
                                titleStyle={{color: '#17AEBF'}}
                                type="outline" 
                                onPress={toggleEndSpinner}
                                disabled={lookupDischarge}
                            /> : 
                            <View>
                                <DateTimePicker
                                    onChange={onEndDateChange}
                                    value={endDate}
                                    display="spinner"
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1950,8,30)}
                                    textColor='#17AEBF'
                                    disabled={lookupDischarge}
                                />
                                <Button 
                                    buttonStyle={[styles.button, styles.doneButton]} 
                                    title="Done" 
                                    type="solid" 
                                    onPress={toggleEndSpinner}
                                />
                            </View>
                            
                        }
                        <Card.Divider/>
                        
                        {lookupDischarge === false ? 
                            <Button 
                                title="Lookup" 
                                type="solid" 
                                onPress={toggleLookup}
                                buttonStyle={[styles.button]}
                            />  : 
                            <View>
                                <HistoricDischargeService startDate={startDate} endDate={endDate}/>
                                <Text>{"\n"}</Text>
                                <Button 
                                    title="Press to lookup again" 
                                    type="solid" 
                                    onPress={toggleLookup}
                                    buttonStyle={[styles.button]}
                                />
                            </View>
                            
                        } 
                    </Overlay>
                }
                
                
                
                
            </LinearGradient>
            
        </View>
    );
    

}
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4682B4'
    },
    startNowButton: {
        backgroundColor: 'transparent',
        marginBottom: 5
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        color: '#0C2340'
    },
    doneButton: {
        width: Dimensions.get('window').width / 3,
        alignSelf: 'center'
    },
    linearGradient: {
        borderRadius: 25, 
        borderColor: '#FDE3A7', 
        borderWidth: 1, 
        padding: 10, 
        width: '90%', 
        alignSelf: 'center', 
        marginTop: 10
    },
    overlay: {
        width: '90%',
        borderRadius: 15
    },
    backdrop: {
        //backgroundColor: 'black',
    }

});