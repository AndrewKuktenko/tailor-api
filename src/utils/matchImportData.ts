const matchImportData = (data: any[], defaultProperties: string[]) =>
  data
    .map((dataItem) => {
      const result = {
        properties: {},
      };
      defaultProperties.forEach(
        (property: string) =>
          (result.properties[property] = dataItem[property]),
      );
      return result;
    })
    .filter((item) => Object.keys(item).length > 0);

export { matchImportData };
