const word = "wordle";

const generateGrid = (word="", createFirstInputs) => {
    const length = word.length;
    const wordle = document.querySelector("#Wordle");
    const frag = document.createDocumentFragment();
    for (let i = 0; i < length*4; i++) {
        const div = document.createElement("div");
        div.classList.add("js-card", "card", "m-card-style");

        if (i < word.length) {
            div.appendChild(createFirstInputs());
        }
        frag.appendChild(div);
    }

    wordle.appendChild(frag);
    document.documentElement.style.setProperty("--columns", length);

} 

generateGrid(word, createInputs);

addEventsToInputs();


const boxes = document.querySelectorAll(".js-card");

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
            const p = document.createElement("p");
            p.classList.add("letter");
            p.textContent = letter.value;
            letter.closest("div").style.backgroundColor = "var(--right-position)";
            letter.closest("div").replaceChildren(p);
        }
    })
}

const isLetterInWord = (word, inputs) => {
    inputs.forEach((letter, index) => {
        if (word.includes(letter.value) && !(letter.value === word[index]) ) {  
            const p = document.createElement("p");
            p.classList.add("letter");
            p.textContent = letter.value;
            letter.closest("div").style.backgroundColor = "var(--is-in-word)";
            letter.closest("div").replaceChildren(p);
        }
    })
}

const isLetterWrong = (word, inputs) => {
    inputs.forEach((letter) => {
        if (!word.includes(letter.value)) {  
            const p = document.createElement("p");
            p.classList.add("letter");
            p.textContent = letter.value;
            letter.closest("div").style.backgroundColor = "var(--wrong-position)";
            letter.closest("div").replaceChildren(p);
        }
    })
}

const createNewRow = (boxes, word, index, createInputs) => {
    for (let i = 0; i < word.length; i++) {
        boxes[i + index*word.length].appendChild(createInputs());
    }
}

const numberOfTries = () => {
    let newTry = 0;
    return function clos(update){
        newTry += update;
        return newTry;
    }

}

const updateTries = numberOfTries();

/* When user press enter */

document.addEventListener("keyup", (e) => {
    const enter = "Enter";

    if (e.code === enter) {
        const inputField = document.querySelectorAll(".js-inputField");
        const isRowFilled = checkIfRowIsFilled(inputField, 0);
        const tries = updateTries(1);

        if (isRowFilled && tries < 5) {
            checkLettersInCorrectPlace(word, inputs(inputField, 0));
            isLetterWrong(word, inputs(inputField, 0));
            isLetterInWord(word, inputs(inputField, 0));
            createNewRow(boxes, word, tries, createInputs);
            addEventsToInputs();

            const newInput = document.querySelector(".js-inputField");
            newInput.focus();

        }

    }
})


function addEventsToInputs() {
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

    return inputField;
}


function createInputs() {
    const attributes = {
        type: "text",
        placeholder: "o",
        maxlength: "1",
        value: "",
    }
    const input = document.createElement("input");
    input.classList.add("text-field", "js-inputField");
    for (let [key, value] of Object.entries(attributes)) {
        input.setAttribute(key, value);
    }

    return input;
}