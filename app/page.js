"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [recipes, setRecipes] = useState([]);
  const [weeks, setWeeks] = useState({ week1: [], week2: [], week3: [], week4: [] });
  const [selectedMeals, setSelectedMeals] = useState([]); // Stores multiple selected meals
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

  // Toggle meal selection
  const toggleMealSelection = (meal) => {
    setSelectedMeals((prev) => {
      const isSelected = prev.some((m) => m.id === meal.id);
      return isSelected ? prev.filter((m) => m.id !== meal.id) : [...prev, meal];
    });
  };

  // Add selected meals to a week
  const addToWeek = (week) => {
    setWeeks((prev) => {
      const updatedWeek = [...prev[week], ...selectedMeals.filter(meal => !prev[week].some(m => m.id === meal.id))];
      return { ...prev, [week]: updatedWeek };
    });
    setSelectedMeals([]); // Clear selection after adding
    setShowModal(false);
  };

  // Remove meal from a week
  const removeMeal = (week, mealId) => {
    setWeeks((prev) => ({
      ...prev,
      [week]: prev[week].filter((meal) => meal.id !== mealId),
    }));
  };

  return (
    <>
      <div className="bg-white flex justify-center">
        <div className="container">
          <div className="flex justify-center items-center gap-5">
            {["all", "week1", "week2", "week3", "week4"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab font-semibold p-5 text-gray-800 cursor-pointer ${activeTab === tab ? "tab-active" : ""}`}
              >
                {tab === "all" ? "All Meals" : `Week ${tab.replace("week", "")}`}
              </button>
            ))}
            <button
              className={`p-3 bg-[var(--foreground)] font-semibold font-sans text-white rounded transition ${selectedMeals.length === 0 ? "cursor-not-allowed" : "cursor-pointer hover:bg-blue-500"}`}
              onClick={() => setShowModal(true)}
              disabled={selectedMeals.length === 0}
            >
              Add To Week ({selectedMeals.length})
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
                  className={`bg-white cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-sm border-[3px] p-5 ${selectedMeals.some((m) => m.id === meal.id) ? "border-[var(--foreground)]" : "border-transparent"}`}
                  onClick={() => toggleMealSelection(meal)}
                >
                  <div className="relative">
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold text-[#191919] mb-2">
                      {meal.name}
                    </h3>
                    {
                      meal?.instructions?.map((instruction, index) => {
                        return (
                          <span key={index} className="text-gray-800">
                            {instruction} {" "}
                          </span>
                        )
                      })
                    }
                    <div className="my-3">
                      {
                        meal?.mealType?.map((type, index) => (
                          <span key={index} className="bg-black mr-1 text-white text-xs font-semibold px-3 py-1 rounded-md capitalize">{type}</span>
                        ))
                      }
                    </div>
                    <p className="text-gray-600 text-sm mb-4"></p>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span><strong>Cuisine:</strong> {meal.cuisine}</span>
                      <span><strong>Rating:</strong>
                        <Rater interactive={false} rating={meal.rating} total={5} />
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
                    <div
                      key={meal.id}
                      className={`bg-white cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-sm border-[3px] p-5 ${selectedMeals.some((m) => m.id === meal.id) ? "border-[var(--foreground)]" : "border-transparent"}`}
                      onClick={() => toggleMealSelection(meal)}
                    >
                      <div className="relative">
                        <Image
                          src={meal.image}
                          alt={meal.name}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button className="absolute top-5 left-5 rounded-md cursor-pointer bg-gray-500/80 transition-opacity p-2 hover:bg-gray-500/100 delay-500" onClick={() => removeMeal(activeTab, meal.id)}>
                          <FaTrashAlt color="#f16277"/>
                        </button>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-extrabold text-[#191919] mb-2">
                          {meal.name}
                        </h3>
                        {meal?.instructions?.map((instruction, index) => (
                          <span key={index} className="text-gray-800">
                            {instruction}{" "}
                          </span>
                        ))}
                        <div className="my-3">
                          {meal?.mealType?.map((type) => (
                            <span key={type} className="bg-black mr-1 text-white text-xs font-semibold px-3 py-1 rounded-md capitalize">
                              {type}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm mb-4"></p>
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                          <span><strong>Cuisine:</strong> {meal.cuisine}</span>
                          <span><strong>Rating:</strong> {meal.rating} ⭐⭐⭐⭐☆</span>
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

        {showModal && selectedMeals.length > 0 && (
          <div className="fixed inset-0 flex items-center bg-gray-500/75 transition-opacity justify-center animate__animated animate__fadeInDown">
            <div className="bg-white p-6 rounded-lg shadow-lg w-2xl">
              <h3 className="text-xl font-bold text-[#191919] text-center">Select Week</h3>
              {/* <p>{selectedMeals.length} meal(s) selected</p> */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {["week1", "week2", "week3", "week4"].map((week) => (
                  <button
                    key={week}
                    className="btn btn-primary font-semibold text-[#191919] cursor-pointer bg-gray-300 rounded-lg p-3 transition hover:bg-[#cfecff]"
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
