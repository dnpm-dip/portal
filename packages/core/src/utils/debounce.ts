export function debounce(fn: (...args: any[]) => any, ms: number = 0) {
    let timeoutId : ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
        clearTimeout(timeoutId);

        // eslint-disable-next-line prefer-spread
        timeoutId = setTimeout(() => fn.apply(null, args), ms);
    };
}
