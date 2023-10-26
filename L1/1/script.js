const LETTER_HEIGHT = 300;
const LETTER_WIDTH = 260;
const LETTER_SPACING = 50;
const LINE_WIDTH = 50;

const ORANGE = "#FFA500";
const BLUE = "#7777FF";
const GREEN = "#77FF77";

const INITIAL_SPEED = 17;
const GRAVITY = 0.5;

const DELAY = 300;

class Letter {
    constructor(x, y, color, drawStrategy) {
        this.x = x;
        this.y = y;
        this.v = INITIAL_SPEED;
        this.height = LETTER_HEIGHT;
        this.width = LETTER_WIDTH;
        this.line_width = LINE_WIDTH;
        this.color = color;
        this.drawStrategy = drawStrategy;
    }

    draw(canvas, context) {
        context.fillStyle = this.color;
        this.drawStrategy(canvas, context);
    }

    updateLetterPositions() {
        this.v -= GRAVITY;
        this.y += this.v;
    
        if (this.y < 0)  {
            this.y = 0;
            this.v = INITIAL_SPEED;
        }
    }
}

function draw_L(canvas, context) {
    context.save();
    context.strokeStyle = this.color;
    context.lineWidth = this.line_width;
    context.beginPath();
    
    context.moveTo(this.x + this.width - this.line_width / 2, canvas.height - this.y);
    context.lineTo(this.x + this.width - this.line_width / 2, canvas.height - this.y - this.height + this.line_width / 2);
    context.lineTo(this.x + this.line_width * 2, canvas.height - this.y - this.height + this.line_width / 2);
    context.lineTo(this.x + this.line_width * 2, canvas.height - this.y - 3/2 * this.line_width);
    context.arc(this.x + this.line_width, canvas.height - this.y - this.line_width * 3/2, this.line_width, 0, Math.PI * 2/3);

    context.stroke();
    context.restore();
}


function draw_M(canvas, context) {
    context.fillRect(this.x, canvas.height - this.y - this.height, this.line_width, this.height);
    context.fillRect(this.x + this.width - this.line_width, canvas.height - this.y - this.height, this.line_width, this.height);

    context.save();
    context.translate(this.x + this.line_width, canvas.height - this.y - this.height);
    context.rotate((-20 * Math.PI) / 180);
    context.fillRect(-this.line_width, 0, this.line_width, this.height);
    context.restore();

    context.save();
    context.translate(this.x + this.width - this.line_width, canvas.height - this.y - this.height);
    context.rotate((20 * Math.PI) / 180);
    context.fillRect(0, 0, this.line_width, this.height);
    context.restore();
}

function draw_I(canvas, context) {
    context.fillRect(this.x, canvas.height - this.y - this.height, this.line_width, this.height);
    context.fillRect(this.x + this.width - this.line_width, canvas.height - this.y - this.height, this.line_width, this.height);

    context.save();
    context.translate(this.x + this.width - this.line_width, canvas.height - this.y - this.height);
    context.rotate((36.5 * Math.PI) / 180);
    context.fillRect(0, 0, this.line_width, this.height * 1.12);
    context.restore();
}

function drawFrame() {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < letters.length; i++) {
        letters[i].draw(canvas, context)
    }
    
    for (let i = 0; i < jumpingLetters.length; i++) {
        jumpingLetters[i].updateLetterPositions();
        jumpingLetters[i].draw(canvas, context)
    }
    window.requestAnimationFrame(drawFrame);
}

const letters = [];
const jumpingLetters = [];

function init() {
    letters.push(new Letter (0, 0, BLUE, draw_L));
    letters.push(new Letter(LETTER_WIDTH + LETTER_SPACING, 0, ORANGE, draw_M));
    letters.push(new Letter((LETTER_WIDTH + LETTER_SPACING) * 2, 0, GREEN, draw_I));


    for (let i = 0; i < letters.length; i++) {
        setTimeout(() => jumpingLetters.push(letters.pop()), DELAY * i);
    }

    window.requestAnimationFrame(drawFrame);
};

init();