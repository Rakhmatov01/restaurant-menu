import { useEffect, useState } from "react";
import "./Menu.css";
import { getMenu as apiGetMenu, API_BASE } from "./api";

export default function Menu({ token, tableNumber }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuData, setMenuData] = useState(() => {
    const stored = localStorage.getItem("menuData");
    return stored ? JSON.parse(stored) : null;
  });
  console.log(menuData);
  function onHandleSelectedCategory(name) {
    setSelectedCategory(name);
  }

  useEffect(() => {
    if (menuData) return;
    async function getMenu() {
      try {
        const data = await apiGetMenu(token);

        const enrichedData = {
          customer_name: data.customer_name,
          categories: data.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            items: cat.items.map((item) => ({
              ...item,
              isAdded: false,
              quantity: 1,
            })),
          })),
        };

        setMenuData(enrichedData);
      } catch (error) {
        console.error("Menu fetch error:", error);
      }
    }

    if (token) {
      getMenu();
    }
  }, [token]);

  useEffect(() => {
    if (menuData) {
      localStorage.setItem("menuData", JSON.stringify(menuData));
    }
  }, [menuData]);

  if (!menuData) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  function onHandleAddToCard(id) {
    setMenuData((data) => {
      return {
        customer_name: data.customer_name,
        categories: data.categories.map((cat) => {
          return {
            id: cat.id,
            name: cat.name,
            items: cat.items.map((food) => {
              if (food.id === id)
                return {
                  id: food.id,
                  name: food.name,
                  image: food.image,
                  description: food.description,
                  price: food.price,
                  isAdded: true,
                  quantity: 1,
                };
              else return food;
            }),
          };
        }),
      };
    });
  }
  return (
    <div className="menu-body">
      <Header menuData={menuData} tableNumber={tableNumber} />
      <Categories
        menuData={menuData}
        handleSelectCategory={onHandleSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <DisplayCategory
        selectedCategory={selectedCategory}
        categories={menuData.categories}
        handleAddToCard={onHandleAddToCard}
      />
    </div>
  );
}

function Header({ menuData, tableNumber }) {
  return (
    <div className="header">
      <div>
        <h3>Table {tableNumber}</h3>
        <p>Welcome back, {menuData.customer_name}</p>
      </div>
      <h1>Buxoro Kafe</h1>
    </div>
  );
}

function Categories({ menuData, handleSelectCategory, selectedCategory }) {
  const numAdded = menuData.categories.reduce((acc, curr) => {
    return (
      acc +
      curr.items.reduce((acc2, curr2) => {
        return acc2 + (curr2.isAdded ? 1 : 0);
      }, 0)
    );
  }, 0);
  return (
    <div className="categories-container">
      <div className="categories-scrolling">
        <Category
          catName={"All"}
          handleSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />
        {menuData.categories.map((cat) => (
          <Category
            key={cat.id}
            catName={cat.name}
            handleSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
        ))}
      </div>
      <button className="savatcha-btn">Savatcha | {numAdded}</button>
    </div>
  );
}

function Category({ catName, handleSelectCategory, selectedCategory }) {
  return (
    <button
      className={`category-btn ${selectedCategory === catName && "selected"}`}
      onClick={() => handleSelectCategory(catName)}
    >
      {catName}
    </button>
  );
}

function DisplayCategory({ selectedCategory, categories, handleAddToCard }) {
  if (selectedCategory === "All")
    return (
      <div>
        {categories.map(
          (cat) =>
            cat.items.length !== 0 && (
              <div key={cat.id}>
                <h2 style={{ marginLeft: 40 }}>{cat.name}</h2>
                <CategoryGrid
                  chosenCategory={cat}
                  handleAddToCard={handleAddToCard}
                />
              </div>
            ),
        )}
      </div>
    );
  let chosenCategory;
  categories.forEach((e) => {
    if (e.name === selectedCategory) chosenCategory = e;
  });
  return (
    <CategoryGrid
      chosenCategory={chosenCategory}
      handleAddToCard={handleAddToCard}
    />
  );
}

function CategoryGrid({ chosenCategory, handleAddToCard }) {
  return (
    <div className="category-grid">
      {chosenCategory.items.map((food) => (
        <FoodCard key={food.id} food={food} handleAddToCard={handleAddToCard} />
      ))}
    </div>
  );
}

function FoodCard({ food, handleAddToCard }) {
  return (
    <div className="food-card" onClick={() => handleAddToCard(food.id)}>
      <img src={`${API_BASE}${food.image}`} alt={food.name} />
      <div className="card-info">
        <h3>{food.name}</h3>
        <p>{food.description}</p>
      </div>
      <div className="card-action">
        <h3>{food.price}</h3>
        <button
          style={food.isAdded ? { backgroundColor: "green" } : {}}
          onClick={() => handleAddToCard(food.id)}
        >
          {food.isAdded ? "Added ✅ " : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
