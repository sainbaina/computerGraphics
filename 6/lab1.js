function InitCanvas()
{
    // /** @type {HTMLCanvasElement} */    
    const canvas = document.getElementById('my_canvas');
    // /** @type {CanvasRenderingContext2D} */
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const width = canvas.width;
    const height = canvas.height;

    context.lineWidth = 1;

    context.beginPath();
    const fill_gradient=context.createLinearGradient(0, 100, 0, width);
    fill_gradient.addColorStop("0", getRandomColor());
    fill_gradient.addColorStop("0.5", getRandomColor());
    fill_gradient.addColorStop("1.0", getRandomColor());
    context.fillStyle = fill_gradient;
    context.moveTo(0, 0);
    context.lineTo(width, 0);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.lineTo(0, 0);
    context.closePath();
    context.fill();
    context.stroke();

    context.globalAlpha = 0.4;
    const confetti = document.getElementById('confetti');
    const pat = context.createPattern(confetti, "repeat");
    context.fillStyle = pat;
    context.fill();

    context.globalAlpha = 1;
    const widthHalf = width/2;
    const deltaY = 150;
    const deltaTop = 50;
    const toysPerBlock = 3;
    const blockWidth = 200;
    for (let i = 2; i >= 0; i--) {
        context.fillStyle = "green";
        context.beginPath();
        context.moveTo(widthHalf, i * deltaY + deltaTop);
        context.lineTo(widthHalf + blockWidth / 2, deltaY * (i+1.5) + deltaTop); 
        context.lineTo(widthHalf - blockWidth / 2, deltaY * (i+1.5) + deltaTop); 
        context.lineTo(widthHalf, i * deltaY + deltaTop); 
        context.closePath();
        context.fill();

        for (let j = 0; j < toysPerBlock; j++) {
            context.beginPath();
            context.fillStyle = getRandomColor();
            const dy = Math.random() * deltaY;
            const posX = Math.random() * blockWidth / 2 * (Math.random() < 0.5 ? -1 : 1);
            const posY = dy;
            context.ellipse(posX + width/2, (i+1.5) * deltaY, 20,20,0,0,2*Math.PI);
            context.closePath();
            context.fill();
        }
    }
    context.fillStyle = "brown";
    context.fillRect(widthHalf - 20, deltaY * 3.5 + deltaTop, 40, 70);

}

function getRandomColor() {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + color.padStart(6, '0');
}