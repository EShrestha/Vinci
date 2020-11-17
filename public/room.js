const canvasHolder = document.getElementById('canvasHolder');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//// USE WHEN CLIENT IS SEPARATE FROM SERVER MACHINE
// const                   http:server_ip:server_port
//const socket = io.connect('http://192.168.1.221:6969')
//// USE WHEN RUNNING CLIENT AND SERVER ON SAME MACHINE
const socket = io.connect('http://localhost:6969')

canvas.height = canvasHolder.clientHeight;
canvas.width = canvasHolder.clientWidth;
// canvas.width = window.innerWidth;
// canvas.style.width = "100%";
// canvas.style.height = "100%";

//variables
var painting = false;

const startPosition = (evt) => {
    painting = true;
    draw(evt);
}

const finishPosition = () => {
    painting = false;
    ctx.beginPath();
}

const draw = (evt) => {
    if (!painting) return;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    

    let pos = getCursorPosition(evt);
    console.log(`EVT:${evt.clientX}, ${evt.clientY}`);
    console.log(`POS:${pos.x}, ${pos.y}`);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}



const getCursorPosition = (evt)=> {
    var ClientRect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - ClientRect.left),
        y: Math.round(evt.clientY - ClientRect.top)
    }
}


//Event Listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishPosition);
canvas.addEventListener('mouseout', finishPosition)
canvas.addEventListener('mousemove', draw);

window.onresize = () => {
    canvas.height = canvasHolder.clientHeight;
    canvas.width = canvasHolder.clientWidth;
}