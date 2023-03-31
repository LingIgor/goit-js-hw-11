'use strict'
import axios from 'axios'

export class FetchForMyHW {
    BASE_URL = 'https://pixabay.com/api/'
    API_KEY = 'key=34770322-1d785185ad6fb3686a5689e8d'

    querry = null
    page = 1
    per_page = 40

    async axiosReturn () {
       return axios.get(`${this.BASE_URL}?${this.API_KEY}&q=${this.querry}&image_type=photo&safesearch=true&orientation=horizontal&page=${this.page}&per_page=${this.per_page}`).then(data => {return data})
    }
    
}


