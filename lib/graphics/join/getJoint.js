var isSegmentCross = require('../isSegmentCross');
var isBezierCross = require('../isBezierCross');
var isBezierSegmentCross = require('../isBezierSegmentCross');
var pathIterator = require('../pathIterator');
function hashcode(p) {
    return (p.x * 31 + p.y) * 31;
}
function getJoint(path, command, p0, p1, p2, index) {
    var joint = [];
    var result;
    pathIterator(path, function (c, t0, t1, t2, j) {
        if (c === 'L') {
            if (command === 'L') {
                result = isSegmentCross(p0, p1, t0, t1);
            } else if (command === 'Q') {
                result = isBezierSegmentCross(p0, p1, p2, t0, t1, t2);
            }
        } else if (c === 'Q') {
            if (command === 'L') {
                result = isBezierSegmentCross(t0, t1, t2, p0, p1);
            } else if (command === 'Q') {
                result = isBezierCross(t0, t1, t2, p0, p1, p2);
            }
        }
        if (result) {
            joint = joint.concat(result.map(function (p) {
                p.index0 = index;
                p.index1 = j;
                return p;
            }));
        }
    });
    var hash = {};
    for (var i = joint.length - 1; i >= 0; i--) {
        var p = joint[i];
        if (hash[hashcode(p)]) {
            joint.splice(i, 1);
        } else {
            hash[hashcode(p)] = true;
        }
    }
    return joint.length ? joint : false;
}
module.exports = getJoint;