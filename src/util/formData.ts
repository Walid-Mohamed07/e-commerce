export const createFormData = <T extends object>(data: T) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  }

  return formData;
};
