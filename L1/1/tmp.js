function drawL (canvas, context) {
    context.save();
    context.strokeStyle = this.color;
    context.lineWidth = this.line_width;
    context.beginPath();
    context.arc(this.x + (this.width - this.line_width) / 2 - this.line_width, canvas.height - this.y - this.line_width * 3/2, this.line_width, 0, Math.PI * 2/3);
    context.stroke();
    context.restore();

    context.fillRect(this.x + this.width / 2 - this.line_width, canvas.height - this.y - this.height, this.line_width, this.height - 75);
    context.fillRect(this.x + this.width / 2 - this.line_width, canvas.height - this.y - this.height, this.width / 2, this.line_width);
    context.fillRect(this.x + this.width - this.line_width, canvas.height - this.y - this.height, this.line_width, this.height);
}