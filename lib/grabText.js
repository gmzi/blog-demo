export async function grabText(target) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            resolve(e.target.result)
        };
        reader.onerror = reject;
        reader.readAsText(target)
    })
}