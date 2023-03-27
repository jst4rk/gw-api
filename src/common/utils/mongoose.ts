export function filterLike(value: string) {
    return { $regex: value, $options: 'i' }
}