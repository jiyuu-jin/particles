	
	/**
	 * With love.
	 * http://hakim.se/experiments/
	 * http://twitter.com/hakimel
	 */
	
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	
	var RADIUS = 110;
	
	var RADIUS_SCALE = 1;
	var RADIUS_SCALE_MIN = 1;
	var RADIUS_SCALE_MAX = 1.5;
	
	// The number of particles that are used to generate the trail
	var QUANTITY = 35;

	var CONVERGENCES = 7;

	var canvas;
	var context;
	var particles;


	//Initial Positions
    for (var i = 0; i < CONVERGENCES; i++){
        var mouseX = (Math.random() * 1000);
        var mouseY = (Math.random() * 1000);
        createParticles();
        console.log(mouseX, mouseY)
    }

	var mouseIsDown = false;
	
	init();

	function init() {

		canvas = document.getElementById( 'world' );
		
		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');
			
			// Register event listeners
			window.addEventListener('resize', windowResizeHandler, false);

        	windowResizeHandler();


            setInterval( randomPoint, 4000 );

            setInterval( loop, 1000 / 60 );
		}
	}

	function createParticles() {
		particles = [];
		
		for (var i = 0; i < QUANTITY; i++) {
			var particle = {
				position: { x: mouseX, y: mouseY },
				shift: { x: mouseX, y: mouseY },
				size: 1,
				angle: 0,
				speed: 0.01+Math.random()*0.02,
				targetSize: 1,
				fillColor: '#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16),
				orbit: RADIUS*.5 + (RADIUS * .5 * Math.random())
			};
			
			particles.push( particle );
		}
	}

	function randomPoint(){
        mouseX = (Math.random() * 1000);
        mouseY = (Math.random() * 1000);
	}
	
	function windowResizeHandler() {
		//SCREEN_WIDTH = window.innerWidth;
		//SCREEN_HEIGHT = window.innerHeight;
		
		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;
		
		canvas.style.position = 'absolute';
	}

	function loop() {
		
		if( mouseIsDown ) {
			// Scale upward to the max scale
			RADIUS_SCALE += ( RADIUS_SCALE_MAX - RADIUS_SCALE ) * (0.02);
		}
		else {
			// Scale downward to the min scale
			RADIUS_SCALE -= ( RADIUS_SCALE - RADIUS_SCALE_MIN ) * (0.02);
		}
		
		RADIUS_SCALE = Math.min( RADIUS_SCALE, RADIUS_SCALE_MAX );
		
		// Fade out the lines slowly by drawing a rectangle over the entire canvas
		context.fillStyle = 'rgba(0,0,0,0.05)';
   		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		
		for (i = 0, len = particles.length; i < len; i++) {
			var particle = particles[i];
			
			var lp = { x: particle.position.x, y: particle.position.y };
			
			// Offset the angle to keep the spin going
			particle.angle += particle.speed;
			
			// Follow mouse with some lag
			particle.shift.x += ( mouseX - particle.shift.x) * (particle.speed);
			particle.shift.y += ( mouseY - particle.shift.y) * (particle.speed);
			
			// Apply position
			particle.position.x = particle.shift.x + Math.cos(i + particle.angle) * (particle.orbit*RADIUS_SCALE);
			particle.position.y = particle.shift.y + Math.sin(i + particle.angle) * (particle.orbit*RADIUS_SCALE);
			
			// Limit to screen bounds
			particle.position.x = Math.max( Math.min( particle.position.x, SCREEN_WIDTH ), 0 );
			particle.position.y = Math.max( Math.min( particle.position.y, SCREEN_HEIGHT ), 0 );
			
			particle.size += ( particle.targetSize - particle.size ) * 0.05;
			
			// If we're at the target size, set a new one. Think of it like a regular day at work.
			if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
				particle.targetSize = 1 + Math.random() * 7;
			}
			
			context.beginPath();
			context.fillStyle = particle.fillColor;
			context.strokeStyle = particle.fillColor;
			context.lineWidth = particle.size;
			context.moveTo(lp.x, lp.y);
			context.lineTo(particle.position.x, particle.position.y);
			context.stroke();
			context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
			context.fill();
		}
	}


	function showInterface(){
		var element = document.getElementById('Interface');
		element.style.display = 'block';
	}

    function hideInterface(){
        var element = document.getElementById('Interface');
        element.style.display = 'none';
    }