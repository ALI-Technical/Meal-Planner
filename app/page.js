"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [weeks, setWeeks] = useState({ week1: [], week2: [], week3: [], week4: [] });
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const res = await fetch("https://dummyjson.com/recipes");
        const json = await res.json();
        setRecipes(json.recipes);
      } catch (error) {
        console.error(error);
      }
    };
    getRecipes();
  }, []);

  const addToWeek = (week) => {
    if (!weeks[week].some((meal) => meal.id === selectedMeal.id)) {
      setWeeks((prev) => ({ ...prev, [week]: [...prev[week], selectedMeal] }));
    }
    setShowModal(false);
  };

  const removeMeal = (week, mealId) => {
    setWeeks((prev) => ({
      ...prev,
      [week]: prev[week].filter((meal) => meal.id !== mealId),
    }));
  };

  return (
    <>
    <div className="bg-white flex justify-center">
      <div className="container flex justify-between p-5">
        <div className="">
          {["all", "week1", "week2", "week3", "week4"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-semibold p-5 text-gray-800 ${activeTab === tab ? "tab-active" : ""}`}
            >
              {tab === "all" ? "All Meals" : `Week ${tab.replace("week", "")}`}
            </button>
          ))}
        </div>
        <div className="border">
          <button className="">
            Add To Week
          </button>
        </div>
      </div>
    </div>
      <div className="container mx-auto p-4">

        <div className="mt-6">
          {activeTab === "all" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-sm"
                  onClick={() => {
                    setSelectedMeal(meal);
                    setShowModal(true);
                  }}
                >
                  <div className="relative">
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">Dinner</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {meal.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {/* {meal.description.substring(0, 160)}... */}
                    </p>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>
                        <strong>Cuisine:</strong> {meal.cuisine}
                      </span>
                      <span>
                        <strong>Rating:</strong> {meal.rating} ⭐⭐⭐⭐☆
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {["week1", "week2", "week3", "week4"].includes(activeTab) && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{`Week ${activeTab.replace("week", "")} Meals`}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeks[activeTab].length > 0 ? (
                  weeks[activeTab].map((meal) => (
                    <div key={meal.id} className="card bg-base-100 shadow-xl">
                      <img src={meal.image} alt={meal.name} className="w-full h-48 object-cover" />
                      <div className="card-body">
                        <h3 className="card-title">{meal.name}</h3>
                        <p>{meal.cuisine} | {meal.difficulty} | {meal.caloriesPerServing} cal</p>
                        <div className="card-actions justify-end">
                          <button
                            className="btn btn-error"
                            onClick={() => removeMeal(activeTab, meal.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No meals added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {showModal && selectedMeal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold">Select Week</h3>
              <p>{selectedMeal.name}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {["week1", "week2", "week3", "week4"].map((week) => (
                  <button
                    key={week}
                    className="btn btn-primary"
                    onClick={() => addToWeek(week)}
                  >
                    {`Week ${week.replace("week", "")}`}
                  </button>
                ))}
              </div>
              <button className="btn btn-error mt-4 w-full" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
