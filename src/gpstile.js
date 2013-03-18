var toGeoJSON = require('togeojson'),
    sph = require('sphericalmercator'),
    proj = new sph(),
    base = 'http://api.openstreetmap.org/api/0.6/trackpoints?bbox=',
    colors = ['cyan', 'magenta', 'yellow', '#96FFA7'];

function xml(url, callback) {
    var xhr = new XMLHttpRequest(),
        twoHundred = /^20\d$/;
    xhr.onreadystatechange = function() {
        if (4 == xhr.readyState && 0 !== xhr.status) {
            if (twoHundred.test(xhr.status)) {
                callback(null, xhr);
            } else {
                callback(xhr, null);
            }
        }
    };
    xhr.onerror = function(e) { return callback(e, null); };
    xhr.open('GET', url, true);
    xhr.send();
}

function gpsTile(xyz, canvas, cb) {
    var bbox = proj.bbox(xyz[0], xyz[1], xyz[2]);
    var url = base + bbox;
    xml(url, function(err, x) {
        if (err) return; // TODO: handle
        draw(canvas, xyz, toGeoJSON.gpx(x.responseXML));
        xml(url + '&page=1', function(err, x) {
            if (err) return; // TODO: handle
            draw(canvas, xyz, toGeoJSON.gpx(x.responseXML));
        });
        xml(url + '&page=2', function(err, x) {
            if (err) return; // TODO: handle
            draw(canvas, xyz, toGeoJSON.gpx(x.responseXML));
        });
        cb();
    });
}

function dist(a, b) {
    return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]));
}

function tileProj(ll, xyz) {
    var px = proj.px(ll, xyz[2]);
    px[0] -= xyz[0] * 256;
    px[1] -= xyz[1] * 256;
    return [~~px[0], ~~px[1]];
}

function draw(c, xyz, gj) {
    var ctx = c.getContext('2d'), px, color = 0;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.9;
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < gj.features.length; i++) {
        var f = gj.features[i],
            last = [];
        if (f.geometry.type == 'LineString') {
            var coords = f.geometry.coordinates;
            if (coords.length < 2) continue;
            ctx.strokeStyle = colors[color++ % 4];

            ctx.beginPath();
            last = px = tileProj(coords[0], xyz);
            ctx.moveTo(px[0], px[1]);

            for (var j = 1; j < coords.length; j++) {
                px = tileProj(coords[j], xyz);
                var d = dist(px, last);
                if (d > 30) {
                    ctx.stroke();
                    ctx.strokeStyle = colors[color++ % 4];
                    ctx.beginPath();
                    ctx.moveTo(px[0], px[1]);
                    last = px;
                } else if (d > 2) {
                    ctx.lineTo(px[0], px[1]);
                    last = px;
                }
            }
            ctx.stroke();
        }
    }
}

module.exports = gpsTile;
