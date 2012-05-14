(function (window) {
	"use strict";

	/*
	*  Validations
	*/
	if (!window.hasOwnProperty("Worker")) { window.alert("Your browser doesn't support Web Workers."); }
	
	/*
	*  Helpers
	*/
	var document = window.document,
		Worker = window.Worker,

	/*
	*  Core
	*/
		SF = {
			"version": "0.1",
			"display": {
				"element": document.querySelector(".display"),
				"width": 900,
				"height": 500
			}
		};
	
	/*
	*  Private properties
	*/
	
	/*
	*  Private methods
	*/
	
	
	/*
	*  Public members
	*/
	SF.draw = function () {
		
	};
	
	SF.init = function () {
		
		// Request Animation Frame Polyfill
		var raf = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};

		// Return tick function
		return function init() {

			// Execute itself in Request Animation Frame
			raf(init);

			// Execute drawing method
			SF.draw();
		};
	};
	
	
	SF.Guy = (function () {
		
		// HTML Element of main character
		var guy = document.createElement("div"),
		// Horizontal center of character
			x = 450,
		// Vertical middle of character
			y = 172,
		
			speedX = 0,
			
			speedY = 10,
		// 
			mouseOffset = null,
			
			lastDirection = "center";
		
		function drive() {
			
			var direction;
			
			// Left area
			if (mouseOffset.x < x) {
				// Left-top area
				if (mouseOffset.y < y) {
					direction = "left";
					speedX = speedY = 0;
				// Left speedy area
				} else {
					// < 210 degrees
					if (x - mouseOffset.x > (mouseOffset.y - y) * 2) {
						direction = "left-bottom";
						speedX = -7;
						speedY = 4;
					// < 240 or < 270 defrees
					} else {
						if ((x - mouseOffset.x) * 2 > mouseOffset.y - y) {
							direction = "left-center";
							speedX = -4;
							speedY = 7;
						} else {
							direction = "center";
							speedX = 0;
							speedY = 10;
						}
					}
				}
				
			// Right area
			} else {
				// Right-top area
				if (mouseOffset.y < y) {
					direction = "right";
					speedX = speedY = 0;
				// Right speedy area
				} else {
					// > 330 degrees
					if (mouseOffset.x - x > (mouseOffset.y - y) * 2) {
						direction = "right-bottom";
						speedX = 7;
						speedY = 4;
					// > 330 or > 270 defrees
					} else {
						if ((mouseOffset.x - x) * 2 > mouseOffset.y - y) {
							direction = "right-center";
							speedX = 4;
							speedY = 7;
						} else {
							direction = "center";
							speedX = 0;
							speedY = 10;
						}
					}
				}
			}
			
			if (direction !== lastDirection) {
				guy.className = "guy " + (lastDirection = direction);
			}
		}

		// Set default class name with a centered position
		guy.className = "guy center";
		
		// Bind mouse event to drive the character
		SF.display.element.addEventListener("mousemove", function (event) {
			mouseOffset = {
				"x": event.offsetX,
				"y": event.offsetY
			};
		});
		
		// Append character element to display
		SF.display.element.appendChild(guy);
		
		// Limit mousemove execution
		setInterval(function () {

			if (!mouseOffset) { return; }

			drive();
			
			mouseOffset = null;

		}, 250);
		
		// Export the element
		return guy;
	}());

	/*
	*  Exports
	*/
	window.skifree = SF;

	/*
	*  Initialize
	*/
	SF.init();

}(window));