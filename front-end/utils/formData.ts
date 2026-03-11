export function buildUserFormData(data: any, isUpdate = false) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return
        if (value instanceof File) {
            formData.append(key, value)
            return
        }
        if (Array.isArray(value)) {
            value.forEach(v => formData.append(`${key}[]`, v))
            return
        }

        formData.append(key, String(value))
    })

    if (isUpdate) {
        formData.append("_method", "PUT")
    }

    return formData
}
