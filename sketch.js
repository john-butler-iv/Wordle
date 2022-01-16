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

/**
 * setup scale variables
 */
function setScale() {
    SCALE = windowHeight * 4 / 3;
    GUESS_SCALE = SCALE * 3 / 40;
    KEYBOARD_SCALE = SCALE / 20;
    SPACING = GUESS_SCALE / 10;

    x0 = windowWidth / 2 - 2.5 * GUESS_SCALE;
    y0 = 0.5 * GUESS_SCALE;
}

/**
 * initializes/resets variables
 */
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

/**
 * displays all previeous guesses, the current word, and empty squares for the future guesses. 
 * If the player lost, then the answer is shown too.
 */
function displayGuesses() {
    let word, i;
    rectMode(CENTER);
    textSize(GUESS_SCALE / 2);
    textAlign(CENTER, CENTER);

    for (i = 0; i < guesses.length; i++) {
        // it's technically more efficient to store the colors so I don't have to recompute every letter's color on every draw
        // I'm having no issues with speed though, so I don't want to bother.
        drawWord(guesses[i], x0, i * GUESS_SCALE + y0, keyboard.getColors(guesses[i]));
    }
    if (guesses.length >= 6 && guesses[guesses.length] !== keyboard.word) {
        drawWord(keyboard.word, x0, 7 * GUESS_SCALE + 3 * KEYBOARD_SCALE);
        return;
    }

    drawWord(currWord, x0, i * GUESS_SCALE + y0);

    noFill();
    for (i = guesses.length + 1; i < 6; i++) {
        drawWord('', x0, i * GUESS_SCALE + y0);
    }
}
/**
 * draws one word at (x,y) colored according to colors. If colors is not provided, or is not long enough, UNUSED will be used.
 * If word is less than 5 letters, spaces are appended to the end of the word.
 * @param {string} word the word to be drawn
 * @param {number} x the x coordinate of the center of the first square
 * @param {number} y the y corrdinate of the center of the squares
 * @param {string[]?} colors the colors to write the letters of the word in
 */
function drawWord(word, x, y, colors) {
    const UNUSED_COLOR = Keyboard.USED_COLOR[Keyboard.UNUSED];
    const NOT_IN_WORD_COLOR = Keyboard.USED_COLOR[Keyboard.NOT_IN_WORD];

    while (word.length < 5) word += ' ';
    for (let j = 0; j < word.length; j++) {
        let color = (colors === undefined || colors[j] === undefined) ? UNUSED_COLOR : colors[j];
        stroke(color);
        if (color === NOT_IN_WORD_COLOR || color === UNUSED_COLOR) {
            noFill();
            rect(j * GUESS_SCALE + x, y, GUESS_SCALE - SPACING, GUESS_SCALE - SPACING, SPACING);
            fill(color);
        } else {
            fill(color);
            rect(j * GUESS_SCALE + x, y, GUESS_SCALE - SPACING, GUESS_SCALE - SPACING, SPACING);
            fill(BACKGROUND_COLOR);
        }
        text(word.charAt(j), j * GUESS_SCALE + x, y);
    }
}

/**
 * Handles all input
 */
function keyReleased() {
    if (restart) { // only valid input when game is finished is "Enter"
        if (key === "Enter") // restart game
            setupCore();
    } else if (key === "Enter" && currWord.length === 5 && isWord(currWord)) { // submit word
        guesses.push(currWord);
        keyboard.update(currWord);

        // end game if either won or lost
        if (currWord === keyboard.word || guesses.length === 6) restart = true;

        currWord = "";
    } else if (key === "Backspace" && currWord.length > 0) {
        currWord = currWord.slice(0, currWord.length - 1);
    }
    else if (key.length === 1 && currWord.length < 5) { // text input
        let ch = key.toUpperCase().charCodeAt(0);
        if (ch >= 65 && ch <= 90) { // filter non-letters
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