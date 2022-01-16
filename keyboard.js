let createKeyObj = function (letter, x, y) {
    return {
        letter: letter,
        x: x,
        y: y,
        status: Keyboard.UNUSED
    };
}

/**
 * determines if the new status should update the old status in <Keybaord>.keys
 * @param {string} oldStat the status keys already contains
 * @param {string} newStat the status from the most recent guess
 * @returns whether the old status should replace the new status
 */
let shouldUpdate = function (oldStat, newStat) {
    if (oldStat === Keyboard.UNUSED) return true;
    if (oldStat === Keyboard.WRONG_SPOT && newStat === Keyboard.RIGHT_SPOT) return true;
    return false;
}


/**
 * Class that keeps track of the keyboard display
 */
class Keyboard {
    static UNUSED = 'u';
    static NOT_IN_WORD = 'n';
    static WRONG_SPOT = 'w';
    static RIGHT_SPOT = 'r';
    static SPACING = 0.10

    static USED_COLOR = {
        'u': '#FFFFFF',
        'n': '#707070',
        'w': '#FF7700',
        'r': '#00FF00'
    };

    /**
     * @param {string} word the word that's trying to be guessed
     * @param {number} scale scaling factor to draw the keyboard at
     * @param {number} x x-coordinate of the center of the keybaord
     * @param {number} y y-coordinate of the center of the keyboard
     */
    constructor(word, scale, x, y) {
        this.word = word;
        this.scale = scale;
        // it's more useful to store (x,y) of the center of the 'Q'-key
        this.x = x - 4.5 * scale;
        this.y = y - 1 * scale;


        this.keys = [];
        this.keysIndex = {}; // this.keys[this.keysIndex[<letter>]] = <letter>

        let toprow = 'QWERTYUIOP';
        let midrow = 'ASDFGHJKL';
        let botrow = 'ZXCVBNM';
        for (let i = 0; i < toprow.length; i++) {
            this.keys.push(createKeyObj(toprow.charAt(i), i, 0))
            this.keysIndex[toprow.charAt(i)] = i
        }
        // middle row is offset 1/4 a key from the top row
        for (let i = 0; i < midrow.length; i++) {
            this.keys.push(createKeyObj(midrow.charAt(i), i + 0.25, 1))
            this.keysIndex[midrow.charAt(i)] = toprow.length + i
        }
        // bottom row is offset 1/2 a key from the middle row (3/4 from top)
        for (let i = 0; i < botrow.length; i++) {
            this.keys.push(createKeyObj(botrow.charAt(i), i + 0.75, 2))
            this.keysIndex[botrow.charAt(i)] = toprow.length + midrow.length + i
        }
    }

    /**
     * updates the keyboard's colors based on latest guess.
     * @param {string} guessedWord the word inputted by the user
     */
    update(guessedWord) {
        for (let i = 0; i < guessedWord.length; i++) {
            let ch = guessedWord.charAt(i);
            let realCh = this.word.charAt(i);

            let usedVal = '';

            if (ch === realCh) usedVal = Keyboard.RIGHT_SPOT;
            else if (this.word.includes(ch)) usedVal = Keyboard.WRONG_SPOT;
            else usedVal = Keyboard.NOT_IN_WORD;

            let keyIndex = this.keysIndex[ch];
            if (shouldUpdate(this.keys[keyIndex].status, usedVal))
                this.keys[keyIndex].status = usedVal;
        }
    }

    display() {
        rectMode(CENTER);
        textSize(this.scale * 0.66);
        textAlign(CENTER, CENTER);
        for (let key of this.keys) {
            stroke(Keyboard.USED_COLOR[key.status]);

            noFill();
            rect(
                this.scale * (key.x) + this.x,
                this.scale * (key.y) + this.y,
                this.scale * (1 - Keyboard.SPACING),
                this.scale * (1 - Keyboard.SPACING),
                this.scale * Keyboard.SPACING
            );
            fill(Keyboard.USED_COLOR[key.status]);
            text(key.letter, this.scale * key.x + this.x, this.scale * key.y + this.y);
        }
    }

    /**
     * finds the colors that each letter of word should be
     * @param {string} word the inputted word
     * @returns an array of colors the letters of word should be
     */
    getColors(word) {
        let retArr = [];
        let status;
        for (let i = 0; i < word.length; i++) {

            if (word.charAt(i) === this.word.charAt(i)) status = Keyboard.RIGHT_SPOT;
            else if (this.word.includes(word.charAt(i))) status = Keyboard.WRONG_SPOT;
            else status = Keyboard.NOT_IN_WORD;

            retArr.push(Keyboard.USED_COLOR[status]);
        }
        return retArr;
    }

    resize(newScale, newX, newY) {
        this.scale = newScale;
        this.x = newX - 4.5 * this.scale;
        this.y = newY - 1 * this.scale;
    }
}