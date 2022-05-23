import axios from "axios";

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