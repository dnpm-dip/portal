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
            const key = match[1];
            if (key !== undefined && typeof data[key] !== 'undefined') {
                return acc.replace(match[0], data[key]);
            }

            return acc;
        }, str);
}
