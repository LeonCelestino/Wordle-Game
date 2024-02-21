const generateGrid = (word="") => {
    const length = word.length;
    const wordle = document.querySelector("#Wordle");
    const frag = document.createDocumentFragment();
    let j = 6;
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


generateGrid("wordle");


const inputField = document.querySelectorAll(".js-inputField");


inputField.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        const target = e.target;
        target.value = target.value.replace(/[^A-Za-z]/g, "");
    })
})

inputField.forEach((input, index) => {
    input.addEventListener("keyup", (e) => {
        const target = e.target;
        if (e.keyCode === 8 && !target.value) inputField[index - 1].focus();
        if (e.keyCode === 8 && !target.value && inputField[index - 1].value.length) inputField[index - 1].value = "";
        if (target.value.length) inputField[index + 1].focus();

    })
})


