
/* 
    Generate random word: API that returns a random word. 
    Params: ?lang: language for the returned word
            ?length: word length to be returned
    */
const generateRandomWord = async (length) => {
    try {
        const url = "https://random-word.ryanrk.com/api/en/word/random/?length=" + length;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(response)
        }

        const data = await response.json();

        return data[0];
    } catch(err) {
        console.log("err")
        console.log(err);
    }
}

document.querySelectorAll(".js-chooseLengthBtn").forEach((data) => {
    data.addEventListener("click", async (e) => {
        const length = e.target.value;
        const randomWord = await generateRandomWord(length);

        document.querySelector("#Wordle").replaceChildren();

        generateGrid(randomWord, createInputs);
        addEventsToInputs(randomWord);

    })
})

document.querySelector(".js-customLengthBtn").addEventListener("click", async (e) => {
    const typedLength = parseInt(document.querySelector(".js-customLengthInput").value);

    if (!typedLength) {
        return window.alert("Please, type a valid length.");
        
    }

    if (typedLength > 25) {
        return window.alert("Word too big. The UI won't look good, sorry");

    }
    
    const randomWord = await generateRandomWord(typedLength);

    document.querySelector("#Wordle").replaceChildren();

    generateGrid(randomWord, createInputs);
    addEventsToInputs(randomWord);


})

function generateGrid(word="", createNewInputs) {
    const length = word.length;
    const wordle = document.querySelector("#Wordle");
    const frag = document.createDocumentFragment();

    for (let i = 0; i < length*4; i++) {
        const div = document.createElement("div");
        div.classList.add("js-card", "card", "m-card-style");

        if (i < word.length) {
            div.appendChild(createNewInputs());
        }

        frag.appendChild(div);
    }

    wordle.appendChild(frag);
    
    document.querySelectorAll(".js-inputField")[0].removeAttribute("disabled");

    document.documentElement.style.setProperty("--columns", length);
   

    return wordle;

} 

/*  checkIfRowIsFilled: will check if the current row in play is filled. Won't fire if there is a field without a value */
const checkIfRowIsFilled = (fields=[], word) => {
    const endIndex = word.length;

    for (let i = 0; i < endIndex; i++) {
        if (!fields[i].value) return;

    }

    return true;
}

/* Closure to update "newTry" on event fire */
const numberOfTries = () => {
    let newTry = 0;

    return function clos(update){
        newTry += update;
        return newTry;
    }
}

const updateTries = numberOfTries();

/* Closure to update "count" on event fire */

const lettersRight = () => {
    let count = 0;

    return function clos(update){
        count += update;
        return count;
    }
}

const updateLettersRightCount = lettersRight();

/* Will fire when the user press enter only */

function onUserFinishTyping(word){
    const inputFields = document.querySelectorAll(".js-inputField");
    const boxes = document.querySelectorAll(".js-card"); // Stores every input field parent in play
    console.log("hi")
    gameCheckers(word, inputFields, updateLettersRightCount); // Check if the letters are in correct place or if the letters exists in the word or if the letters are inexistent in the word.
    
    setTimeout(()=>{
        const currentLettersRight = updateLettersRightCount(0); /* stores current value of updateLettersRightCount */
    
        const tries = updateTries(1); // updates the number of tries
        if (currentLettersRight === word.length) { // check if user guessed the right word
            createCongratsDiv(word, tries, createInputs, addEventsToInputs, generateGrid, generateRandomWord); // Generates new DOM in <main> tag to congrats the user for guessing the word right
            updateLettersRightCount(-(currentLettersRight)); // resets number of correct words
            updateTries(-tries); // resets number of tries
        }

        if (currentLettersRight !== word.length) { // Check if user didn't guess the word right. Helps preventing from creating new input fields if user guess the word
            createNewRow(boxes, word, tries, createInputs);  // Create new rows
            addEventsToInputs(word); // add events to the new inputs

            const newInput = document.querySelector(".js-inputField"); // select first new input to focus on it
            
            if (newInput) {
                newInput.focus();
            }
        }
                    
        updateLettersRightCount(-(currentLettersRight));
    }, 200*(word.length-1)) 

    setTimeout(()=> {
        const tries = updateTries(0); // stores current number of tries

        if (tries === 4) { // Will finish the game if maximum number of tries is reached
            tryAgain(generateGrid, createInputs, addEventsToInputs, word) // create new dom in according
            updateTries(-tries); // reset number of tries

        }
    }, 2000);
   
}

/* simple checkers */

/* Creations utils */

/*  createNewRow: will insert input: text tags on the next row.
    Params:
        boxes: all <div> boxes of the grid
        word: the current word in play
        index: index, the current number of try - 1
        createInputs: will create input tags to append on the current div

    */
