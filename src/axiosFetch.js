'use strict'
import axios from 'axios'

export class FetchForMyHW {
    BASE_URL = 'https://pixabay.com/api/'
    API_KEY = 'key=34770322-1d785185ad6fb3686a5689e8d'

    querry = null
    axiosReturn () {
       return axios.get(`${this.BASE_URL}?${this.API_KEY}&q=${this.querry}&image_type=photo&pretty=true`).then(data => {return data})
    }
    
}


