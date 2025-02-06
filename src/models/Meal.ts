import { FoodComponent } from "./FoodComponent";

export interface Meal {
    id: string;
    name: string;
    description: string;
    price: number | null;
    priceCurrency: string | null;
    imagePath: string;
    foodComponents: FoodComponent[];
}


export const dummyMeals: Meal[] = [
    {
      id: "meal1",
      name: "Grillet Kylling med Ris og Grøntsager",
      description: "En lækker grillet kyllingeservering med basmatiris og friske grøntsager.",
      price: 79.99,
      priceCurrency: "DKK",
      imagePath: "https://placehold.co/200x200",
      foodComponents: [
        { category: "Proteiner", items: ["Kyllingebryst"] },
        { category: "Kulhydrater", items: ["Basmatiris"] },
        { category: "Grøntsager", items: ["Broccoli", "Gulerod"] },
        { category: "Krydderier & Urter", items: ["Salt", "Sort peber", "Paprika"] }
      ]
    },
    {
      id: "meal2",
      name: "Steak med Bagt Kartoffel og Salat",
      description: "Saftig ribeye steak med bagt kartoffel og frisk salat.",
      price: 129.99,
      priceCurrency: "DKK",
      imagePath: "https://placehold.co/200x200",
      foodComponents: [
        { category: "Proteiner", items: ["Ribeye steak"] },
        { category: "Kulhydrater", items: ["Bagekartofler"] },
        { category: "Grøntsager", items: ["Salat", "Tomat"] },
        { category: "Krydderier & Urter", items: ["Salt", "Rosmarin"] }
      ]
    },
    {
      id: "meal3",
      name: "Vegetarisk Quinoa Buddha Bowl",
      description: "En sund og farverig Buddha Bowl med quinoa, kikærter og avocado.",
      price: 89.50,
      priceCurrency: "DKK",
      imagePath: "https://placehold.co/200x200",
      foodComponents: [
        { category: "Proteiner", items: ["Kikærter", "Tofu"] },
        { category: "Kulhydrater", items: ["Quinoa"] },
        { category: "Grøntsager", items: ["Spinat", "Cherrytomater", "Agurk"] },
        { category: "Fedtstoffer & Olier", items: ["Avocado", "Olivenolie"] },
        { category: "Krydderier & Urter", items: ["Sort peber", "Basilikum"] }
      ]
    },
    {
      id: "meal4",
      name: "Laks med Søde Kartofler og Asparges",
      description: "Ovnbagt laks med søde kartofler og sprøde asparges.",
      price: 119.00,
      priceCurrency: "DKK",
      imagePath: "https://placehold.co/200x200",
      foodComponents: [
        { category: "Proteiner", items: ["Laks"] },
        { category: "Kulhydrater", items: ["Søde kartofler"] },
        { category: "Grøntsager", items: ["Asparges", "Forårsløg"] },
        { category: "Fedtstoffer & Olier", items: ["Ekstra jomfru olivenolie"] },
        { category: "Krydderier & Urter", items: ["Havsalt", "Dild"] }
      ]
    },
    {
      id: "meal5",
      name: "Morgenmad Bowl med Havregryn og Bær",
      description: "En sund morgenmadsbowl med havregryn, blåbær og mandelsmør.",
      price: 49.00,
      priceCurrency: "DKK",
      imagePath: "https://placehold.co/200x200",
      foodComponents: [
        { category: "Kulhydrater", items: ["Havregryn"] },
        { category: "Frugter", items: ["Blåbær", "Banan"] },
        { category: "Fedtstoffer & Olier", items: ["Mandelbutter"] },
        { category: "Mejeriprodukter", items: ["Græsk yoghurt"] },
        { category: "Sødemidler", items: ["Honning"] }
      ]
    }
  ];
