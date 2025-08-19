export const cleanFormData = (data) => {
  // Create a shallow copy of the form data to avoid mutating the original object
  const cleanedData = { ...data };

  // Iterate over each key and remove keys with empty values
  Object.keys(cleanedData).forEach((key) => {
    if (
      cleanedData[key] === "" ||
      cleanedData[key] === null ||
      cleanedData[key] === undefined
    ) {
      delete cleanedData[key];
    }
  });

  return cleanedData;
};