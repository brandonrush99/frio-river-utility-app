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