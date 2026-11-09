export interface Recipe {
  id: string;
  name: string;
  time: number;
  category?: string;
  image?: string;
}

let recipes: Recipe[] = [
  { id: "1", name: "Nasi Goreng", time: 15 },
  { id: "2", name: "Ayam Bakar", time: 30 },
  { id: "3", name: "Salad Sayur", time: 10 },
];

const normalizeRecipeName = (name: string): string => name.trim();

export function getRecipes(): Recipe[] {
  return recipes.map((recipe) => ({ ...recipe }));
}

export function addRecipe(name: string): Recipe | undefined {
  const normalizedName = normalizeRecipeName(name);

  if (!normalizedName) {
    return undefined;
  }

  const newRecipe: Recipe = {
    id: Date.now().toString(),
    name: normalizedName,
    time: 15,
  };

  recipes = [...recipes, newRecipe];
  return newRecipe;
}

export function getRecipeById(id?: string | string[]): Recipe | undefined {
  const normalizedId = Array.isArray(id) ? id[0] : id;

  if (!normalizedId) {
    return undefined;
  }

  return recipes.find((recipe) => recipe.id === normalizedId);
}
