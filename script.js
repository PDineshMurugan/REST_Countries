var text=document.getElementById("text");
var element=document.body;
var img=document.getElementById("img");
const url='https://restcountries.com/v3.1/all';
const mainElement = document.querySelector("main");
function toggle(event){

    if(event.target){
    element.classList.toggle("dark-mode");
    img.classList.toggle("image");
    img.classList.toggle("image-white");
    console.log("hi");
    }
    //dark --> light text
    if(text.innerHTML.includes("Dark")){
        text.innerHTML=text.innerHTML.replace("Dark","Light");
    }
    else{
        text.innerHTML=text.innerHTML.replace("Light","Dark");
    }
}

function searchFunction(event) {
    var input, filter, cards, card, name, i;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();  // Get the value typed by the user
    cards = document.getElementsByClassName("card");  
  
 
    for (i = 0; i < cards.length; i++) {
      card = cards[i];
      name = card.querySelector(".content h2").textContent.toUpperCase();  
      
  
      if (name.indexOf(filter) > -1) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    }
  }
  
function home(e) {

    if (e.target) {
        window.location.href = "index.html";  
    }
}
  function addSearchListener(data) {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(event) {
      searchFunction(event);
    });
  }
const countriesContainer = document.getElementById("countries");

function fetchdata(){
    fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    displayCountries(data);
  })
  .catch(error => console.error("Error fetching countries data:", error));


function displayCountries(countries) {
  countriesContainer.innerHTML = ""; // Clear the container
  countries.forEach(country => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("card");
    countryCard.addEventListener("click",function(event){
      if(event){
        mainElement.remove();
       console.log(country.name.common);
       console.log(country);
       newcont(country);
      }
    })
    const countryName = country.name.common || "N/A";
    countryCard.textContent = countryName;
    const countryPopulation = country.population.toLocaleString() || "N/A";
    const countryCapital = country.capital ;
    const countryRegion= country.subregion ;
    const countryFlag = country.flags.png || "";

    countryCard.innerHTML = `
      <img src="${countryFlag}" alt="Flag of ${countryName}">
      <div class="content"><h2>${countryName}</h2>
      <p><strong>Population:</strong> ${countryPopulation}</p>
        <p><strong>Region:</strong> ${countryRegion}</p>
      <p><strong>Capital:</strong> ${countryCapital}</p></div>
    `;

    countriesContainer.appendChild(countryCard);
  });
}
}



function createBackButton() {
  const backButton = document.createElement("div");
  backButton.className = "back-button";
  
  // Style the back button div
  backButton.style.padding = "10px 20px";
  backButton.style.margin = "10px 0";
  backButton.style.cursor = "pointer";
  backButton.style.border = "1px solid #ccc";
  backButton.style.borderRadius = "5px";
  backButton.style.backgroundColor = "#f2f2f2";
  backButton.style.display = "inline-block";
  
  backButton.textContent = "Back";  // Text for the back button
  
  // Event listener for the back button click
  backButton.onclick = () => {
    // Go back to the original content without reloading the page
    document.body.innerHTML = '';  // Clear current content
    document.body.appendChild(previousContent);  // Add the previous content
  };

  return backButton;
}

let previousContent = document.body.cloneNode(true);

function newcont(country) {

  const detailsContainer = document.createElement("div");
  detailsContainer.className = "details-container";

  const leftContainer = document.createElement("div");
  leftContainer.className = "left-container";

  leftContainer.innerHTML = `
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag">
  `;

  const rightContainer = document.createElement("div");
  rightContainer.className = "right-container";

  const topSection = `
    <p><strong>Native Name:</strong> ${Object.values(country.name.nativeName || {}).map(n => n.common).join(", ")}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Subregion:</strong> ${country.subregion}</p>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
  `;

  const bottomSection = `
    <p><strong>Top-Level Domain:</strong> ${country.tld.join(", ")}</p>
    <p><strong>Currencies:</strong> ${
      Object.values(country.currencies || {})
        .map(currency => `${currency.name} (${currency.symbol})`)
        .join(", ")
    }</p>
    <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(", ")}</p>
  `;

  // Border Countries Section
  const borderCountriesDiv = document.createElement("div");
  borderCountriesDiv.className = "border-countries";

  const borderCountriesTitle = document.createElement("strong");
  borderCountriesTitle.textContent = "Border Countries:";
  borderCountriesDiv.appendChild(borderCountriesTitle);

  if (country.borders && country.borders.length > 0) {
    country.borders.forEach(async (border) => {
      // Fetch the name of the border country using the border code
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
      const borderData = await response.json();
      const borderCountryName = borderData[0].name.common;

      const borderDiv = document.createElement("div");
      borderDiv.className = "border-country";

      // Set the name of the border country inside the div
      borderDiv.textContent = borderCountryName;

      // Add click event to show alert with country name
      borderDiv.onclick = () => {
        newcont(borderData[0]);
        detailsContainer.remove();
      };

      // Append the border country div to the parent div
      borderCountriesDiv.appendChild(borderDiv);
    });
  } else {
    const noBorders = document.createElement("p");
    noBorders.textContent = "None";
    borderCountriesDiv.appendChild(noBorders);
  }

  // Append the border countries section to the main container
  rightContainer.appendChild(borderCountriesDiv);

  // Combine sections and add the border countries
  rightContainer.innerHTML =
    `<h1 class="country-name">${country.name.common}</h1>` +
    `<div class="bottom">
       <div class="top-section">${topSection}</div>
       <div class="bottom-section">${bottomSection}</div>
     </div>`;
  rightContainer.appendChild(borderCountriesDiv);

  // Append the left and right containers to the details container
  detailsContainer.appendChild(leftContainer);
  detailsContainer.appendChild(rightContainer);

  // Add the details container to the document
  document.body.appendChild(detailsContainer);
}

fetchdata();
toggle();



