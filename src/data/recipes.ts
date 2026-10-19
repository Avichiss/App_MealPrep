
export type Recipe = {
  id: string;
  name: string;
  time: number;
};

let recipes: Recipe[] = [
  { id: "1", name: "Nasi Goreng", time: 15 },
  { id: "2", name: "Ayam Bakar", time: 30 },
  { id: "3", name: "Salad Sayur", time: 10 },
];

export function getRecipes(): Recipe[] {
  return [...recipes];
}

export function addRecipe(name: string): Recipe {
  const newRecipe: Recipe = {
    id: Date.now().toString(),
    name,
    time: 15,
  };

  recipes = [...recipes, newRecipe];
  return newRecipe;
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}
