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
        if (document.URL == 'https://app.sowesign.com/student/next-course') {
            main();
        }
        // L'URL a changé, on change aussi previousURL pour ne pas exécuter deux fois la fonction
        previousURL = document.URL;
    }
}, 500);

// Oui c'est dégeu mais flemme
// Le code HTML du modal injecté
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
<input type="file" id="wtf-file-elem" accept="image/*" style="display:none;" />
`;

// Fonction principale
const main = () => {

    // Le parent dans le quel on va injecter le modal et le bouton
    var container = document.getElementsByClassName('height-100 little-text grey italic space-around')[0];

    // On injecte le bouton et le canvas...
    // TODO: changer le style du bouton
    container.innerHTML += `<div><button id="wtf-toggle-modal">Sign with an image</button><canvas width="200" height="150" id="cv"></canvas></div>`;

    // ...puis le modal
    container.innerHTML += MODAL_TEXT;

    // Si le bouton "Parcourir mes fichiers" est cliqué
    document.getElementById('wtf-file-select').onclick = _e => {
        // On ouvre le selecteur de fichiers (input type="file" invisible
        document.getElementById('wtf-file-elem').click();
    }

    // Quand un fichier a été sélectionné
    document.getElementById('wtf-file-elem').onchange = e => {
        // Si il n'y a bien qu'un seul fichier
        if (e.target.files.length == 1) {
            // On dessine la photo sélectionnée
            var url = URL.createObjectURL(e.target.files[0]);
            draw(url);
        }
    }

    // Quand la touche "entrée" est pressée dans l'input du lien
    document.getElementById('wtf-file-link').onkeydown = e => {
        if(e.key == 'Enter') {
            try {
                // Si c'est bien une URL, on la dessine
                new URL(e.target.value);
                draw(e.target.value);
            } catch (error) {
                // Sinon non
                console.log('Invalid url!');
            }
        }
    }
    // La même chose, mais quand l'input perd le focus
    document.getElementById('wtf-file-link').onblur = e => {
        try {
            new URL(e.target.value);
            draw(e.target.value);
        } catch (error) {
            console.log('Invalid url!');
        }
    }

    // On ferme le modal quand la croix est cliquée
    document.getElementById('wtf-close-modal').onclick = _e => {
        togglemodal();
    }

    // On ouvre le modal quand le bouton est cliqué
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

    // Note: je ne sais pas pourquoi je change de langue

    const draw = url => {
        togglemodal();

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
            
            // Draws the image
            context.drawImage(image, posX, posY, width, height);
        }
    }
}
