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

