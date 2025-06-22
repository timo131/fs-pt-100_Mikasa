const API_KEY = "e0704d03";
const BASE_URL = "https://www.omdbapi.com/";

const omdbApi = {};

omdbApi.searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    ); 
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error("Error al buscar:", error);
    return [];
  }
};

omdbApi.getMovieById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener detalles:", error);
    return null;
  }
};

export default omdbApi;
