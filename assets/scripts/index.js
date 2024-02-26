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

const inputs = (fields=[], startIndex) => {
    const endIndex = startIndex + word.length;
    const arr = [];

    for (let i = startIndex; i < endIndex; i++) {
        arr.push(fields[i]);
    }

    return arr;
}

const checkIfRowIsFilled = (fields=[], word) => {
    const endIndex = word.length;

    for (let i = 0; i < endIndex; i++) {
        if (!fields[i].value) return;
    }

    return true;
}

const numberOfTries = () => {
    let newTry = 0;
    return function clos(update){
        newTry += update;
        return newTry;
    }

}

const wordsRight = () => {
    let count = 0;
    return function clos(update){
        count += update;
        return count;
    }

}

const updateCount = wordsRight();

const updateTries = numberOfTries();

/* When user press enter */

document.addEventListener("keyup", (e) => {
    const enter = "Enter";

    if (e.code === enter) {
        const inputField = document.querySelectorAll(".js-inputField");
        const boxes = document.querySelectorAll(".js-card");
        const isRowFilled = checkIfRowIsFilled(inputField, word);

        if (isRowFilled) { 
            gameCheckers(word, inputField, updateCount);
            const wordsRight = updateCount(0);
            const tries = updateTries(1);
            console.log(wordsRight);
            if (wordsRight === word.length) {
                createCongratsDiv(word, tries, createInputs, addEventsToInputs, generateGrid);
                updateTries(-tries);
            }

            if (wordsRight !== word.length) {
                createNewRow(boxes, word, tries, createInputs);
                addEventsToInputs();

                const newInput = document.querySelector(".js-inputField");
                
                if (newInput) {
                    newInput.focus();
                }

            }   

            updateCount(-(wordsRight));
        }

        const tries = updateTries(0);
    
        if (tries === 4) {
            tryAgain(generateGrid, createInputs, addEventsToInputs, word)
        }
        

    }
})

/* simple checkers */

/* Creations utils */

function createNewRow(boxes, word, index, createInputs) {
    for (let i = 0; i < word.length; i++) {
        if (!boxes[i + index*word.length]) return;
        boxes[i + index*word.length].appendChild(createInputs());
    }
}

function createInputs() {
    const attributes = {
        type: "text",
        placeholder: "o",
        maxlength: "1",
        value: "",
    }

    const input = document.createElement("input");
    input.classList.add("text-field", "txt-color", "js-inputField");
    for (let [key, value] of Object.entries(attributes)) {
        input.setAttribute(key, value);
    }

    return input;
}

function createCongratsDiv(word, tryy, createInputs, addEvents, createGrid) {
    const wordle = document.querySelector("#Wordle");
    const template = document.querySelector("#template-congrats");
    const clone = template.content.cloneNode(true);
    
    clone.querySelector(".js-word").textContent = `"${word}"`;
    clone.querySelector(".js-tries").textContent = tryy;

    wordle.replaceChildren(clone);
    
    document.querySelector(".js-button").addEventListener("click", _ => {
        wordle.replaceChildren();
        createGrid(word, createInputs);
        addEvents();
    })

}


function tryAgain(createGrid, createInputs, addEvents, word) {
    const wordle = document.querySelector("#Wordle");
    const template = document.querySelector("#template-try-again");
    const clone = template.content.cloneNode(true);

    wordle.replaceChildren(clone);
    
    document.querySelector(".js-button").addEventListener("click", _ => {
        wordle.replaceChildren();
        createGrid(word, createInputs);
        addEvents();
    })
}

/* Event Utils */

function addEventsToInputs() {
    const inputField = document.querySelectorAll(".js-inputField");

    inputField.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const target = e.target;
            target.value = target.value.replace(/[^A-Za-z]/g, "");
        })

        input.addEventListener("keydown", (e) => {
            const target = e.target;
            const key = e.key.length === 1 ? e.key : "";

            if (e.code === "Backspace" && !target.value  && inputField[index - 1]) {
                inputField[index - 1].value = "";
            }

            if (inputField[index + 1] && target.value && key) {
                inputField[index + 1].value = key;
            }

        })

        input.addEventListener("keyup", (e) => {
            const target = e.target;
            if (target.value.length && inputField[index + 1]) {
                inputField[index + 1].focus();
            }

            if (e.code === "Backspace" && !target.value && inputField[index - 1]) {
                inputField[index - 1].focus();
            }

        })
    })

    return inputField;
}

function gameCheckers(word, inputs, wordsRight) {
    inputs.forEach((letter, index) => {
        setTimeout(()=>{
            const p = document.createElement("p");
            p.classList.add("letter", "txt-color");
            p.textContent = letter.value;
    
            if (letter.value.toLowerCase() === word[index].toLowerCase()) {
                letter.closest("div").style.backgroundColor = "var(--right-position)";
                letter.closest("div").replaceChildren(p);
                wordsRight(1);
    
            }
        
            if (word.includes(letter.value) && !(letter.value === word[index]) ) {
                letter.closest("div").style.backgroundColor = "var(--is-in-word)";
                letter.closest("div").replaceChildren(p);
            }
        
            if (!word.includes(letter.value)) {  
                letter.closest("div").style.backgroundColor = "var(--wrong-position)";
                letter.closest("div").replaceChildren(p);
            }
        }, 200*index)
        
})}