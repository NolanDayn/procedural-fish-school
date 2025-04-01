class Fish {
    
    constructor (origin) {
        // 12 segments, first 10 for body, last 2 for tail fin
        this.fishSegLength = 48
        this.fishVertebrae = 12
        this.spine = new Chain(origin, this.fishVertebrae, this.fishSegLength, Math.PI/8)

        this.bodyColor = (58, 124, 165);
        this.finColor =  (129, 195, 215);
      
        // Width of the fish at each vertabra
        this.bodyWidth = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];
    }

    resolve (targetX, targetY) {
        let headPos = this.spine.joints[0]
        let currentDirection = this.spine.joints[1].heading(headPos);
        
        let targetPos = new PVector(targetX, targetY)

        // Check if we have reached target Pos 
        if (headPos.sub(targetPos).getMag() < 10) {
            return;
        }

        if (relativeAngleDiff(headPos.heading(targetPos), currentDirection) > 1 ) {
            return;
        }

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
        console.log(headToTail)

        ctx.beginPath();
        for (var i = 0; i < this.fishVertebrae; i++)
        {
            //ctx.ellipse(this.spine.joints[i].x, this.spine.joints[i].y, this.fishSegLength, this.bodyWidth[i], Math.PI/2, 0, 2 * Math.PI)
        }
        ctx.stroke();

        // Pectoral Fins
        ctx.beginPath()
        ctx.fillStyle = "green"
        ctx.ellipse(this.getPosX(3, Math.PI/3, 0), this.getPosY(3, Math.PI/3, 0), 32, 80, a[2] + Math.PI/4, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(this.getPosX(3, -Math.PI/3, 0), this.getPosY(3, -Math.PI/3, 0), 32, 80, a[2] - Math.PI/4, 0, 2 * Math.PI)
        
        ctx.fill()
        ctx.stroke()
        // Ventral Fins

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
        ctx.fillStyle = "lightblue";
        ctx.fill()
        ctx.stroke();

        ctx.beginPath();
        // eyes
        ctx.ellipse(this.getPosX(0, Math.PI/2, -18), this.getPosY(0, Math.PI/2, -18), 18, 18, Math.PI/2, 0, 2 * Math.PI)
        ctx.fillStyle = "white";
        ctx.fill()
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(this.getPosX(0, -Math.PI/2, -18), this.getPosY(0, -Math.PI/2, -18), 18, 18, Math.PI/2, 0, 2 * Math.PI)
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

        ctx.fillStyle = 'green'
        ctx.fill()
        ctx.stroke();


        // === START DORSAL FIN ===
        ctx.beginPath()
        ctx.moveTo(j[4].x, j[4].y)
        ctx.bezierCurveTo(j[5].x, j[5].y, j[6].x, j[6].y, j[7].x, j[7].y)
        ctx.bezierCurveTo(j[6].x + Math.cos(a[6] + Math.PI/2) * headToMid2 * 16, j[6].y + Math.sin(a[6] + Math.PI/2) * headToMid2 * 16, j[5].x + Math.cos(a[5] + Math.PI/2) * headToMid1 * 16, j[5].y + Math.sin(a[5] + Math.PI/2) * headToMid1 * 16, j[4].x, j[4].y)
        //vertex(j.get(4).x, j.get(4).y);
        //bezierVertex(j.get(5).x, j.get(5).y, j.get(6).x, j.get(6).y, j.get(7).x, j.get(7).y);
        //bezierVertex(j.get(6).x + cos(a.get(6) + PI/2) * headToMid2 * 16, j.get(6).y + sin(a.get(6) + PI/2) * headToMid2 * 16, j.get(5).x + cos(a.get(5) + PI/2) * headToMid1 * 16, j.get(5).y + sin(a.get(5) + PI/2) * headToMid1 * 16, j.get(4).x, j.get(4).y);
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