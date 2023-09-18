/*
  *
  * NOTE: le canvas injecté va changer pour utiliser celui déjà présent dans la page
  *
*/

// L'URL précéidente, pour vérifier si l'URL a changé
var previousURL = '';

// Vérifie si l'URL est le bon (les filtres ne marchent pas à cause de l'insertion des URLs directement dans l'historique)
setInterval(() => {
    // L'URL a changé ?
    if (previousURL != document.URL) {
        // L'URL est le bon ?
        if (document.URL == 'https://app.sowesign.com/student/signature') {
            main();
        }
        // L'URL a changé, on change aussi previousURL pour ne pas exécuter deux fois la fonction
        previousURL = document.URL;
    }
}, 500);

// Oui c'est dégeu mais flemme
// Le code HTML du modal injecté
const MODAL_TEXT = `
<div>
    <button style="width: 100%; height: 45px; border-radius: 5px; cursor: pointer; background-color: aliceblue;" id="wtf-file-select">Signer avec une image</button>
    <input type="file" id="wtf-file-elem" accept="image/*" style="display:none;" />
</div>
`;

// Fonction principale
const main = () => {

    // Le parent dans le quel on va injecter le modal et le bouton
    var container = document.getElementsByClassName('text center border-radius padding-xs white cursor-pointer')[0];

    // On injecte le bouton et le canvas...
    container.innerHTML += MODAL_TEXT;

    // Si le bouton "Parcourir mes fichiers" est cliqué
    document.getElementById('wtf-file-select').onclick = e => {
        e.stopPropagation();
        // On ouvre le selecteur de fichiers (input type="file" invisible
        document.getElementById('wtf-file-elem').click();
    }

    // Quand un fichier a été sélectionné
    document.getElementById('wtf-file-elem').onchange = e => {
        e.stopPropagation();
        // Si il n'y a bien qu'un seul fichier
        if (e.target.files.length == 1) {
            // On dessine la photo sélectionnée
            var url = URL.createObjectURL(e.target.files[0]);
            draw(url);
        }
    }
    document.getElementById('wtf-file-elem').onclick = e => {
        e.stopPropagation();
    }

    var canvas = document.getElementsByTagName('canvas')[0];
    var context = canvas.getContext('2d');

    // Note: je ne sais pas pourquoi je change de langue

    const draw = url => {
        var image = new Image();
        image.src = url;

        image.onload = _e => {
            // Centers the image

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

            // Ratio between the canvas and the image, used to scale the image
            var diffY = ch / ih;
            var diffX = cw / iw;

            var width, height, posX, posY;

            if (cr > ir) {
                // Image is taller than the canvas (when set to same size)
                // Move on the Y axis
                var padding = (ch / 2) - (ih * diffX / 2);
                height = ih * diffX;
                width = cw;
                posX = 0;
                posY = padding;
            } else {
                // Image is wider than the canvas (when set to same size)
                // Move on the X axis
                var padding = (cw / 2) - (iw * diffY / 2);
                width = iw * diffY;
                height = ch;
                posX = padding;
                posY = 0;
            }

            // Draws the image as PNG
            context.drawImage(image, posX, posY, width, height);

            var pngDataUrl = canvas.toDataURL('image/png');
            var pngImage = new Image();
            pngImage.src = pngDataUrl;
            pngImage.onload = _e => {
                context.drawImage(pngImage, 0, 0);
            }
        }
    }
}
