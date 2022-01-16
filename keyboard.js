let createKeyObj = function (letter, x, y) {
    return {
        letter: letter,
        x: x,
        y: y,
        status: Keyboard.UNUSED
    };
}

let shouldUpdate = function (oldStat, newStat) {
    if (oldStat === Keyboard.UNUSED) return true;
    if (oldStat === Keyboard.WRONG_SPOT && newStat === Keyboard.RIGHT_SPOT) return true;
    return false;
}


class Keyboard {
    static UNUSED = 'u';
    static NOT_IN_WORD = 'n';
    static WRONG_SPOT = 'w';
    static RIGHT_SPOT = 'r';
    static SPACING = 0.1

    static USED_COLOR = {
        'u': '#FFFFFF',
        'n': '#707070',
        'w': '#FF7700',
        'r': '#00FF00'
    };

    constructor(word, scale, x, y) {
        this.word = word;
        this.scale = scale;
        this.x = x - 4.5 * scale;
        this.y = y - 1 * scale;


        this.keys = [];
        this.keysIndex = {};
        let toprow = 'QWERTYUIOP';
        let midrow = 'ASDFGHJKL';
        let botrow = 'ZXCVBNM';

        for (let i = 0; i < toprow.length; i++) {
            this.keys.push(createKeyObj(toprow.charAt(i), i, 0))
            this.keysIndex[toprow.charAt(i)] = i
        }
        for (let i = 0; i < midrow.length; i++) {
            this.keys.push(createKeyObj(midrow.charAt(i), i + 0.25, 1))
            this.keysIndex[midrow.charAt(i)] = toprow.length + i
        }
        for (let i = 0; i < botrow.length; i++) {
            this.keys.push(createKeyObj(botrow.charAt(i), i + 0.75, 2))
            this.keysIndex[botrow.charAt(i)] = toprow.length + midrow.length + i
        }
    }

    update(guessedWord) {
        let ret_var = [];
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
            ret_var.push(usedVal);
        }
        return ret_var;
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
}