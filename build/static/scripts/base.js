$(document).ready(function() {

    var targetModel = 1;
    var currentModel = 0;

    /***************************************************************************
    Gets model playlist
    ***************************************************************************/
    $.getdata('gallery.json', function(data) {
        queueAssets(currentModel, data);
        var loopLength = data.length;

        $('#next').click(function test() {
            targetModel = currentModel + 1;
            queueAssets(targetModel, data);
            document.getElementById("mtl" + targetModel).addEventListener("loaded", transitionModels());
        });
        $('#prev').click(function () {
            targetModel = currentModel - 1;
            queueAssets(targetModel, data);
            document.getElementById("mtl" + targetModel).addEventListener("loaded", transitionModels());
        });
    });

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
    Animates current object out and next/prev object in
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
            $('#next').hide();
        } else if (targetModel === 0) {
            $('#prev').hide();
        } else {
            $('#next').show();
            $('#prev').show();
        }
    }

    /***************************************************************************
    - Establishes deeplinking
    ***************************************************************************/

    // Gets current model number
    if (getQueryVariable('model') !== false) {
        var deeplink = getQueryVariable('model') - 1;
    } else {
        deeplink = 0;
    }

    currentModel = deeplink;

    // Gets deeplink query in URL and shows corresponding model
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
});
