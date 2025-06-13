const API_KEY = "4373b6f682fa45f0a6b77bd4ae8564b6";
const BASE_URL = "https://api.spoonacular.com/recipes";


const recetaServices = {};

recetaServices.searchRecetas = async (query) => {
  try {
    const url = new URL(`${BASE_URL}/complexSearch`);
    url.searchParams.set("apiKey", API_KEY);
    url.searchParams.set("query", query);

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
