// TMDB API Configuration
const apiKey = '3821cb0590b13021e1a6be3bb6fd1a34';
const baseUrl = 'https://api.themoviedb.org/3';
const imageUrl = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let totalPages = 1;
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

  if (currentQuery) {
    // Search endpoint (sort_by is ignored for search)
    url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(currentQuery)}&page=${page}`;
  } else {
    // Discover endpoint (sorting works)
    url = `${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${currentSort}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results || []);
    totalPages = data.total_pages; // Save total pages
    pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;

    // Enable/disable buttons depending on page
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = '';

  if (movies.length === 0) {
    moviesContainer.innerHTML = '<p>No movies found.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-card');
    movieEl.innerHTML = `
      <img src="${movie.poster_path ? imageUrl + movie.poster_path : ''}" alt="${movie.title}" style="border-radius:8px;">
      <h3>${movie.title}</h3>
      <p>Release: ${movie.release_date || 'N/A'}</p>
      <p>Rating: ${movie.vote_average || 'N/A'}</p>
    `;
    moviesContainer.appendChild(movieEl);
  });
}

// Event Listeners
searchInput.addEventListener('input', () => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  fetchMovies(currentPage);
});

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  currentPage = 1;
  fetchMovies(currentPage);
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchMovies(currentPage);
  }
});

// Initial fetch
fetchMovies();
