let index = 0;
let onTranslation = false;

const card_content = document.getElementById("card-container");
const reveal = document.getElementById("reveal");
const left_nav_button = document.getElementById("card-navigation").children[0];
const right_nav_button = document.getElementById("card-navigation").children[1];

const fetchPhrases = (async () => {
  const arr = await window.api.fetchPhrases();
  return arr;
});

const fetchTranslations = (async () => {
  const arr = await window.api.fetchTranslations();
  return arr;
})

document.addEventListener("DOMContentLoaded", (async () => {
  const phrase_list = await fetchPhrases();
  card_content.innerHTML = phrase_list[0];
}))

reveal.addEventListener("click", (async () => {
  const translation_list = await fetchTranslations();
  const phrase_list = await fetchPhrases();

  onTranslation = !onTranslation;

  if (onTranslation) { 
    card_content.innerHTML = translation_list[index];
    reveal.innerHTML = "Show Original";
  } else {
    card_content.innerHTML = phrase_list[index];
    reveal.innerHTML = "Reveal Translation";
  }

}));

left_nav_button.addEventListener("click", (async () => {
  const translation_list = await fetchTranslations();
  const phrase_list = await fetchPhrases();

  if (index !== 0) {
    index -= 1;
    if (onTranslation) { 
      card_content.innerHTML = translation_list[index];
    } else {
      card_content.innerHTML = phrase_list[index];
    }
  }
}));

left_nav_button.addEventListener("keydown", (async (event) => {
  if (event.key == "ArrowLeft") {
    const translation_list = await fetchTranslations();
    const phrase_list = await fetchPhrases();

    if (index !== 0) {
      index -= 1;
      if (onTranslation) { 
        card_content.innerHTML = translation_list[index];
      } else {
        card_content.innerHTML = phrase_list[index];
      }
    }
  }
}));

right_nav_button.addEventListener("click", (async () => {
  const translation_list = await fetchTranslations();
  const phrase_list = await fetchPhrases();

  if (index !== phrase_list.length - 1) {
    index++;
    if (onTranslation) { 
      card_content.innerHTML = translation_list[index];
    } else {
      card_content.innerHTML = phrase_list[index];
    }
  }
}));

right_nav_button.addEventListener("keydown", (async (event) => {
  if (event.key == "ArrowRight") {
    const translation_list = await fetchTranslations();
    const phrase_list = await fetchPhrases();

    if (index !== phrase_list.length - 1) {
      index++;
      if (onTranslation) { 
        card_content.innerHTML = translation_list[index];
      } else {
        card_content.innerHTML = phrase_list[index];
      }
    }
  }
}));