import { ItemMap } from "@/types"

let items: ItemMap | null = null

const useItems = () => {
    fetch("/data/items.json", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        items = res
      });
}

export default useItems