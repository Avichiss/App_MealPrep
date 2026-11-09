import { Recipe } from "./recipes";

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

export interface MealApiResponse {
  meals: Meal[] | null; 
}

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Custom async function: pakai await, lalu ubah Meal menjadi Recipe
export async function getApiRecipes(keyword: string): Promise<Recipe[]> {
  const meals = await fetchMealsPromise(keyword);

  return meals.map((meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    time: 20, // API tidak punya waktu memasak, jadi dibuat tetap
    category: meal.strCategory,
    image: meal.strMealThumb,
  }));
}