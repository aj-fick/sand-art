export const clamp = (input: number, min: number, max: number): number => {
    return Math.min(Math.max(input, min), max);
}

export const isWithinCanvas = (
    mouseX: number,
    mouseY: number,
    canvasX: number,
    canvasY: number
): boolean => {
    if (mouseX < 0 || mouseX > canvasX) {
        return false;
    }

    if (mouseY < 0 || mouseY > canvasY) {
        return false;
    }

    return true;
}

export const incrementHue = (og: number, changeSpeed: number): number => {
    let nue = og + (.5 * changeSpeed);

    if (nue >= 360) {
      return 0;
    }

    return nue;
}

export const randomCallback = <T>(...callbacks: (() => T)[]): T => {
    const index = Math.floor(Math.random() * callbacks.length);

    return callbacks[index]();
}