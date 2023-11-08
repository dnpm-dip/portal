export function generateRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `#${intToRGB(hash)}`;
}

function intToRGB(i: number) {
    const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.substring(0, 6 - c.length) + c;
}
