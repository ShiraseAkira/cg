window.addEventListener("load", async () => {
    const canvas = document.getElementById("canvas");
    const tasks = await (await fetch("questions.json")).json()
    const hangman = new Hangman(canvas, tasks);
});

const LetterState = {
    unchecked: "unchecked",
    hit: "hit",
    miss: "miss"
}

const LetterColor = {
    unchecked: "#000000",
    hit: "#00ff00",
    miss: "#ff0000"
}

const Color = {
    body: "#5f497a",
    gallows: "#92d050",
    placeholder: "#3d85c6",
    placeholderBorder: "#395e89"
}

class Hangman {
    defaultdrawStateStrategy = this.drawStateVisual;
    letters = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя".split('');
    controlsOffset = {x: 40, y: 500};
    fontSize = 32;
    shots = 7;

    constructor(canvas, tasks) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.font = `${this.fontSize}px sans-serif`;
        this.ctx.textBaseline = "top";
        this.tasks = tasks;
        this.drawStateStrategy = this.defaultdrawStateStrategy;
        this.setListeners();
        this.newGame();
    }

    newGame() {
        this.task = this.tasks[Math.floor(Math.random() * this.tasks.length)];
        this.word = this.task.word.split("").map(letter => {return {
            "letter": letter,
            "found": false
        }});
        this.letterState = this.letters.map(letter => {return {
            "letter": letter,
            "state": LetterState.unchecked
        }});
        this.usedLetters = [];
        this.shotsLeft = this.shots;
        this.draw();
    }

    setListeners() {
        this.canvas.addEventListener('click', e => {
            if(this.shotsLeft === 0 || this.isWordGuessed()) {
                this.newGame();
                this.draw();
                return;
            }

            let target;
            if (target = this.getLetterIfinPos(e.offsetX, e.offsetY)) {
                if (!this.usedLetters.includes(target)) {
                    this.usedLetters.push(target);

                    let isInTaskWord = false;
                    for (let i = 0; i < this.word.length; i++) {
                        if (this.word[i].letter === target.letter) {
                            isInTaskWord = true;
                            this.word[i].found = true;
                            target.state = LetterState.hit;
                        }
                    }
                    if (!isInTaskWord) {
                        target.state = LetterState.miss;
                        this.shotsLeft -= 1;
                    }
                }
                this.draw();
            }
        });

        window.addEventListener("keydown", e => {
            if (e.code === "Space") {
                this.switchStateDrawStrategy(); 
                this.draw();
            }
        });
    }

    getLetterIfinPos(x, y) {
        let letter;
        for (let i = 0; i < this.letterState.length; i++) {
            if (x < this.letterState[i].boundingBoxLeft ||
                x > this.letterState[i].boundingBoxRight ||
                y < this.letterState[i].boundingBoxTop ||
                y > this.letterState[i].boundingBoxBottom) 
                    {
                        continue;
                    }
            letter = this.letterState[i];
            break;        
        }
        return letter;
    }


    drawControls() {
        let letterOffset = 0;
        for (let i = 0; i < this.letterState.length; i++) {
            this.ctx.fillStyle = LetterColor[this.letterState[i].state];
            const text = this.letterState[i].letter;
            const textMetrics = this.ctx.measureText(text);
            this.letterState[i].boundingBoxTop = this.controlsOffset.y - Math.ceil(textMetrics.actualBoundingBoxAscent);
            this.letterState[i].boundingBoxBottom = this.controlsOffset.y + Math.ceil(textMetrics.actualBoundingBoxDescent);
            this.letterState[i].boundingBoxLeft = this.controlsOffset.x - Math.ceil(textMetrics.actualBoundingBoxLeft) + letterOffset;
            this.letterState[i].boundingBoxRight = this.controlsOffset.x + Math.ceil(textMetrics.actualBoundingBoxRight) + letterOffset;
            const letterWidth = textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft;
            this.ctx.fillText(text,this.controlsOffset.x + letterOffset, this.controlsOffset.y);
            letterOffset += letterWidth + 10;
        }
    }

    draw() {
        this.clear();
        this.drawStateStrategy();
        if(this.shotsLeft > 0 && !this.isWordGuessed()) {
            this.drawControls();
        } else {
            this.drawEndMessage();
        }
    }

    isWordGuessed() {
        return this.word.reduce((prev, curr) => prev && curr.found, true);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    switchStateDrawStrategy() {
        this.drawStateStrategy = this.drawStateStrategy === this.drawStateVisual ? this.drawStateText : this.drawStateVisual; 
    }

    drawStateVisual() {
        this.ctx.fillStyle = Color.gallows;
        this.ctx.fillRect(40, 40, 20, 400);
        this.ctx.fillRect(40, 40, 200, 20);

        this.ctx.fillStyle = Color.body;
        this.ctx.strokeStyle = Color.body;
        this.ctx.lineWidth = 5;
        switch (this.shotsLeft) {
            case 0: this.ctx.beginPath(); this.ctx.moveTo(233, 200); this.ctx.lineTo(255, 260); this.ctx.closePath(); this.ctx.stroke();
            case 1: this.ctx.beginPath(); this.ctx.moveTo(233, 200); this.ctx.lineTo(210, 260); this.ctx.closePath(); this.ctx.stroke();
            case 2: this.ctx.beginPath(); this.ctx.moveTo(233, 260); this.ctx.lineTo(255, 350); this.ctx.closePath(); this.ctx.stroke();
            case 3: this.ctx.beginPath(); this.ctx.moveTo(233, 260); this.ctx.lineTo(210, 350); this.ctx.closePath(); this.ctx.stroke();
            case 4: this.ctx.fillRect(230, 160, 5, 100);
            case 5: this.ctx.arc(233, 140, 20, 0, Math.PI * 2); this.ctx.fill();
            case 6: this.ctx.fillRect(230, 50, 5, 70);
        }

        this.ctx.fillStyle = LetterColor.unchecked;
        this.ctx.fillText(this.task.hint, 700, 40);

        let letterOffset = 0;
        let wordOffset = {x: 700, y: 200};
        for (let i = 0; i < this.task.word.length; i++) {
            const text = this.task.word[i];
            const textMetrics = this.ctx.measureText(text);
            const letterWidth = textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft;
            this.ctx.fillStyle = LetterColor.unchecked;
            if (this.word[i].found) {
                this.ctx.fillText(this.task.word[i], wordOffset.x + letterOffset, wordOffset.y);
            }
            this.ctx.fillStyle = Color.placeholder;
            this.ctx.strokeStyle = Color.placeholderBorder;
            this.ctx.fillRect(wordOffset.x + letterOffset - 10, wordOffset.y + 40, letterWidth + 20, 10);
            this.ctx.strokeRect(wordOffset.x + letterOffset - 10, wordOffset.y + 40, letterWidth + 20, 10);
            letterOffset += letterWidth + 40;
        }
    }

    drawStateText() {
        this.ctx.fillStyle = LetterColor.unchecked;
        this.ctx.fillText('Вопрос', 40, 40);
        this.ctx.fillText(this.task.hint, 80, 80);

        let letterOffset = 0;
        let wordOffset = {x: 100, y: 140};
        for (let i = 0; i < this.task.word.length; i++) {
            const text = this.task.word[i];
            const textMetrics = this.ctx.measureText(text);
            const letterWidth = textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft;
            this.ctx.fillStyle = LetterColor.unchecked;
            if (this.word[i].found) {
                this.ctx.fillText(text, wordOffset.x + letterOffset, wordOffset.y);
            }
            this.ctx.fillStyle = Color.placeholder;
            this.ctx.strokeStyle = Color.placeholderBorder;
            this.ctx.fillRect(wordOffset.x + letterOffset - 10, wordOffset.y + 40, letterWidth + 20, 10);
            this.ctx.strokeRect(wordOffset.x + letterOffset - 10, wordOffset.y + 40, letterWidth + 20, 10);
            letterOffset += letterWidth + 40;
        }

        this.ctx.fillStyle = LetterColor.unchecked;
        this.ctx.fillText('Использованные буквы', 40, 220);

        letterOffset = 0;
        wordOffset = {x: 100, y: 280};
        for (let i = 0; i < this.usedLetters.length; i++) {
            const text = this.usedLetters[i].letter;
            const textMetrics = this.ctx.measureText(text);
            const letterWidth = textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft;
            this.ctx.fillStyle = LetterColor[this.usedLetters[i].state];
            this.ctx.fillText(text, wordOffset.x + letterOffset, wordOffset.y);
            letterOffset += letterWidth + 10;
        }

        this.ctx.fillStyle = LetterColor.unchecked;
        this.ctx.fillText(`Осталось попыток: ${this.shotsLeft}`, 40, 360);
    }

    drawEndMessage() {
        const [endMessage, endMessageColor]= this.isWordGuessed() ? ["Успех", LetterColor.hit] : ["Неудача", LetterColor.miss];
        this.ctx.fillStyle = endMessageColor
        this.ctx.fillText(endMessage, this.controlsOffset.x + 500 , this.controlsOffset.y);
    }
}