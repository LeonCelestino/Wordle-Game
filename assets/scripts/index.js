const word = "wordle";

const generateGrid = (word="") => {
    const length = word.length;
    const wordle = document.querySelector("#Wordle");
    const frag = document.createDocumentFragment();
    for (let i = 0; i < length*4; i++) {
        const div = document.createElement("div");
        const textField = document.createElement("input");
        div.classList.add("js-card", "card", "m-card-style");
        textField.classList.add("text-field", "js-inputField");
        textField.setAttribute("type", "text");
        textField.setAttribute("placeholder", "o");
        textField.setAttribute("maxlength", "1");
        textField.setAttribute("value", "");
        textField.setAttribute("data-elfocus", `${i}`);
        div.appendChild(textField);
        frag.appendChild(div);
    }

    wordle.appendChild(frag);

    const card = document.querySelector(".js-card");
    document.documentElement.style.setProperty("--columns", length);

    const cardRect = card.getBoundingClientRect();
    const newHeight = cardRect.width / 16;

    document.documentElement.style.setProperty("--row-size", `${newHeight}rem`);
} 

generateGrid(word);

const inputField = document.querySelectorAll(".js-inputField");

inputField.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        const target = e.target;
        target.value = target.value.replace(/[^A-Za-z]/g, "");
    })
})

inputField.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
        const target = e.target;
        const key = e.key.length === 1 ? e.key : "";

        if (e.code === "Backspace" && !target.value  && inputField[index - 1]) {
            inputField[index - 1].value = "";
        }

        if (target.value && key) {
            inputField[index + 1].value = key;
        }

    })

    input.addEventListener("keyup", (e) => {
        const target = e.target;
        if (target.value.length) {
            inputField[index + 1].focus();
        }

        if (e.code === "Backspace" && !target.value) {
            inputField[index - 1].focus();
        }

    })
})

const inputs = (fields=[], startIndex) => {
    const endIndex = startIndex + word.length;
    const arr = [];

    for (let i = startIndex; i < endIndex; i++) {
        arr.push(fields[i]);
    }

    return arr;
}


const checkIfRowIsFilled = (fields=[], startIndex) => {
    const endIndex = startIndex + word.length;

    for (let i = startIndex; i < endIndex; i++) {
        if (!fields[i].value) return;
    }

    return true;
}

const checkLettersInCorrectPlace = (word, inputs) => {
    inputs.forEach((letter, index) => {
        if (letter.value.toLowerCase() === word[index].toLowerCase()) {
            letter.closest("div").style.backgroundColor = "var(--right-position)";
        }
    })
}

const isLetterInWord = (word, inputs) => {
    inputs.forEach((letter, index) => {
        if (word.includes(letter.value) && !(letter.value === word[index]) ) {  
            letter.closest("div").style.backgroundColor = "var(--is-in-word)";
        }
    })
}

const isLetterWrong = (word, inputs) => {
    inputs.forEach((letter) => {
        if (!word.includes(letter.value)) {  
            letter.closest("div").style.backgroundColor = "var(--wrong-position)";
        }
    })
}

/* TODO:
        Check if first row is entirely filled,
        Compare positions of the letters with the position of "Word"
        Handle styling according with if the letter exists in the word, if it exists and is in the correct position and if it doesn't exists
    */

document.addEventListener("keyup", (e) => {
    const enter = "Enter";
    const isRowFilled = checkIfRowIsFilled(inputField, 0);
    if (e.code === enter && isRowFilled) {
        checkLettersInCorrectPlace(word, inputs(inputField, 0));
        isLetterInWord(word, inputs(inputField, 0));
        isLetterWrong(word, inputs(inputField, 0));
        console.log(isRowFilled);
    }
})


