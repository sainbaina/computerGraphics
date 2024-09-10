/** @type {HTMLCanvasElement} */
let canvas = null;
/** @type {CanvasRenderingContext2D} */
let ctx = null;

// функция для открытия изображения с помощью FileReader
function Open_Image()
{
    let Pic_Reader = new FileReader();
    Pic_Reader.readAsDataURL(document.getElementById('uploadImage').files[0]);
    Pic_Reader.onload = function (PREvent)
    { 
        console.log(PREvent.target.result);
        document.getElementById('my_image').src = PREvent.target.result; 
    }
}

function CopyToCanvas()
{
    // получаем холст и изображение
    canvas = document.getElementById('my_canvas');
    let img = document.getElementById('my_image');
    // устанавливаем размер холста как размер изображения
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    // получаем контекст холста
    ctx = canvas.getContext('2d');
    // рисуем изображение на холсте
    ctx.drawImage(img, 0, 0);
}

// функция для получения негатива изображения
function convert()
{
    // получаем холст, контекст и изображение
    canvas = document.getElementById('my_canvas');
    ctx = canvas.getContext('2d');
    let img = document.getElementById('my_image');
    // Загружаем ImageData
    let myImagedata = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    // Копируем массив data из ImageData, чтобы можно было вносить изменения
    let pix = myImagedata.data;
    // Цикл, перебирающий все пиксели на холсте и инвертирующий их цвета
    for (let i = 0, n = pix.length; i < n; i += 4)
    {
    pix[i ] = 255 - pix[i ]; // red
    pix[i+1] = 255 - pix[i+1]; // green
    pix[i+2] = 255 - pix[i+2]; // blue
    // i+3 хранит информацию о альфа-канале
    }
    // Запись и отрисовка ImageData на холсте
    ctx.putImageData(myImagedata, 0, 0);
}

// функция для перевода изображения в градации серого
function GrayScale()
{
    canvas = document.getElementById('my_canvas');
    ctx = canvas.getContext('2d');
    let img = document.getElementById('my_image');
    let R_canal;
    let G_canal;
    let B_canal;
    // Загружаем ImageData
    let myImagedata = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    // Копируем массив data из ImageData, что бы можно было вносить изменения
    let pix = myImagedata.data;
    // Цикл, перебирающий все пиксели на холсте и переводящий в серый цвет
    for (let i = 0, n = pix.length; i < n; i += 4)
    {
    R_canal = pix[i ]; // red
    G_canal = pix[i+1]; // green
    B_canal = pix[i+2]; // blue
    // i+3 хранит информацию о альфа-канале
    pix[i ] = (R_canal + G_canal + B_canal) / 3;
    pix[i+1] = (R_canal + G_canal + B_canal) / 3;
    pix[i+2] = (R_canal + G_canal + B_canal) / 3;
    }
    // Запись и отрисовка ImageData на холсте
    ctx.putImageData(myImagedata, 0, 0);
}


function Contrast() {
    let canvas = document.getElementById('my_canvas');
    let ctx = canvas.getContext('2d');
    let img = document.getElementById('my_image');

    // Загружаем ImageData
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    let myImagedata = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    let pix = myImagedata.data;

    let width = img.naturalWidth; 
    let height = img.naturalHeight;
1
    // blur
    const blurX3 = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    // strong contrast
    const strongX3 = [
        [0, -2, 0],
        [-2, 9, -2],
        [0, -2, 0]
    ];
    // contrast
    const kernelX3 = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];

    const kernel = kernelX3;

    const kl = kernel.length;
    const halfKernel = Math.floor(kl / 2);

    let output = new Uint8ClampedArray(pix);

    for (let y = halfKernel; y < height - halfKernel; y++) {
        for (let x = halfKernel; x < width - halfKernel; x++) {
            let r_acc = 0, g_acc = 0, b_acc = 0;

            for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                    let pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                    let kernelValue = kernel[ky + halfKernel][kx + halfKernel];

                    r_acc += pix[pixelIndex] * kernelValue;
                    g_acc += pix[pixelIndex + 1] * kernelValue;
                    b_acc += pix[pixelIndex + 2] * kernelValue;
                }
            }

            // Clamp the values between 0 and 255
            let idx = (y * width + x) * 4;
            output[idx] = Math.min(Math.max(r_acc, 0), 255);
            output[idx + 1] = Math.min(Math.max(g_acc, 0), 255);
            output[idx + 2] = Math.min(Math.max(b_acc, 0), 255);
            // Keep alpha channel unchanged
            output[idx + 3] = pix[idx + 3];
        }
    }

    // Apply the new data back to the canvas
    for (let i = 0; i < output.length; i++) {
        pix[i] = output[i];
    }

    ctx.putImageData(myImagedata, 0, 0);
}

