export function getKey(token) {
    const binaryString = window.atob(token);
    const bytes = [];
    for (let i = 0; i < 16; i++) {
        bytes.push(binaryString.charCodeAt(i));
    }

    return bytes
        .map(b => (`00${b.toString(16)}`).slice(-2))
        .join('')
        .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}
