import axios from 'axios'
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { FetchForMyHW } from './axiosFetch'

const fetchFor = new FetchForMyHW()
const formEL = document.querySelector('#search-form')
const btnSubmitEl = document.querySelector('button')
const divEl = document.querySelector('.gallery')
const btnLoadEl = document.querySelector('.load-more')
btnLoadEl.classList.add('is-hidden')



formEL.addEventListener('submit', onBtnSubmit)

function onBtnSubmit (e) {
    e.preventDefault()
    fetchFor.page =1
    divEl.innerHTML =''
    fetchFor.querry = e.target.elements.searchQuery.value
    fetchFor.axiosReturn().then(data => {
      console.log(data.data)
      makeMurkup(data.data.hits)
      
      if(data.data.hits.length === 0) {
        
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return
      }      
    })
   
}


btnLoadEl.addEventListener('click', onBtnLoadClick) 

function onBtnLoadClick (e) {
  
  fetchFor.page +=1
  fetchFor.axiosReturn().then(data => {
    console.log(data.data)
    makeMurkup(data.data.hits)
    if( fetchFor.page * fetchFor.per_page > data.data.totalHits){
        
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.") 
      btnLoadEl.classList.add('is-hidden')
    }
     })
     
    
}


function makeMurkup (data) {
    const murkup = data.map(({webformatURL, tags, likes, views, comments, downloads}) => 
    `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 250px height=150px/>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item" >
        <b> Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </div>`)
  

  divEl.insertAdjacentHTML('beforeend', murkup)
  btnLoadEl.classList.remove('is-hidden')
}



