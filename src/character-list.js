const placeCharacters = (async () => {
    const num_of_chars = await window.api.fetchCharLength();
    const container = document.getElementById("card-grid");

    for (i = 0; i < num_of_chars; i++) {
        let currentChar = await window.api.fetchChar(i);
        console.log(i, currentChar);
        let character = document.createElement("div");
        character.id = "character";
        character.innerText = currentChar;

        container.appendChild(character);
    }
})

placeCharacters();