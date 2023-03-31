import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { FetchForMyHW } from './axiosFetch';
import { debounce } from 'debounce';

const fetchFor = new FetchForMyHW();
const formEL = document.querySelector('#search-form');
const btnSubmitEl = document.querySelector('button');
const divEl = document.querySelector('.gallery');
const btnLoadEl = document.querySelector('.load-more');
const TIME = 400;

btnLoadEl.classList.add('is-hidden');
btnSubmitEl.setAttribute('disabled', true);

formEL.addEventListener('submit', onBtnSubmit);
btnLoadEl.addEventListener('click', debounce(onBtnLoadClick, TIME));
formEL.addEventListener('input', onBtnInput);

function onBtnInput(e) {
  fetchFor.querry = e.target.value.trim();
  fetchFor.querry
    ? btnSubmitEl.removeAttribute('disabled')
    : btnSubmitEl.setAttribute('disabled', true);
}

async function onBtnSubmit(e) {
  e.preventDefault();
  fetchFor.page = 1;
  divEl.innerHTML = '';
  fetchFor.querry = e.target.elements.searchQuery.value.trim();
  btnLoadEl.classList.add('is-hidden');
  try {
    const { data } = await fetchFor.axiosReturn();
    makeMurkup(data.hits);
    noMoreResult(data.totalHits);

    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (data.hits.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      btnLoadEl.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

async function onBtnLoadClick() {
  fetchFor.page += 1;

  try {
    const { data } = await fetchFor.axiosReturn();
    makeMurkup(data.hits);
    noMoreResult(data.totalHits);
  } catch (err) {
    console.log(err);
  }
}

function makeMurkup(data) {
  const murkup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card"> 
      <a class="gallery__item" href="${largeImageURL}"/>   
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width = 350px height=200px/>
   <div class="info">
      <p class="info-item">
        <b>Likes:</b><span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views:</b><span>${views}</span>
      </p>
      <p class="info-item" >
        <b> Comments:</b><span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads:</b><span>${downloads}</span>
      </p>
    </div>
  </div>`
    )
    .join('');

  divEl.insertAdjacentHTML('beforeend', murkup);

  var lightbox = new SimpleLightbox('.gallery a', {
    captionSelector: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    scrollZoom: false,
  });
}

function noMoreResult(totalHits) {
  if (fetchFor.page * fetchFor.per_page > totalHits && totalHits !== 0) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    // btnLoadEl.classList.add('is-hidden');
    return;
  }
}
