export function createTemperatureField(width, height, initialTemp = 20) {
    return {
        width,
        height,
        data: new Float32Array(width * height).fill(initialTemp)
    }
}

export function idx(x, y, w) {
    return y * w + x;
}

export function diffuse(field, alpha = 0.1) {
    const { width, height, data } = field;
    const next = new Float32Array(data.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const i = idx(x, y, width);
            const left = data[idx(x - 1, y, width)];
            const right = data[idx(x + 1, y, width)];
            const up = data[idx(x, y - 1, width)];
            const down = data[idx(x, y + 1, width)];

            const laplacian = left + right + up + down - 4 * data[i];

            // Explicit Euler integration
            next[i] = data[i] + alpha * laplacian;
        }
    }

    field.data = next;
}

export function addHeat(field, wx, wy, amount) {
    console.log("Adding heat at", wx, wy, "amount", amount);
    const x = wx;
    const y = wy;

    console.log(x, y);

    if (x < 0 || y < 0 || x >= field.width || y >= field.height) return;

    field.data[idx(x, y, field.width)] += amount;
}

