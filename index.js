var Jimp = require('jimp');

let imgRaw = 'raw/seulgi.jpg'; //1200px x 630px
let imgLogo = 'raw/rv_logo.png'; //155px x 114px

let imgActive = 'active/image.jpg';
let imgExported = 'export/image1.jpg';

let textData = {
    text: '© ADITYA RAHMAN',
    maxWidth: 1180, //image width - 10px margin left - 10px margin right
    maxHeight: 114+20, //logo height + margin
    placementX: 10, // 10px in on the x axis
    placementY: 630-(114+20)-10 //bottom of the image: height - maxHeight - margin
};

Jimp.read(imgRaw)
    .then(tpl => (tpl.clone().write(imgActive)))
    .then(() => (Jimp.read(imgActive)))
    .then(tpl => (
        Jimp.read(imgLogo).then(logoTpl => {
            logoTpl.opacity(0.2);
            return tpl.composite(logoTpl, 600-75, 300-(114/2), [Jimp.BLEND_DESTINATION_OVER, 0.2, 0.2]);
        })
    )
        .then(tpl => (
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => ([tpl, font]))
        ))
    .then(data => {

        tpl = data[0];
        font = data[1];

        return tpl.print(font, textData.placementX, textData.placementY, {
            text: textData.text,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, textData.maxWidth, textData.maxHeight);
    })
    .then(tpl => (tpl.quality(100).write(imgExported)))
    .then(tpl => {
        console.log('exported file: ' + imgExported);
    })
    .catch(err => {
        console.error(err);
    }));