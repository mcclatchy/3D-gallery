var targetModel = 1;
var currentModel = 0;
var loopLength;

/***************************************************************************
Gets model playlist
***************************************************************************/



var ajax = new XMLHttpRequest();

ajax.open('GET', 'static/data/gallery.json', true);
ajax.send();

ajax.onload = function (data) {
    data = JSON.parse(ajax.responseText);
    // results.innerHTML = e.target.response.message;
    queueAssets(currentModel, data);
    loopLength = data.length;

    // document.querySelector('#right').onclick = function() {
    //     targetModel = currentModel + 1;
    //     queueAssets(targetModel, data);
    //     document.getElementById('mtl' + targetModel).addEventListener('loaded', transitionModels());
    // };
    // document.querySelector('#left').onclick = function() {
    //     targetModel = currentModel - 1;
    //     queueAssets(targetModel, data);
    //     document.getElementById('mtl' + targetModel).addEventListener('loaded', transitionModels());
    // };
    console.log(data); // 'this is the returned object'
};

/***************************************************************************
- Queues assets for each model
***************************************************************************/
function queueAssets(targetModel, data) {
    var obj = data[targetModel]['obj'];
    var mtl = data[targetModel]['mtl'];

    var objAsset = document.createElement('a-asset-item');
    objAsset.setAttribute('id', 'obj' + targetModel);
    objAsset.setAttribute('src', obj);

    var mtlAsset = document.createElement('a-asset-item');
    mtlAsset.setAttribute('id', 'mtl' + targetModel);
    mtlAsset.setAttribute('src', mtl);

    document.getElementById('assets').appendChild(objAsset);
    document.getElementById('assets').appendChild(mtlAsset);

    displayModel(targetModel);
}

/***************************************************************************
- Displays models as entities within the scene
- Queues animations
***************************************************************************/
function displayModel(targetModel) {
    var model = document.createElement('a-entity');
    model.setAttribute('id', 'model' + targetModel);
    model.setAttribute('obj-model', 'obj: #obj' + targetModel + '; mtl: #mtl' + targetModel);
    model.setAttribute('position', '0 -7 0');
    model.setAttribute('rotation', '-90 0 0');
    model.setAttribute('scale', '.7 .7 .7');

    var animateIn = document.createElement('a-animation');
    animateIn.setAttribute('id', 'animate_in');
    animateIn.setAttribute('attribute', 'position');
    animateIn.setAttribute('begin', 'transition-in');
    animateIn.setAttribute('easing', 'ease-out');
    animateIn.setAttribute('to', '0 -7 0');
    animateIn.setAttribute('dur', '1500');

    var animateOut = document.createElement('a-animation');
    animateOut.setAttribute('id', 'animate_out');
    animateOut.setAttribute('attribute', 'position');
    animateOut.setAttribute('begin', 'transition-out');
    animateOut.setAttribute('easing', 'ease-out');
    animateOut.setAttribute('to', '0 -100 0');
    animateOut.setAttribute('dur', '1500');

    document.getElementById('scene').appendChild(model);
    document.getElementById('model' + targetModel).appendChild(animateOut);
    document.getElementById('model' + targetModel).appendChild(animateIn);
}

/***************************************************************************
Animates current object out and right/left object in
***************************************************************************/
function transitionModels() {
    document.querySelector('#model' + currentModel).emit('transition-out');
    document.querySelector('#model' + targetModel).emit('transition-in');

    setTimeout(removeCurrentModel, 1500);

    function removeCurrentModel() {
        document.querySelector('#model' + currentModel).parentNode.removeChild(document.querySelector('#model' + currentModel));
        currentModel = targetModel;
    }
    bookends();
}

/***************************************************************************
Checks for end of playlist
***************************************************************************/
function bookends() {
    if (targetModel + 1 == loopLength) {
        document.querySelector('#right').classList.add('inactive');
    } else if (targetModel === 0) {
        document.querySelector('#left').classList.add('inactive');
    } else {
        document.querySelector('#right').classList.remove('inactive');
        document.querySelector('#left').classList.remove('inactive');
    }
}

/***************************************************************************
- Establishes deeplinking
***************************************************************************/
var deeplink;

// Gets current model number
if (getQueryVariable('model') !== false) {
    deeplink = getQueryVariable('model') - 1;
} else {
    deeplink = 0;
}

currentModel = deeplink;

// Gets deeplink query in URL and shows corresponding model
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
