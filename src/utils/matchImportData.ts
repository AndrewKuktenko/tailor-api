const matchImportData = (data: any[], defaultProperties: string[]) =>
  data
    .map((dataItem) => {
      const result = {
        properties: {},
      };
      const updatedItem = {};

      defaultProperties.forEach((property) => {
        Object.keys(dataItem).forEach((key) => {
          const lowerCaseKey = key.trim().toLowerCase();
          if (lowerCaseKey.indexOf(property) !== -1) {
            const value = dataItem[key];
            if (!value || value.trim().toLowerCase() === 'null') return;
            updatedItem[property] = value.trim();
          }
        });
      });

      defaultProperties.forEach(
        (property: string) => result.properties[property] = updatedItem[property],
      );
      return result;
    })
    .filter((item) => Object.keys(item).length > 0);

export { matchImportData };
