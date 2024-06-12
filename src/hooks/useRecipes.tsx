import { ItemMap } from "@/types";

let recipes: ItemMap | null = null;

const useRecipes = () => {
  fetch("/data/recipes.json", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      recipes = res;
    });
};

export default useRecipes;
