class Chain {
    constructor(origin, jointCount, linkSize, angleConstraint) {

        this.linkSize = linkSize
        this.angleConstraint = angleConstraint
        this.joints = new Array()
        this.angles = new Array()
        this.joints.push(origin)
        this.angles.push(0)
        for (let i =1; i < jointCount; i++) {
            this.joints.push(vecAdd(this.joints[i-1], new PVector(0, this.linkSize)));
            this.angles.push(0)
        }
    }

    resolve(input_pos) {
        this.angles[0] = this.joints[0].heading(input_pos)
        this.joints[0] = input_pos
        this.joints[0] = input_pos
        var length = this.linkSize
        for (var i = 0; i < this.joints.length - 1; i++) {
            // Pull segment by the previous one
            this.joints[i + 1] = this.constrainDistanceAngle(this.joints[i + 1], this.joints[i], this.angles[i], length)
            this.angles[i + 1] = this.joints[i + 1].heading(this.joints[i])

        }
    }

    display(ctx) {
        ctx.beginPath();
        for (let i = 0; i < this.joints.length - 1; i++) {
            let startJoint = this.joints[i];
            let endJoint = this.joints[i + 1];
            ctx.lineTo(startJoint.x, startJoint.y, endJoint.x, endJoint.y);
        }

        for (let i = 0; i < this.joints.length - 1; i++) {
           ctx.ellipse(this.joints[i].x, this.joints[i].y, 16, 16, Math.PI/2, 0, 2 * Math.PI)
        }
        ctx.stroke();
    }
 
    //Projects 'point' to be within 'distance' of 'anchor'
    constrainDistance(point, anchor, distance) {
        var delta = point.sub(anchor)
        var direction = delta.normalize() 
        var constDist = direction.scale(distance)
        return constDist.add(anchor)
    }

    constrainDistanceAngle(point, anchor, lastAngle, distance) {
        var angle =  point.heading(anchor)
        let angleC = constrainAngle(angle, lastAngle, 0.4)
        let newP = fromAngle(angleC)
        let jointC = newP.scale(distance)
        return anchor.sub(jointC)
    }
}