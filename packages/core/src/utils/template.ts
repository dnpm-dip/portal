export function template(
    str: string,
    data: Record<string, any>,
    regex = /\{\{(.+?)\}\}/g,
) : string {
    return Array.from(str.matchAll(regex))
        .reduce((
            acc,
            match,
        ) => {
            if (typeof data[match[1]] !== 'undefined') {
                return acc.replace(match[0], data[match[1]]);
            }

            return acc;
        }, str);
}
