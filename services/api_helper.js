import axios from "axios";
import { format } from 'date-fns';

export function getData(url){
    return axios.get(
        url,
        {
            headers: {
                'Content-Type': 'application/geo+json',
                'User-Agent': 'FrioWatch',
                'Cache-Control': 'no-cache'
              }
        }
    )
}

export function getStats(startDate, endDate){
    let url = `https://waterservices.usgs.gov/nwis/dv/?format=json&indent=on&sites=08195000&startDT=${startDate}&endDT=${endDate}&statCD=00001,00002,00003&siteStatus=all`;
    return axios.get(
        url,
        {
            headers: {
                'Content-Type': 'application/geo+json',
                'User-Agent': 'FrioWatch',
                'Cache-Control': 'no-cache'
            }
        }
    )
}

export async function getLineGraphData(days){
    let returnData = [];
    for (const day of days){
        let date = format(day, 'yyyy-MM-dd');
        const response = await getStats(date, date);
        let data = response.data;
        let meanValue = 0;
        if (data.length !== 0) {
            let meanValues = data.value.timeSeries[5].values[0].value;
            for(let i = 0; i < meanValues.length; i++){
                meanValue += parseFloat(meanValues[i].value,10);
            }
            meanValue /= meanValues.length;
            meanValue = Math.round(meanValue);
            returnData.push(meanValue);
        }
        
    }
    return returnData;
    
}

export async function getOnThisDayData(){
    let today = new Date();
    let month = today.getMonth();
    let day = today.getDay();
    let startDate = format(new Date("2007",month,day),"yyyy-MM-dd");
    let url = `https://waterservices.usgs.gov/nwis/stat/?format=rdb&sites=08195000&startDT=${startDate}&statReportType=daily&statTypeCd=mean,min,max&parameterCd=00060`;
    let response = await axios.get(
        url,
        {
            headers: {
                'Content-Type': 'application/geo+json',
                'User-Agent': 'FrioWatch',
                'Cache-Control': 'no-cache'
            }
        }
    );
    return response;
}