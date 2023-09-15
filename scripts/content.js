var previousURL = '';

// Vérifie si l'URL est le bon (les filtres ne marchent pas à cause de l'insertion des URLs directement dans l'historique)
setInterval(() => {
    // L'URL a changé ?
    if (previousURL != document.URL) {
        // L'URL est le bon ?
        if (document.URL == 'https://app.sowesign.com/student/next-course') {
            main();
        }
        previousURL = document.URL;
    }
}, 500);

// Oui c'est dégeu mais flemme
const MODAL_TEXT = `
<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); display: grid; gap: 20px; background-color: #fff; padding: 40px; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; font-style:normal; color: #000;display:none;" class="center" id="wtf-modal">
    <div style="position: absolute; top: 10px; right: 10px; border-radius: 50%; width: 26px; height: 26px;border:1px solid #000;cursor:pointer;font-size:16px;" id="wtf-close-modal">&times;</div>
    <div style="grid-column: 1 / 4; grid row: 1;" class="blue bold title-text">Signer avec une image</div>
    <div style="grid-column: 1; grid row: 2;">Utiliser une image locale</div>
    <button style="grid-column: 1; grid-row: 3; border: 1px solid #888;cursor:pointer;" id="wtf-file-select">Parcourir mes fichiers</button>
    <span style="width: 2px; height: 100%; background-color: #888; grid-row: 2/4; grid-column: 2;"></span>
    <div style="grid-column: 3; grid row: 2;">Utiliser une image du Web</div>
    <input style="grid-column: 3; grid-row: 3; border: 1px solid #888;" type="text" placeholder="Lien de l'internet des abonnés" id="wtf-file-link">
</div>
`;

const main = () => {
    var container = document.getElementsByClassName('height-100 little-text grey italic space-around')[0];

    container.innerHTML += `<div><input type="file" id="wtf-file-elem" accept="image/png" style="display:none;" /><button id="wtf-toggle-modal">Sign with an image</button><canvas width="200" height="150" id="cv"></canvas></div>`;
    container.innerHTML += MODAL_TEXT;
    document.getElementById('wtf-file-select').onclick = _e => {
        document.getElementById('wtf-file-elem').click();
    }
    document.getElementById('wtf-file-elem').onchange = e => {
        if (e.target.files.length == 1) {
            var url = URL.createObjectURL(e.target.files[0]);
            draw(url);
        }
    }
    document.getElementById('wtf-file-link').onkeydown = e => {
        if(e.key == 'Enter') {
            try {
                new URL(e.target.value);
                draw(e.target.value);
            } catch (error) {
                console.log('Invalid url!');
            }
        }
    }
    document.getElementById('wtf-file-link').onblur = e => {
        try {
            new URL(e.target.value);
            draw(e.target.value);
        } catch (error) {
            console.log('Invalid url!');
        }
    }
    document.getElementById('wtf-close-modal').onclick = _e => {
        togglemodal();
    }
    document.getElementById('wtf-toggle-modal').onclick = _e => {
        togglemodal();
    }

    var canvas = document.getElementsByTagName('canvas')[0];
    var context = canvas.getContext('2d');

    var modalactive = false;

    const togglemodal = () => {
        if(!modalactive) {
            document.getElementById('wtf-modal').style.display = 'grid';
            modalactive = true;
        } else {
            document.getElementById('wtf-modal').style.display = 'none';
            modalactive = false;
        }
    }

    const draw = url => {
        togglemodal();

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
}
