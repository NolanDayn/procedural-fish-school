class Fish {
    
    constructor (origin, scale) {
        // 12 segments, first 10 for body, last 2 for tail fin
        this.fishSegLength = 48 * scale
        this.fishVertebrae = 12
        this.spine = new Chain(origin, this.fishVertebrae, this.fishSegLength, Math.PI/8)

        this.bodyColor = 'rgb(159, 222, 254)';
        this.finColor =  'rgb(83, 203, 157)';
      
        // Width of the fish at each vertabra
        this.bodyWidth = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];

        // Scale all parts of fish for desired scale
        for (var i =0; i < this.bodyWidth.length; i++) {
            this.bodyWidth[i] = this.bodyWidth[i] * scale
        }

        this.pecFinWidth = 32 * scale
        this.pecFinLen   = 80 * scale
        this.venFinWidth = 16 * scale
        this.venFinLen   = 40 * scale
        this.eyeRadius   = 18 * scale  
    }

    resolve (targetX, targetY) {
        let headPos = this.spine.joints[0]
        
        let targetPos = new PVector(targetX, targetY)

        //targetPos = targetPos.add(headPos.heading());
        this.spine.resolve(targetPos);
    }

    display(ctx) {

        let j = this.spine.joints;
        let a = this.spine.angles;

        // Relative angle differences are used in some hacky computation for the dorsal fin
        let headToMid1 = relativeAngleDiff(a[0], a[6]);
        let headToMid2 = relativeAngleDiff(a[0], a[7]);

        // For the caudal fin, we need to compute the relative angle difference from the head to the tail, but given
        // a joint count of 12 and angle constraint of PI/8, the maximum difference between head and tail is 11PI/8,
        // which is >PI. This complicates the relative angle calculation (flips the sign when curving too tightly).
        // A quick workaround is to compute the angle difference from the head to the middle of the fish, and then
        // from the middle of the fish to the tail.
        let headToTail = headToMid1 + relativeAngleDiff(a[6], a[11]);
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (var i = 0; i < this.fishVertebrae; i++)
        {
            //ctx.ellipse(this.spine.joints[i].x, this.spine.joints[i].y, this.fishSegLength, this.bodyWidth[i], Math.PI/2, 0, 2 * Math.PI)
        }
        ctx.stroke();

        // Pectoral Fins
        ctx.beginPath()
        ctx.fillStyle = this.finColor
        ctx.ellipse(this.getPosX(3, Math.PI/3, 0), this.getPosY(3, Math.PI/3, 0), this.pecFinWidth, this.pecFinLen, a[2] + Math.PI/4, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(this.getPosX(3, -Math.PI/3, 0), this.getPosY(3, -Math.PI/3, 0), this.pecFinWidth, this.pecFinLen, a[2] - Math.PI/4, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        // Ventral Fins
        ctx.beginPath()
        ctx.fillStyle = this.finColor
        ctx.ellipse(this.getPosX(7, Math.PI/3, 0), this.getPosY(7, Math.PI/3, 0), this.venFinWidth, this.venFinLen, a[6] + Math.PI/4, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(this.getPosX(7, -Math.PI/3, 0), this.getPosY(7, -Math.PI/3, 0), this.venFinWidth, this.venFinLen, a[6] - Math.PI/4, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

        // Side 1 of the body
        ctx.beginPath();
        ctx.moveTo(this.getPosX(0, Math.PI/2, 0),this.getPosY(0, Math.PI/2, 0))
        for (var i = 0; i < 10; i++)
        {
            var x = this.getPosX(i, Math.PI/2, 0)
            var y = this.getPosY(i, Math.PI/2, 0)
            ctx.lineTo(x, y)
        }

        // Bottom of the fish
        ctx.lineTo(this.getPosX(9, Math.PI, 0), this.getPosY(9, Math.PI, 0));

        // Side 2 of the body
        //ctx.moveTo(this.getPosX(this.fishVertebrae - 1, -Math.PI/2, 0),this.getPosY(this.fishVertebrae - 1, -Math.PI/2, 0))
        for (var i = 9; i >= 0; i--)
        {
            var x = this.getPosX(i, -Math.PI/2, 0)
            var y = this.getPosY(i, -Math.PI/2, 0)
            ctx.lineTo(x, y)
        }

        //head
        // ctx.moveTo(this.getPosX(0, -Math.PI/2, 0),this.getPosY(0, -Math.PI/2, 0))
        ctx.lineTo(this.getPosX(0, -Math.PI/6, 0), this.getPosY(0, -Math.PI/6, 0));
        ctx.lineTo(this.getPosX(0, 0, 4), this.getPosY(0, 0, 4));
        ctx.lineTo(this.getPosX(0, Math.PI/6, 0), this.getPosY(0, Math.PI/6, 0));

        ctx.lineTo(this.getPosX(0, Math.PI/2, 0), this.getPosY(0, Math.PI/2, 0));
        ctx.lineTo(this.getPosX(1, Math.PI/2, 0), this.getPosY(1, Math.PI/2, 0));
        ctx.lineTo(this.getPosX(2, Math.PI/2, 0), this.getPosY(2, Math.PI/2, 0));
        ctx.fillStyle = this.bodyColor;
        ctx.fill()
        ctx.stroke();

        // eyes
        ctx.beginPath();
        ctx.ellipse(this.getPosX(0, Math.PI/2, -this.eyeRadius), this.getPosY(0, Math.PI/2, -this.eyeRadius), this.eyeRadius, this.eyeRadius, Math.PI/2, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fill()
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(this.getPosX(0, -Math.PI/2, -this.eyeRadius), this.getPosY(0, -Math.PI/2, -this.eyeRadius), this.eyeRadius, this.eyeRadius, Math.PI/2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke();
     

        // Claudal (Tail) Fin
        ctx.beginPath();
        for (var i = 8; i < 12; i++) {
            var tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
            ctx.lineTo(j[i].x + Math.cos(a[i] - Math.PI/2) * tailWidth, j[i].y + Math.sin(a[i] - Math.PI/2) * tailWidth);
        }

        for (var i = 11; i >= 8; i--) {
            var tailWidth = Math.max(-13, Math.min(13, headToTail * 6));
            ctx.lineTo(j[i].x + Math.cos(a[i] + Math.PI/2) * tailWidth, j[i].y + Math.sin(a[i] + Math.PI/2) * tailWidth);
        }

        ctx.fillStyle = this.finColor
        ctx.fill()
        ctx.stroke();


        // === START DORSAL FIN ===
        ctx.beginPath()
        ctx.moveTo(j[4].x, j[4].y)
        ctx.bezierCurveTo(j[5].x, j[5].y, j[6].x, j[6].y, j[7].x, j[7].y)
        ctx.bezierCurveTo(j[6].x + Math.cos(a[6] + Math.PI/2) * headToMid2 * 16, j[6].y + Math.sin(a[6] + Math.PI/2) * headToMid2 * 16, j[5].x + Math.cos(a[5] + Math.PI/2) * headToMid1 * 16, j[5].y + Math.sin(a[5] + Math.PI/2) * headToMid1 * 16, j[4].x, j[4].y)
        ctx.fill()
        ctx.stroke();
    // === END DORSAL FIN ===
    }

    // Various helpers to shorten lines
    getPosX(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].x + Math.cos(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
    }

    getPosY(i, angleOffset, lengthOffset) {
        return this.spine.joints[i].y + Math.sin(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset);
    }
}