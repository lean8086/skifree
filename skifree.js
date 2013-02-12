/**
 * It's a very old experiment adapted to use the strict statement.
 */
(function (window) {
    'use strict';

    var document = window.document,
        Math = window.Math,
        display = document.getElementById('display'),

        stageSpeedX = 0,
        stageSpeedY = 10,
        stageWidth = 960,
        stageHeight = 400,
        latestDirection,

        guy = document.getElementById('guy'),
        guyX = 480,
        guyY = 116,
        guySpritePositions = {
            'left': '-128px 0',
            'lb': '-160px 0',
            'lc': '-192px 0',
            'center': '0 0',
            'rc': '-32px 0',
            'rb': '-64px 0',
            'right': '-96px 0'
        },

        obstacleElement = document.createElement('div'),
        obstacleTypes = [
            { 'width': 28, 'height': 32, 'sprite': '0 -31px', 'index': -1 }, // Tree
            { 'width': 21, 'height': 27, 'sprite': '0 -103px', 'index': -1 }, // Fired tree
            { 'width': 32, 'height': 64, 'sprite': '-96px -66px', 'index': -1 }, // Pine
            { 'width': 64, 'height': 32, 'sprite': '-187px -31px', 'index': -5 }, // Hills
            { 'width': 16, 'height': 4, 'sprite': '-143px -59px', 'index': -5 }, // Little hill
            { 'width': 24, 'height': 8, 'sprite': '-150px -31px', 'index': -5 }, // Medium hill
            { 'width': 23, 'height': 11, 'sprite': '-30px -52px', 'index': -5 }, // Rock
            { 'width': 32, 'height': 8, 'sprite': '-109px -55px', 'index': -5 } // Ramp
        ],
        moveEvent = document.createEvent('Event');

    function moveGuy(event) {

        var x = event.offsetX,
            y = event.offsetY,

            alphaX = Math.abs(x - guyX),
            betaX = alphaX * 2,

            alphaY = Math.abs(y - guyY),
            betaY = alphaY * 2,

            alpha = (alphaX > betaY),
            beta = (betaX > alphaY),

            // [Direction, Stage speed X, Stage speed Y]
            data = (x < guyX)
                ? (y < guyY)
                    ? ['left', 0, 0]
                    : alpha
                        ? ['lb', -7, 4]
                        : beta
                            ? ['lc', -4, 7]
                            : ['center', 0, 10]

                : (y < guyY)
                    ? ['right', 0, 0]
                    : alpha
                        ? ['rb', 7, 4]
                        : beta
                            ? ['rc', 4, 7]
                            : ['center', 0, 10];

        if (latestDirection === data[0]) { return; }

        guy.style.backgroundPosition = guySpritePositions[data[0]];
        stageSpeedX = data[1];
        stageSpeedY = data[2];

        latestDirection = data[0];
    }

    function Obstacle(data) {

        var element = obstacleElement.cloneNode(),
            left = Math.random() * stageWidth - data.width,
            top = stageHeight;

        element.className = 'obstacle';
        element.style.cssText = [
            'width:' + data.width + 'px',
            'height:' + data.height + 'px',
            'background-position:' + data.sprite,
            'z-index:' + data.index,
            'left:' + left + 'px',
            'top:' + top + 'px'
        ].join(';');

        display.appendChild(element);

        document.addEventListener('moveObstacles', function moveThis() {

            // Into viewport, move!
            element.style.left = (left -= stageSpeedX) + 'px';
            element.style.top = (top -= stageSpeedY) + 'px';

            // Out of viewport, kill!
            if (top < -data.height) {
                display.removeChild(element);
                document.removeEventListener('moveObstacles', moveThis);
            }
        });
    }

    /**
     * Initialization
     */
    window.onload = function () {

        moveEvent.initEvent('moveObstacles', true, true);

        display.addEventListener('mousemove', moveGuy);

        // Create obstacles
        window.setInterval(function () {
            if (stageSpeedX !== 0 || stageSpeedY !== 0) {

                var randomObstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

                new Obstacle(randomObstacle);
            }
        }, 150);

        // Move obstacles
        window.setInterval(function () {
            if (stageSpeedX !== 0 || stageSpeedY !== 0) {
                document.dispatchEvent(moveEvent);
            }
        }, 1000 / 30);
    };

}(this));