const domLoaded = (cb) => {
    document.addEventListener("DOMContentLoaded", () => {
        console.log("The DOM is fully loaded.");
        cb();
    });
};

let dogBreeds;

async function dogData() {
    try {
        const response = await fetch('http://localhost:3000/data');
        if (response.ok) {
            const data = await response.json();
            dogBreeds = data;

            const randomSubset = dogBreeds.sort(() => 0.5 - Math.random()).slice(0, 10);
            populateDogList(randomSubset);
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateDogList(data) {
    const dogList = document.getElementById("dog-list");
    dogList.innerHTML = "";

    data.forEach(dog => {
        const listedDog = document.createElement("div");
        listedDog.classList.add("listed-dog");

        const dogImage = document.createElement("img");
        dogImage.classList.add("dog-images");
        dogImage.src = dog.attributes.image || "https://img.freepik.com/free-vector/flat-design-animals-silhouette-set_23-2149513829.jpg";
        dogImage.alt = `${dog.attributes.name} image`;

        dogImage.onerror = () => {
            dogImage.src = "https://img.freepik.com/free-vector/flat-design-animals-silhouette-set_23-2149513829.jpg";
            console.warn(`Image for ${dog.attributes.name} is broken. Setting placeholder.`);
        };

        const nameDisplay = document.createElement('div');
        nameDisplay.classList.add("name-display");
        nameDisplay.textContent = dog.attributes.name;

        dogImage.addEventListener("mouseover", () => {
            let descriptionDiv = listedDog.querySelector(".dog-description");
            if (!descriptionDiv) {
                descriptionDiv = document.createElement('div');
                descriptionDiv.classList.add("dog-description");
                descriptionDiv.innerText = dog.attributes?.description || "No description available.";
                listedDog.appendChild(descriptionDiv);
            }
        });

        dogImage.addEventListener("mouseleave", () => {
            const descriptionDiv = listedDog.querySelector(".dog-description");
            if (descriptionDiv) {
                descriptionDiv.remove();
            }
        });

        listedDog.appendChild(nameDisplay);
        listedDog.appendChild(dogImage);
        dogList.appendChild(listedDog);
    });
}

function setupSearch() {
    const inputBox = document.getElementById("breed-name-input");
    const searchButton = document.getElementById("search-button");
    const resetButton = document.getElementById("reset-button");

    searchButton.addEventListener("click", () => {
        const searchQuery = inputBox.value.trim().toLowerCase();

        const filteredBreeds = dogBreeds.filter(dog =>
            dog.attributes.name.toLowerCase().includes(searchQuery)
        );

        populateDogList(filteredBreeds);
    });

    resetButton.addEventListener("click", () => {
        const randomSubset = dogBreeds.sort(() => 0.5 - Math.random()).slice(0, 10);
        populateDogList(randomSubset);
        inputBox.value = "";
    });
}

domLoaded(() => {
    dogData();
    setupSearch();

});

