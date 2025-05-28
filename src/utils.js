export function caseInsensitiveQueryValue(value) {
    return { $regex: new RegExp(`^${value}$`, "i") }
}