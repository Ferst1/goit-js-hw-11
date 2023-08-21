import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const apiKey = '38917761-3df8dcef6ff50ecc382f6f666'; // API key
const perPage = 40;
let currentPage = 1;
let currentQuery = '';
loadMoreBtn.classList.add('its-hidden');

//fetch images
async function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}

searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
let lightbox = new SimpleLightbox('.gallery a');

// display images
function displayImages(images) {
  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');
    photoCard.innerHTML = `
      <a href="${image.largeImageURL}" class="lightbox-target">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(photoCard);
  });
}

// clear gallery
function clearGallery() {
  gallery.innerHTML = '';
}

//  submit and fetch images
async function onFormSubmit(event) {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  loadMoreBtn.classList.add('its-hidden');

  if (!searchQuery) {
    return;
  }

  currentQuery = searchQuery;
  currentPage = 1;
  clearGallery();

  const data = await fetchImages(searchQuery, currentPage);

  if (data && data.hits.length > 0) {
    displayImages(data.hits);

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    lightbox.refresh();
    if (data.totalHits <= currentPage * perPage) {
    } else {
      setTimeout(() => loadMoreBtn.classList.remove('its-hidden'), 500);
    }
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

// Load more images
async function onLoadMore() {
  currentPage += 1;
  const data = await fetchImages(currentQuery, currentPage);

  if (data && data.hits.length > 0) {
    displayImages(data.hits);
    lightbox.refresh();
    if (data.totalHits <= currentPage * perPage) {
      setTimeout(() => loadMoreBtn.classList.remove('its-hidden'), 500);
    }
  } else {
    loadMoreBtn.classList.add('its-hidden');

    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
