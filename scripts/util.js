class PVector {
    constructor(x, y) {
        this.x = x
        this.y = y
    } 

    sub (v) {
        var x = this.x - v.x
        var y = this.y - v.y
        return new PVector(x,y)
    }

    add (v) {
        let x = this.x + v.x
        let y = this.y + v.y
        return new PVector(x,y)
    }

    scale (scale) {
        let x = this.x * scale
        let y = this.y * scale 
        return new PVector(x, y)
    }

    getMag () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    setMag (newMag) {
        let oldMag = this.getMag()
        let newX = this.x * newMag / oldMag
        let newY = this.y * newMag / oldMag

        return new PVector(newX, newY)
    }

    heading (nextP) {
        var x = nextP.x - this.x
        var y = nextP.y - this.y
        return Math.atan2(y, x)
    }

    toAngle() {
        return Math.atan2(this.y, this.x)
    }

    normalize () {
        var mag = this.getMag()
        return new PVector(this.x / mag, this.y /mag)
    }
}

function vecAdd(v1 , v2) {
    let x = v1.x + v2.x
    let y = v1.y + v2.y
    return new PVector(x,y)
}

// Constrain the vector to be at a certain range of the anchor
function constrainDistance(pos, anchor, constraint) {
    return pos.add(anchor, pos.sub(pos, anchor).setMag(constraint));
}

// Constrain the angle to be within a certain range of the anchor
function constrainAngle(angle, anchor, constraint) {
    if (Math.abs(relativeAngleDiff(angle, anchor)) <= constraint) {
       return simplifyAngle(angle);
    }

    if (relativeAngleDiff(angle, anchor) > constraint) {
      return simplifyAngle(anchor - constraint);
    }
    return simplifyAngle(anchor + constraint);
}

// i.e. How many radians do you need to turn the angle to match the anchor?
function relativeAngleDiff(angle, anchor) {
    // Since angles are represented by values in [0, 2pi), it's helpful to rotate
    // the coordinate space such that PI is at the anchor. That way we don't have
    // to worry about the "seam" between 0 and 2pi.
    angle = simplifyAngle(angle + Math.PI - anchor);
    anchor = Math.PI;

    return anchor - angle;
}

// Simplify the angle to be in the range [0, 2pi)
function simplifyAngle(angle) {
    while (angle >= Math.PI * 2) {
        angle -= Math.PI * 2;
    }

    while (angle < 0) {
        angle += Math.PI * 2;
    }

    return angle;
}

function fromAngle (angle) {
    return new PVector(Math.cos(angle), Math.sin(angle))
}