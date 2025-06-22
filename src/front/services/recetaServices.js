const API_KEY = "4373b6f682fa45f0a6b77bd4ae8564b6";
//const API_KEY = "7fe89b9a14aa49c38244ff28b60d061a";
//const API_KEY = "5e7f5475d6cb4c5bb2dbd0c78d0e06a1";
//const API_KEY = "83ed3a611f3a4e5386fca7d034e00079";
const BASE_URL = "https://api.spoonacular.com/recipes";


const recetaServices = {};

recetaServices.searchRecetas = async (query, limit = 2) => {
  try {
    const url = new URL(`${BASE_URL}/complexSearch`);
    url.searchParams.set("apiKey", API_KEY);
    url.searchParams.set("query", query);
    url.searchParams.set("number", limit); 

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    const { results = [] } = await resp.json();
    // data.results is an array of { id, title, image, … }
    return results;
  } catch (error) {
    console.error("Error al buscar recetas:", error);
    return [];
  }
};

recetaServices.getRecetaById = async (id) => {
  try {
    const url = new URL(`${BASE_URL}/${id}/information`);
    url.searchParams.set("apiKey", API_KEY);
    url.searchParams.set("includeNutrition", false);

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error("Error al obtener detalles de receta:", error);
    return null;
  }
};

export default recetaServices;
