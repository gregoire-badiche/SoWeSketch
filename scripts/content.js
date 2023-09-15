var previousURL = '';

setInterval(() => {
    if (previousURL != document.URL) {
        if (document.URL == 'https://app.sowesign.com/student/next-course') {
            main();
        }
        previousURL = document.URL;
    }
}, 500);

var canvas;
var context;


const main = () => {
    document.body.innerHTML = '<div><input type="file" id="wtf-fileelem" accept="image/png" style="display:none;" /><button id="wtf-fileselect">Select file</button></div><canvas width="200" height="150" id="cv"></canvas>' + document.body.innerHTML;
    document.getElementById('wtf-fileselect').onclick = _e => {
        document.getElementById('wtf-fileelem').click();
    }
    document.getElementById('wtf-fileelem').onchange = _e => {
        if (_e.target.files.length == 1) {
            var url = URL.createObjectURL(_e.target.files[0]);
            draw(url);
        }
    }
    canvas = document.getElementById('cv');
    context = canvas.getContext('2d');
}

const draw = url => {
    var image = new Image();
    image.src = url;

    image.onload = _e => {
        // Canvas dimensions
        var cw = canvas.offsetWidth;
        var ch = canvas.offsetHeight;

        // Image's dimensions
        var iw = image.width;
        var ih = image.height;

        // Canvas ratio
        var cr = cw / ch;
        // Image ratio
        var ir = iw / ih;

        var diffY = ch / ih;
        var diffX = cw / iw;

        var width, height, posX, posY;

        if (cr > ir) {
            // Move on the Y axis
            var padding = (ch / 2) - (ih * diffX / 2);
            height = ih * diffX;
            width = cw;
            posX = 0;
            posY = padding;
        } else {
            // Move on the X axis
            var padding = (cw / 2) - (iw * diffY / 2);
            width = iw * diffY;
            height = ch;
            posX = padding;
            posY = 0;
        }

        context.drawImage(image, posX, posY, width, height);
    }
}