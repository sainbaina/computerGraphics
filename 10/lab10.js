/** @type {HTMLCanvasElement} */
let canvas = null;
/** @type {CanvasRenderingContext2D} */
let ctx = null;


canvas = document.getElementById('my_canvas');
let width = canvas.offsetWidth; 
let height = canvas.offsetHeight; 
ctx = canvas.getContext('2d');

function onResize () {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}
window.addEventListener('resize', onResize);
onResize();


let PERSPECTIVE = width * 0.8; 
let PROJECTION_CENTER_X = width / 2 - 200; 
let PROJECTION_CENTER_Y = height / 2; 

let vertices = [];
let lines = [
    [0, 1], [1, 2], [2, 3], [3, 0], 
    [4, 5], [5, 6], [6, 7], [7, 4], 
    [0, 4], [1, 5], [2, 6], [3, 7]
];

function loadVertices() {
    vertices = [
        [-100, -100, 50, 1],
        [100, -100, 50, 1],
        [50, 50, 50, 1],
        [-50, 50, 50, 1],
        [-100, -100, 200, 1],
        [100, -100, 200, 1],
        [50, 50, 200, 1],
        [-50, 50, 200, 1]
    ];
}
loadVertices();

function projectVertex(vertex) {
    const [x, y, z] = vertex;
    const d = 500;  
    const scaleFactor = d / (d + z);  
    const xProjected = x * scaleFactor;
    const yProjected = y * scaleFactor; 
    return [xProjected, yProjected];
}

let projectedVertices = vertices.map(projectVertex);

function drawLines() {
    for (let i = 0; i < lines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(
            projectedVertices[lines[i][0]][0]+PROJECTION_CENTER_X, 
            projectedVertices[lines[i][0]][1]+PROJECTION_CENTER_Y);
        ctx.lineTo(
            projectedVertices[lines[i][1]][0]+PROJECTION_CENTER_X, 
            projectedVertices[lines[i][1]][1]+PROJECTION_CENTER_Y);
        ctx.stroke();
    }
}

function render() {
    ctx.clearRect(0, 0, width, height);
    drawLines();
    window.requestAnimationFrame(render);
}

function getTranslateMatrix({a=1, e=1, j=1, s=1, b=0, c=0, p=0, d=0, f=0, q=0, h=0, i=0, r=0, l=0, m=0, n=0}) {
    let T = [
        [ a, b, c, p ],
        [ d, e, f, q ],
        [ h, i, j, r ],
        [ l, m, n, s ]];
    return T;
}

function normalize() {
    for (let i = 0; i < vertices.length; i++) {
        console.log(vertices[i][3]);
        let length = Math.sqrt(vertices[i][0] ** 2 + vertices[i][1] ** 2 + vertices[i][2] ** 2);
        vertices[i][0] /= length;
        vertices[i][1] /= length;
        vertices[i][2] /= length;
    }
}

//////////////////////////////////////////////////////////////////////////
function Move() {
    let oxInput = document.getElementById("oXInput");
    let oyInput = document.getElementById("oYInput");
    let ozInput = document.getElementById("oZInput");

    let translateMatrix = getTranslateMatrix({
        l:oxInput.value || 0, 
        m:-oyInput.value || 0,
        n:ozInput.value || 0
        });

    translate(translateMatrix);
}

function translate(matrix) {
    let newVertices = [];
    for (let k = 0; k < vertices.length; k++) {
        let temp = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                temp[i] += vertices[k][j] * matrix[j][i];
            }
        }
        newVertices.push(temp);
    }
    vertices = newVertices;
    projectedVertices = vertices.map(projectVertex);
}

function RotateX() {
    let deg = document.getElementById("rotateInput");
    let rad = parseFloat(deg.value || 0)*Math.PI/180;

    let translateMatrix = getTranslateMatrix({
        e:Math.cos(rad),
        f:Math.sin(rad),
        i:-Math.sin(rad),
        j:Math.cos(rad)
        });

    translate(translateMatrix);
}

function RotateY() {
    let deg = document.getElementById("rotateInput");
    let rad = parseFloat(deg.value || 0)*Math.PI/180;

    let translateMatrix = getTranslateMatrix({
        a:Math.cos(rad),
        c:-Math.sin(rad),
        e:1,
        h:Math.sin(rad),
        j:Math.cos(rad)
        });

    translate(translateMatrix);
}

function RotateZ() {
    let deg = document.getElementById("rotateInput");
    let rad = parseFloat(deg.value || 0)*Math.PI/180;

    let translateMatrix = getTranslateMatrix({
        a:Math.cos(rad),
        b:Math.sin(rad),
        d:-Math.sin(rad),
        e:Math.cos(rad)
        });

    translate(translateMatrix);
}

function ReloadFigurePos() {
    loadVertices();
    projectedVertices = vertices.map(projectVertex);
}

function FrontView() {
    for (let i = 0; i < vertices.length; i++) {
        projectedVertices[i][0] = vertices[i][0];
        projectedVertices[i][1] = vertices[i][1];
    }
}

function BackFromProjection() {
    projectedVertices = vertices.map(projectVertex);
}

function Scale(){
    let sX = document.getElementById("scaleXInput");
    let sY = document.getElementById("scaleYInput");
    let sZ = document.getElementById("scaleZInput");

    let translateMatrix = getTranslateMatrix({
        a:sX.value || 1,
        e:sY.value || 1,
        j:sZ.value || 1,
    });
    translate(translateMatrix);
}

function XMirror(){
    for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = -vertices[i][0];
    }
    projectedVertices = vertices.map(projectVertex);
}

function YMirror(){
    for (let i = 0; i < vertices.length; i++) {
        vertices[i][1] = -vertices[i][1];
    }
    projectedVertices = vertices.map(projectVertex);
}

function ZMirror(){
    for (let i = 0; i < vertices.length; i++) {
        vertices[i][2] = -vertices[i][2];
    }
    projectedVertices = vertices.map(projectVertex);
}

function OblickView() {
    for (let i = 0; i < vertices.length; i++) {
        const [x, y, z, w] = vertices[i];
        const radX = 45 * Math.PI / 180;
        const radY = 45 * Math.PI / 180;
        const obliqueX = z * Math.cos(radX);
        const obliqueY = z * Math.sin(radY);
        const xProjected = x + obliqueX;
        const yProjected = y + obliqueY;
        projectedVertices[i][0] = xProjected;   
        projectedVertices[i][1] = yProjected;   
    }
}