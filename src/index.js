import axios from 'axios';
import Notiflix from 'notiflix';
import { FetchForMyHW } from './axiosFetch';
import throttle from 'lodash.throttle';

const fetchFor = new FetchForMyHW();
const formEL = document.querySelector('#search-form');
const btnSubmitEl = document.querySelector('button');
const divEl = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');
const THROTLE_TIME = 300;

btnLoadEl.classList.add('is-hidden');
btnSubmitEl.setAttribute('disabled', true);

formEL.addEventListener('submit', throttle(onBtnSubmit, THROTLE_TIME));
btnLoadEl.addEventListener('click', throttle(onBtnLoadClick, THROTLE_TIME));
formEL.addEventListener('input', onBtnInput);

function onBtnInput(e) {
  fetchFor.querry = e.target.value.trim();
  console.log(fetchFor.querry);
  fetchFor.querry
    ? btnSubmitEl.removeAttribute('disabled')
    : btnSubmitEl.setAttribute('disabled', true);
}

function onBtnSubmit(e) {
  e.preventDefault();
  fetchFor.page = 1;
  divEl.innerHTML = '';
  fetchFor.querry = e.target.elements.searchQuery.value.trim();
  fetchFor
    .axiosReturn()
    .then(({ data }) => {
      console.log(data);
      makeMurkup(data.hits);

      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        btnLoadEl.classList.add('is-hidden');
        return;
      }

      if (fetchFor.page * fetchFor.per_page > data.totalHits) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        btnLoadEl.classList.add('is-hidden');
        return;
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function onBtnLoadClick(e) {
  fetchFor.page += 1;
  fetchFor
    .axiosReturn()
    .then(({ data }) => {
      console.log(data);
      makeMurkup(data.hits);
    })
    .catch(err => {
      console.log(err);
    });
}

function makeMurkup(data) {
  const murkup = data.map(
    ({ webformatURL, tags, likes, views, comments, downloads }) =>
      `<div class="photo-card">      
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 300px height=200px/>
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
  </div>`
  );

  divEl.insertAdjacentHTML('beforeend', murkup);
  // btnLoadEl.classList.remove('is-hidden');
}
