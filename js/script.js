let wordSearch = document.querySelector("#word-to-search");
const searchBtn = document.querySelector("#search-btn"),
  result = document.querySelector("#result"),
  history = document.querySelector("#word-history"),
  menuBtn = document.querySelector('.menu');

// Search for a word

const searchWord = async () => {
  let words = wordSearch.value.trim();
  let wordHistoryArr = [];

  result.textContent = ''

  const loadingDiv = document.querySelector(".loading-screen");
  loadingDiv.style.display = "flex";

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${words}`
    );
    const data = await response.json();

    loadingDiv.style.display = "none";

    let wordHistoryArr = JSON.parse(localStorage.getItem("cachedWordsHistory")) || [];
    wordHistoryArr.push(data);
    localStorage.setItem("cachedWords", JSON.stringify(data));
    localStorage.setItem("cachedWordsHistory", JSON.stringify(wordHistoryArr));

    // Checking  if data is an array
    if (Array.isArray(data)) {
      data.forEach((word) => {
        const wordDiv = document.createElement("div");
        wordDiv.classList.add("output-data");


       const  h3Word = document.createElement("h3");
        h3Word.classList.add("word");    

        h3Word.textContent = `Word: ${word.word}`
      

        const spanPhonetic = document.createElement("p");
        spanPhonetic.textContent = `Phonetic: ${word.phonetic}`; // Access the phonetic property

        const definitionsDiv = document.createElement("div");
        definitionsDiv.classList.add("definitions");

        word.meanings.forEach((meaning) => {
          meaning.definitions.forEach((definition) => {
            const spanDefinition = document.createElement("p");
            spanDefinition.textContent = `Definition: ${definition.definition}`; // Access the definition property
            definitionsDiv.appendChild(spanDefinition);
          });

        })

          // Checking if 'audio' property exists before accessing it
          if (word.phonetics[0]?.audio) {
            const audioElement = document.createElement("audio");
            audioElement.setAttribute("src", word.phonetics[0].audio);
            wordDiv.appendChild(audioElement);
            audioElement.controls = true;
            audioElement.autoplay = true;
          }

        wordDiv.appendChild(h3Word);
        wordDiv.appendChild(spanPhonetic);
        wordDiv.appendChild(definitionsDiv);

        result.appendChild(wordDiv);

      });
    } else {
      console.log(data); 
    }
  } catch (error) {
    console.error(error);
  }
  wordSearch.value = "";
};


// Display menu 

menuBtn.addEventListener('click', () => {
  const menu = document.querySelector('nav');
  menu.classList.toggle('show-menu');
})



searchBtn.addEventListener("click", searchWord);