function createNewRow(boxes, word, index, createInputs) { 
    for (let i = 0; i < word.length; i++) {
        if (!boxes[i + index*word.length]) return;
        boxes[i + index*word.length].appendChild(createInputs());
    }

    document.querySelectorAll(".js-inputField")[0].removeAttribute("disabled");
}

/* create <input type="text"> tags when called */
function createInputs(events) {
    const attributes = {
        type: "text",
        placeholder: "o",
        maxlength: "1",
        value: "",
        disabled: "true"
    }

    const input = document.createElement("input");
    input.classList.add("text-field", "txt-color", "js-inputField");
    
    for (let [key, value] of Object.entries(attributes)) {
        input.setAttribute(key, value);
    }

    return input;
}

/*  Function to create new DOM once user guess the word right. create based on templates
    params:
            word: current word in game, the guessed word
            tryy: number of tries
            createInputs: will create new inputs
            addEvents: will add event listeners to the new inputs
            createGrid: will generate a new grid based on the new word
            generateWord: will generate a new word. createCongratsDiv() is async because generateWord() is an asynchronous function
    */
async function createCongratsDiv(word, tryy, createInputs, addEvents, createGrid, generateWord) {
    const newWord = await generateWord();
    const wordle = document.querySelector("#Wordle");
    const template = document.querySelector("#template-congrats");
    const clone = template.content.cloneNode(true);
    
    clone.querySelector(".js-word").textContent = `"${word}"`;
    clone.querySelector(".js-tries").textContent = tryy;

    wordle.replaceChildren(clone);
    
    document.querySelector(".js-button").addEventListener("click", _ => {
        wordle.replaceChildren();
        createGrid(newWord, createInputs);
        addEvents();
    })

}

/*  Function to create new DOM once user reaches maximum number of tries, create based on templates
    params:
            createGrid: will generate the grid again based on the current word
            createInputs: will create new inputs
            addEvents: will add event listeners to the new inputs
            word: current word in game
    */

function tryAgain(createGrid, createInputs, addEvents, word) {
    const wordle = document.querySelector("#Wordle");
    const template = document.querySelector("#template-try-again");
    const clone = template.content.cloneNode(true);

    wordle.replaceChildren(clone);
    
    document.querySelector(".js-button").addEventListener("click", _ => {
        wordle.replaceChildren();
        createGrid(word, createInputs);
        addEvents(word);
    })
}

/* Will add keydown event listeners to the current input type text tags in play */
function addEventsToInputs(word) {
    const inputField = document.querySelectorAll(".js-inputField");

    inputField.forEach((input, index) => {
        input.addEventListener("input", (e) => { // event to allow letters only
            const target = e.target;
            
            target.value = target.value.toLowerCase();

            target.value = target.value.replace(/[^A-Za-z]/g, "");


        })

        input.addEventListener("keyup", (e) => { // fires when user press the key down
            const target = e.target;
            if (target.value.length > 0) {
                target.setAttribute("disabled", "true");
                target.style.cursorEvents = "none";

                if (inputField[index+1]) {
                    inputField[index+1].removeAttribute("disabled");
                    inputField[index+1].focus();

                }
                
            }

            if (inputField[index-1] && e.key === "Backspace") {
                target.setAttribute("disabled", true);
                inputField[index-1].removeAttribute("disabled");
                inputField[index-1].value = "";
                inputField[index-1].focus();

            }

            if (!inputField[index+1]) {
                const isRowFilled = checkIfRowIsFilled(inputField, word);
                
                if (isRowFilled) {

                    onUserFinishTyping(word);

                } else {
                    inputField[index].removeAttribute("disabled");
                    inputField[index].value = "";
                    inputField[index].focus();
                    
                }

            }
            
        })

       
    })

    return inputField;
}

/* Will fire based on the statements. 
    word: current word in play
    inputs: existing input fields
    wordsRight: updateCount() closure
*/
function gameCheckers(word, inputs, lettersRight) {
    inputs.forEach((letter, index) => {
        const p = document.createElement("p"); // will be appended on the current div to replace the current input: text, so the user can't type on it
        p.classList.add("letter", "txt-color");
        p.textContent = letter.value; 
        setTimeout(()=>{
        
            if (letter.value.toLowerCase() === word[index].toLowerCase()) { // check if letter is correct and in the right place
                letter.closest("div").style.backgroundColor = "var(--right-position)";
                letter.closest("div").replaceChildren(p); 
                lettersRight(1); // will update the number of letters right
    
            }
        
            if (word.includes(letter.value) && !(letter.value === word[index]) ) { // check if letter exists in current word, but is not in the right place
                letter.closest("div").style.backgroundColor = "var(--is-in-word)";
                letter.closest("div").replaceChildren(p);
            }
        
            if (!word.includes(letter.value)) {  // checks if word doesn't exists in current word
                letter.closest("div").style.backgroundColor = "var(--wrong-position)";
                letter.closest("div").replaceChildren(p);
            }
        }, 200*index)
        
})}


