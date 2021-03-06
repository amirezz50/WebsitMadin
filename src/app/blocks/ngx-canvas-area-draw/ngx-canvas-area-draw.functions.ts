function lineLength(x, y, x0, y0) {
    return Math.sqrt(((x -= x0) * x) + ((y -= y0) * y));
}


function o(x, y, x0, y0, x1, y1) {
    let tuple;
    if (!(x1 - x0)) {
        tuple = {
            x: x0,
            y: y
        }
    } else if (!(y1 - y0)) {
        tuple = {
            x: x,
            y: y0
        }
    } else {
        const tg = -1 / ((y1 - y0) / (x1 - x0));
        const left = ((x1 * (x * tg - y + y0)) + (x0 * (x * -tg + y - y1))) / ((tg * (x1 - x0)) + y0 - y1);
        tuple = {
            x: left,
            y: (tg * left) - (tg * x) + y
        };
    }
    return tuple.x >= Math.min(x0, x1) && tuple.x <= Math.max(x0, x1) && tuple.y >= Math.min(y0, y1) && tuple.y <= Math.max(y0, y1)
}


export const dotLineLength = function (x, y, x0, y0, x1, y1) {
    if (!o(x, y, x0, y0, x1, y1)) {
        const l1 = lineLength(x, y, x0, y0),
            l2 = lineLength(x, y, x1, y1);
        return l1 > l2 ? l2 : l1;
    }
    else {
        const a = y0 - y1,
            b = x1 - x0,
            c = x0 * y1 - y0 * x1;
        return Math.abs((a * x) + (b * y) + c) / Math.sqrt((a * a) + (b * b));
    }
};
