import axios from 'axios'
import { FetchForMyHW } from './axiosFetch'

const fetchFor = new FetchForMyHW()
const formEL = document.querySelector('#search-form')
const btnSubmitEl = document.querySelector('button')
const divEl = document.querySelector('.gallery')
const btnLoadEl = document.querySelector('.load-more')

formEL.addEventListener('submit', onBtnSubmit)

function onBtnSubmit (e) {
    e.preventDefault()
    fetchFor.querry = e.target.elements.searchQuery.value
    fetchFor.axiosReturn().then(data => {console.log(data.data.hits),makeMurkup(data.data.hits)})
}



function makeMurkup (data) {
    const murkup = data.map(one => `<div class="photo-card">
    <img src="${one.webformatURL}" alt="" loading="lazy" width = 300px/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
      </p>
      <p class="info-item">
        <b>Views</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
      </p>
    </div>
  </div>`)
  

  divEl.insertAdjacentHTML('beforeend', murkup)
}