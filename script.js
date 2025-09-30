// To-Do
const apiKey = '3821cb0590b13021e1a6be3bb6fd1a34'; // Replace with your TMDB API key
const baseUrl = 'https://api.themoviedb.org/3';
const imageUrl = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let currentQuery = '';
let currentSort = 'popularity.desc';

const moviesContainer = document.getElementById('moviesContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumber = document.getElementById('pageNumber');

async function fetchMovies(page = 1) {
  let url = '';
  if(currentQuery) {
    url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(currentQuery)}&page=${page}&sort_by=${currentSort}`;
  } else {
    url = `${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${currentSort}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  displayMovies(data.results);
  pageNumber.textContent = currentPage;
}

function displayMovies(movies) {
  moviesContainer.innerHTML = '';
  movies.forEach(movie => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-card');
    movieEl.innerHTML = `
      <img src="${movie.poster_path ? imageUrl + movie.poster_path : ''}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Release: ${movie.release_date || 'N/A'}</p>
      <p>Rating: ${movie.vote_average}</p>
    `;
    moviesContainer.appendChild(movieEl);
  });
}

// Event Listeners
searchInput.addEventListener('input', () => {
  currentQuery = searchInput.value;
  currentPage = 1;
  fetchMovies(currentPage);
});

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  fetchMovies(currentPage);
});

prevBtn.addEventListener('click', () => {
  if(currentPage > 1) {
    currentPage--;
    fetchMovies(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  fetchMovies(currentPage);
});

// Initial fetch
fetchMovies();
