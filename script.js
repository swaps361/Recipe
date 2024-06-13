document.addEventListener("DOMContentLoaded", () => {
    displayDefaultMeals();
});

function displayDefaultMeals() {
    const defaultMealURLs = [
        'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata',
        'https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken',
        'https://www.themealdb.com/api/json/v1/1/search.php?s=Salmon',
        'https://www.themealdb.com/api/json/v1/1/search.php?s=Salad',
        'https://www.themealdb.com/api/json/v1/1/search.php?s=Seafood',
        'https://www.themealdb.com/api/json/v1/1/search.php?s=Vegetarian',
    ];

    defaultMealURLs.forEach(url => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    const meal = data.meals[0];
                    const mealList = document.getElementById('meal-list');
                    const mealBox = document.createElement('div');
                    mealBox.classList.add('meal-box');
                    mealBox.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <h3>${meal.strMeal}</h3>
                        <button class="view-recipe-button" onclick="viewRecipe('${meal.idMeal}')">View Recipe</button>
                    `;
                    mealList.appendChild(mealBox);
                }
            })
            .catch(error => console.error('Error fetching the meal data:', error));
    });
}

function viewRecipe(mealID) {
    const apiURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;
    const mealDetails = document.getElementById('meal-details');

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                const meal = data.meals[0];
                const ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    if (meal[`strIngredient${i}`]) {
                        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
                    } else {
                        break;
                    }
                }

                mealDetails.innerHTML = `
                    <h2>${meal.strMeal}</h2>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 100%; height: auto;">
                    <h3>Ingredients:</h3>
                    <ul>
                        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                    <h3>Instructions:</h3>
                    <p>${meal.strInstructions}</p>
                `;

                // Scroll to recipe details
                document.getElementById('recipe-anchor').scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                mealDetails.innerHTML = '<p>Recipe not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching the recipe:', error);
            mealDetails.innerHTML = '<p>There was an error fetching the recipe. Please try again later.</p>';
        });
}

function searchMeal() {
    const mealInput = document.getElementById('meal-input').value;
    const mealDetails = document.getElementById('meal-details');
    const mealList = document.getElementById('meal-list');
    const recommendedMeals = document.getElementById('recommended-meals');
    mealDetails.innerHTML = '';
    recommendedMeals.innerHTML = '';
    mealList.classList.add('hidden');

    if (mealInput.trim() === '') {
        mealDetails.innerHTML = '<p>Please enter a meal name.</p>';
        return;
    }

    const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealInput}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                const meal = data.meals[0];
                const ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    if (meal[`strIngredient${i}`]) {
                        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
                    } else {
                        break;
                    }
                }

                mealDetails.innerHTML = `
                    <h2>${meal.strMeal}</h2>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 100%; height: auto;">
                    <h3>Ingredients:</h3>
                    <ul>
                        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                    <h3>Instructions:</h3>
                    <p>${meal.strInstructions}</p>
                    <a href="#meal-details" class="back-to-top">Back to Top</a>
                `;

                // Scroll to recipe details
                document.getElementById('recipe-anchor').scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Fetch and display three recommended meals
                for (let i = 0; i < 3; i++) {
                    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
                        .then(response => response.json())
                        .then(data => {
                            if (data.meals) {
                                const recommendedMeal = data.meals[0];
                                const mealBox = document.createElement('div');
                                mealBox.classList.add('meal-box');
                                mealBox.innerHTML = `
                                    <img src="${recommendedMeal.strMealThumb}" alt="${recommendedMeal.strMeal}">
                                    <h3>${recommendedMeal.strMeal}</h3>
                                    <button class="view-recipe-button" onclick="viewRecipe('${recommendedMeal.idMeal}')">View Recipe</button>
                                `;
                                recommendedMeals.appendChild(mealBox);
                            }
                        })
                        .catch(error => console.error('Error fetching the recommended meals:', error));
                }
            } else {
                mealDetails.innerHTML = '<p>No meals found. Please try another search.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching the meal data:', error);
            mealDetails.innerHTML = '<p>There was an error fetching the meal data. Please try again later.</p>';
        });
}


function searchOnEnter(event) {
    if (event.key === 'Enter') {
        searchMeal();
    }
}