let keyboard;
let guesses;
let currWord;
let SPACING;
let SCALE;
let GUESS_SCALE;
let KEYBOARD_SCALE;
let x0, y0;
let BACKGROUND_COLOR = '#505050';
let restart;

function setup() {
    setScale();
    setupCore();
    createCanvas(windowWidth, windowHeight);
    noLoop();
}

function setScale() {
    SCALE = windowHeight * 4 / 3;
    GUESS_SCALE = SCALE * 3 / 40;
    KEYBOARD_SCALE = SCALE / 20;
    SPACING = GUESS_SCALE / 10;

    x0 = windowWidth / 2 - 2.5 * GUESS_SCALE;
    y0 = 0.5 * GUESS_SCALE;
}

function setupCore() {
    keyboard = new Keyboard(pickWord(), KEYBOARD_SCALE, windowWidth / 2, GUESS_SCALE * 7.125);

    guesses = []
    currWord = ""
    restart = false;

    draw();
}

function draw() {
    background(BACKGROUND_COLOR);
    displayGuesses();
    keyboard.display();
}

function displayGuesses() {
    let word, i;
    rectMode(CENTER);
    textSize(GUESS_SCALE / 2);
    textAlign(CENTER, CENTER);

    for (i = 0; i < guesses.length; i++) {
        word = guesses[i];
        let colors = keyboard.getColors(word);
        for (let j = 0; j < word.length; j++) {
            stroke(colors[j]);
            if (colors[j] !== Keyboard.USED_COLOR[Keyboard.NOT_IN_WORD]) {
                fill(colors[j]);
                rect(j * GUESS_SCALE + x0, i * GUESS_SCALE + y0, GUESS_SCALE - SPACING, GUESS_SCALE - SPACING, SPACING);
                fill(BACKGROUND_COLOR);
            } else {
                noFill();
                rect(j * GUESS_SCALE + x0, i * GUESS_SCALE + y0, GUESS_SCALE - SPACING, GUESS_SCALE - SPACING, SPACING);
                fill(colors[j]);
            }
            text(word.charAt(j), j * GUESS_SCALE + x0, i * GUESS_SCALE + y0);
        }
    }
    if (guesses.length >= 6 && guesses[guesses.length] !== keyboard.word) {
        textSize(GUESS_SCALE / 2);
        stroke(Keyboard.USED_COLOR[Keyboard.UNUSED]);
        for (let j = 0; j < keyboard.word.length; j++) {
            noFill();
            rect(j * GUESS_SCALE + x0, 7 * GUESS_SCALE + 3 * KEYBOARD_SCALE, GUESS_SCALE - SPACING, GUESS_SCALE - SPACING, SPACING);
            fill(Keyboard.USED_COLOR[Keyboard.UNUSED]);
            text(keyboard.word.charAt(j), j * GUESS_SCALE + x0, 7 * GUESS_SCALE + 3 * KEYBOARD_SCALE);
        }
        return;
    }

    //current word
    stroke(Keyboard.UNUSED);
    word = currWord;
    while (word.length < 5) word += " ";
    for (let j = 0; j < word.length; j++) {
        noFill();
        rect(j * GUESS_SCALE + x0, i * GUESS_SCALE + y0, GUESS_SCALE - SPACING, GUESS_SCALE - SPACING, SPACING);
        fill(Keyboard.UNUSED);
        text(word.charAt(j), j * GUESS_SCALE + x0, i * GUESS_SCALE + y0);
    }

    // remaining squares
    noFill();
    for (let i = guesses.length + 1; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            rect(j * GUESS_SCALE + x0, i * GUESS_SCALE + y0, GUESS_SCALE - SPACING, GUESS_SCALE - SPACING, SPACING);
        }
    }
}

function keyReleased() {
    if (restart) {
        if (key === "Enter")
            setupCore();
    } else if (key === "Enter" && currWord.length === 5 && isWord(currWord)) {
        guesses.push(currWord);
        keyboard.update(currWord);

        if (currWord === keyboard.word || guesses.length === 6) restart = true;

        currWord = "";
    } else if (key === "Backspace" && currWord.length > 0) {
        currWord = currWord.slice(0, currWord.length - 1);
    }
    else if (key.length === 1 && currWord.length < 5) {
        let ch = key.toUpperCase().charCodeAt(0);
        if (ch >= 65 && ch <= 90) {
            currWord += key.toUpperCase();
        }
    }
    draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setScale();
    keyboard.resize(KEYBOARD_SCALE, windowWidth / 2, GUESS_SCALE * 7.125);
}