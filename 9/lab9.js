/** @type {HTMLCanvasElement} */
let canvas = null;
/** @type {CanvasRenderingContext2D} */
let ctx = null;

let matrix = 
    [[1, 0, 0],
     [0, 1, 0],
     [0, 0, 1]]
  ////////////////
  //[[a, b, p],
  // [c, d, q]
  // [m, n, s]]

  let figMatrix = [
    [1, 0, 0],  
    [0, 1, 0],
    [0, 0, 1]  
];

function clearfigMatrix() {
    figMatrix = [
        [figX, 0, 0],  
        [0, figY, 0],
        [0, 0, 1]  
    ];
}

function multiplyMatrices(a, b) {
    console.log(a);
    console.log(b);
    let ay = a.length;
    let ax = a[0].length;
    let bx = b[0].length;
    let res = Array.from({ length: ay }, () => Array(bx).fill(0));
    for (let i = 0; i < ay; i++) {
        for (let j = 0; j < bx; j++) {
            let temp = 0;
            for (let k = 0; k < ax; k++) {
                temp += a[i][k] * b[k][j];
            }
            res[i][j] = temp;
        }
    }
    return res;
}


let figPos = [0.0,0.0];
let x0 = 500;
let y0 = 400;
let figX = 500;
let figY = 400;
let alpha = 0;
let fi = Math.PI/2;
let size = 50;
let scaleX = 1;
let scaleY = 1;
let xArr = new Float32Array(11);
let yArr = new Float32Array(11);

function InitFigure() {
    for (let i = 0; i < 12; i++) {
        let x = size * Math.cos(fi);
        let y = size * Math.sin(fi);
        // ctx.lineTo(figX+x*scaleX,figY+y*scaleY);
        xArr[i] = x;
        yArr[i] = y;
        fi += 1.4*Math.PI;
    }
}

function InitCanvas()
{
    canvas = document.getElementById('my_canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;  
    ctx.strokeStyle = "black";
    
    InitFigure();
    DrawStar();
}

function DrawCoordinates() {
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, 1000);
    ctx.stroke();
    ctx.moveTo(0, y0);
    ctx.lineTo(1000, y0);
    ctx.stroke();
}

function DrawStar() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < 11; i++) {
        ctx.lineTo(x0+xArr[i],y0+yArr[i]);
    }
    ctx.stroke();
    DrawCoordinates();
}

function CoordMirror() {
    let mirrorMatrix = [
        [-1, 0, 0],
        [0, -1, 0],
        [0, 0, 1]
    ];

    for (let i = 0; i < 11; i++) {
        let point = [xArr[i], yArr[i], 1];
        let newPoint = multiplyMatrixVector(mirrorMatrix, point);
        xArr[i] = newPoint[0];
        yArr[i] = newPoint[1];
    }

    DrawStar();
}

function XisYMirror() {
    let mirrorMatrix = [
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1]
    ];

    for (let i = 0; i < 11; i++) {
        let point = [xArr[i], yArr[i], 1];
        let newPoint = multiplyMatrixVector(mirrorMatrix, point);
        xArr[i] = newPoint[0];
        yArr[i] = newPoint[1];
    }

    DrawStar();
}

function multiplyMatrixVector(matrix, vector) {
    let result = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}

function Move() {
    let oxInput = document.getElementById("oXInput");
    let oyInput = document.getElementById("oYInput");
    let translateMatrix = [
        [1, 0, oxInput.value ? oxInput.value : 0],
        [0, 1, oyInput.value ? oyInput.value : 0],
        [0, 0, 1]
    ];

    for (let i = 0; i < 11; i++) {
        let point = [xArr[i], yArr[i], 1];
        let newPoint = multiplyMatrixVector(translateMatrix, point);
        xArr[i] = newPoint[0];
        yArr[i] = newPoint[1];
    }

    DrawStar();
}

function Rotate() {
    let rotInput = document.getElementById("rotateInput");
    let angle = parseFloat(rotInput.value) * Math.PI / 180;

    let len = xArr.length;
    let centerX = 0;
    let centerY = 0;
    for (let i = 0; i < len; i++) {
        centerX += xArr[i];
        centerY += yArr[i];
    }
    let midX = centerX / len;
    let midY = centerY / len;
    for (let i = 0; i < len; i++) {
        xArr[i] -= midX;
        yArr[i] -= midY;
    }

    let rotationMatrix = [
        [Math.cos(angle), Math.sin(angle), 0],
        [-Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ];

    for (let i = 0; i < len; i++) {
        let point = [xArr[i], yArr[i], 1];
        let newPoint = multiplyMatrixVector(rotationMatrix, point);
        xArr[i] = newPoint[0];
        yArr[i] = newPoint[1];
    }

    for (let i = 0; i < len; i++) {
        xArr[i] += midX;
        yArr[i] += midY;
    }

    DrawStar();
}

function Scale() {
    let sX = document.getElementById("scaleXInput");
    let sY = document.getElementById("scaleYInput");

    let scaleMatrix = [
        [sX.value && sX.value > 0 ? sX.value : 1, 0, 0],
        [0, sY.value && sY.value > 0 ? sY.value : 1, 0],
        [0, 0, 1]
    ];

    for (let i = 0; i < 11; i++) {
        let point = [xArr[i], yArr[i], 1];
        let newPoint = multiplyMatrixVector(scaleMatrix, point);
        xArr[i] = newPoint[0];
        yArr[i] = newPoint[1];
    }

    DrawStar();
}

function ReloadFigurePos(){
    InitFigure();
    DrawStar();
}



function RotateByCoordCenter() {
    let rotInput = document.getElementById("rotateCenterInput");
    let angle = parseFloat(rotInput.value) * Math.PI / 180; 

    let rotationMatrix = [
        [Math.cos(angle), Math.sin(angle), 0],
        [-Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ];

    for (let i = 0; i < 11; i++) {
        let point = [xArr[i], yArr[i], 1];
        let newPoint = multiplyMatrixVector(rotationMatrix, point);
        xArr[i] = newPoint[0];
        yArr[i] = newPoint[1];
    }

    DrawStar();
}

function RotateByPoint() {
    let rotInput = document.getElementById("rotatePointInputDeg");
    let pxInput = document.getElementById("rotatePointInputX");
    let pyInput = document.getElementById("rotatePointInputY");

    let angle = parseFloat(rotInput.value) * Math.PI / 180;
    let px = parseFloat(pxInput.value);
    let py = parseFloat(pyInput.value);

    let translationToOrigin = [
        [1, 0, -px],
        [0, 1, -py],
        [0, 0, 1]
    ];

    let rotationMatrix = [
        [Math.cos(angle), Math.sin(angle), 0],
        [-Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ];
 
    let translationBack = [
        [1, 0, px],
        [0, 1, py],
        [0, 0, 1]
    ];

    let combinedMatrix = multiplyMatrices(translationBack, multiplyMatrices(rotationMatrix, translationToOrigin));

    for (let i = 0; i < 11; i++) {
        let point = [xArr[i], yArr[i], 1];
        let newPoint = multiplyMatrixVector(combinedMatrix, point);
        xArr[i] = newPoint[0];
        yArr[i] = newPoint[1];
    }

    DrawStar();
}