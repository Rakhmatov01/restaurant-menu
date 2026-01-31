import "./App.css";

const Foods = [
  {
    name: "Taomlar",
    items: [
      { name: "Shashlik", image: "shashlik.png", cost: 180000 },
      { name: "Tabaka", image: "tabaka.png", cost: 10000 },
      { name: "Baliq", image: "baliq.png", cost: 200000 },
      { name: "Osh", image: "osh.png", cost: 30000 },
      { name: "Sho'rva", image: "sho'rva.png", cost: 20000 },
    ],
  },
  {
    name: "Salatlar",
    items: [
      { name: "Olivia", image: "olivia.png", cost: 40000 },
      { name: "Mujiskoy", image: "mujiskoy.png", cost: 20000 },
      { name: "Achichu", image: "achichu.png", cost: 20000 },
      { name: "Suzma", image: "osh.png", cost: 30000 },
    ],
  },
  {
    name: "Suvlar",
    items: [
      { name: "Kola", image: "kola.png", cost: 18000 },
      { name: "Fanta", image: "fanta.png", cost: 10000 },
      { name: "Pepsi", image: "pepsi.png", cost: 20000 },
      { name: "Sok", image: "sok.png", cost: 10000 },
      { name: "Bezgaz", image: "bezgaz.png", cost: 10000 },
    ],
  },
];
export default function App() {
  const path = window.location.pathname;
  const id = path.replace("/", "");
  const foodArray = Foods;
  if (id !== null) {
    return (
      <div className="container">
        <h3>Table number {id}</h3>
        <form className="starting-page">
          <label>Enter your name : </label>
          <input type="text" />
          <button>Send</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="app">
        <Navbar foodArray={foodArray} />
      </div>
    );
  }
}

function Navbar({ foodArray }) {
  return (
    <>
      <img src="" alt="Logo" />
      <FoodList foodArray={foodArray} />
    </>
  );
}

function FoodList({ foodArray }) {
  return (
    <ul>
      <li>{foodArray[0].name}</li>
    </ul>
  );
}
