import type { Recipe } from "./recipes";

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string | null | undefined;
}

interface MealApiResponse {
  meals: Meal[] | null;
}

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const RECIPE_ID_PREFIX = "mealdb-";

function toRecipe(meal: Meal): Recipe {
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const ingredient = meal[`strIngredient${index + 1}`]?.trim();
    const measure = meal[`strMeasure${index + 1}`]?.trim();

    return ingredient ? `${measure ? `${measure} ` : ""}${ingredient}` : null;
  }).filter((ingredient): ingredient is string => ingredient !== null);

  return {
    id: `${RECIPE_ID_PREFIX}${meal.idMeal}`,
    name: meal.strMeal,
    time: 20,
    category: meal.strCategory,
    image: meal.strMealThumb,
    ingredients,
    instructions: meal.strInstructions,
  };
}

function fetchMeals(path: string): Promise<Meal[]> {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/${path}`;
    console.log("Fetching:", url);

    fetch(url)
      .then((response) => {
        console.log("Status:", response.status);
        if (!response.ok) {
          throw new Error(`TheMealDB mengembalikan HTTP ${response.status}`);
        }

        return response.json() as Promise<MealApiResponse>;
      })
      .then((result) => {
        console.log("Result:", result);
        if (result.meals?.length) {
          resolve(result.meals);
          return;
        }

        reject(new Error("Resep tidak ditemukan"));
      })
      .catch((error: unknown) => {
        console.log("Fetch error:", error);
        reject(
          error instanceof TypeError
            ? new Error("Tidak bisa terhubung ke TheMealDB. Periksa koneksi internet.")
            : error instanceof Error
              ? error
              : new Error(String(error)),
        );
      });
  });
}

export async function getApiRecipes(keyword: string): Promise<Recipe[]> {
  const meals = await fetchMeals(
    `search.php?s=${encodeURIComponent(keyword)}`,
  );
  return meals.map(toRecipe);
}

export async function getApiRecipeById(id: string): Promise<Recipe> {
  if (!id.startsWith(RECIPE_ID_PREFIX)) {
    throw new Error("ID resep API tidak valid");
  }

  const mealId = id.slice(RECIPE_ID_PREFIX.length);
  const meals = await fetchMeals(`lookup.php?i=${encodeURIComponent(mealId)}`);
  return toRecipe(meals[0]);
}