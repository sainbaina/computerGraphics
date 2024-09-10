/** @type {HTMLCanvasElement} */
let canvas = null;
/** @type {CanvasRenderingContext2D} */
let ctx = null;

/** @type {HTMLCanvasElement} */
let bg_canvas = null;
/** @type {CanvasRenderingContext2D} */
let bg_ctx = null;

// const
let x0 = 400; 
let y0 = 400; 
let fi = 0;

//var
let k = 12/9; 
let r = 20;
let R = r*k;

function AnimLoop()
{
    let x = r*(k+1)*(Math.cos(fi) - Math.cos((k+1)*fi)/(k+1));
    let y = r*(k+1)*(Math.sin(fi) - Math.sin((k+1)*fi)/(k+1));
    ctx.strokeRect(x+x0,y+y0,1,1);
    fi += 0.05;

    let x1 = (r*(k+1))*Math.cos(fi); 
    let y1 = (r*(k+1))*Math.sin(fi); 

    bg_ctx.clearRect(0,0,1000,1000);
    bg_ctx.beginPath();
    bg_ctx.ellipse(x0+x1, y0+y1, r, r, 0, 0, 2*Math.PI);
    bg_ctx.stroke();

    requestAnimationFrame(AnimLoop);
}

function InitCanvas()
{
    canvas = document.getElementById('my_canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;  
    ctx.strokeStyle = "black";

    bg_canvas = document.getElementById('bg_canvas');
    bg_canvas.width = window.innerWidth;
    bg_canvas.height = window.innerHeight;
    bg_ctx = bg_canvas.getContext('2d');
    bg_ctx.lineWidth = 1;
    bg_ctx.strokeStyle = "red";

    ctx.beginPath();
    ctx.ellipse(x0, y0, R, R, 0, 0, 2*Math.PI);
    ctx.stroke();

    let requestId = requestAnimationFrame(AnimLoop);
}
