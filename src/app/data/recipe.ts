export type Recipe = {
  id: number;
  name: string;
  time: string;
  ingredients: string[];
  steps: string[];
};

export const recipes: Recipe[] = [
  { id: 1, name: "Honey Garlic Salmon", time: "20 min",
    ingredients: ["Salmon fillet", "Madu", "Bawang putih", "Kecap asin"],
    steps: ["Campur madu, bawang putih, kecap", "Lumuri salmon", "Panggang 12 menit"] },
  { id: 2, name: "Nasi Goreng", time: "15 min",
    ingredients: ["Nasi putih", "Telur", "Bawang merah", "Kecap manis"],
    steps: ["Tumis bumbu", "Masukkan telur", "Tambah nasi dan kecap, aduk rata"] },
  { id: 3, name: "Sate Ayam", time: "25 min",
    ingredients: ["Dada ayam", "Tusuk sate", "Bumbu kacang", "Kecap manis"],
    steps: ["Potong dan tusuk ayam", "Bakar sambil diolesi bumbu", "Sajikan dengan sambal kacang"] },
  { id: 4, name: "Bakso", time: "15 min",
    ingredients: ["Bakso sapi", "Mie kuning", "Kaldu", "Seledri"],
    steps: ["Rebus kaldu", "Masukkan bakso dan mie", "Taburi seledri"] },
  { id: 5, name: "Mie Ayam", time: "10 min",
    ingredients: ["Mie telur", "Ayam cincang", "Kecap manis", "Daun bawang"],
    steps: ["Rebus mie", "Tumis ayam dengan kecap", "Tata di mangkuk"] },
];