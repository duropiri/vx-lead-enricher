// src/app/components/utils/editUtils.js

export const handleCellChange = (enrichedData, rowIndex, columnKey, value) => {
  const updatedData = [...enrichedData];
  updatedData[rowIndex][columnKey] = value;
  return updatedData;
};

export const handleHeaderEditEnd = (enrichedData, index, value) => {
  const updatedHeaders = [...Object.keys(enrichedData[0])];
  updatedHeaders[index] = value;
  const updatedData = enrichedData.map((row) => {
    const newRow = { ...row };
    delete newRow[Object.keys(enrichedData[0])[index]];
    newRow[value] = row[Object.keys(enrichedData[0])[index]];
    return newRow;
  });
  return updatedData;
};

// Function to update all cells in a specific column
