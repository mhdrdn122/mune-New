export const transformToArrayOptions = (array, keys) => {
    if (!array || !Array.isArray(array) || array.length === 0) return [];

    const optionArray = array.map((item) => {
      return {
        value: item[keys.value],
        label: item[keys.label],
      };
    });

    return optionArray;
  };