// src/app/components/LeadEnricher.js
"use client"; // Required for client-side rendering

import { useState, useRef } from "react";
import { processFile, downloadCSV } from "./utils/csvUtils"; // Import functions from csvUtils
import { handleCellChange, handleHeaderEditEnd } from "./utils/editUtils"; // Import functions from editUtils
import "./LeadEnricher.css"; // Import CSS file

const LeadEnricher = () => {
  const [enrichedData, setEnrichedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [columnWidths, setColumnWidths] = useState({});
  const [isEditing, setIsEditing] = useState({ rowIndex: null, key: null });
  const [newColumnName, setNewColumnName] = useState("");
  const tableRef = useRef(null);

  const handleFileChange = (file) => {
    processFile(file, setEnrichedData, setErrorMessage);
  };

  const handleEditEnd = () => {
    setIsEditing({ rowIndex: null, key: null });
  };

  const addNewColumn = () => {
    if (!newColumnName) return; // Prevent adding an empty column name
    const updatedData = enrichedData.map((lead) => ({
      ...lead,
      [newColumnName]: "",
    }));
    setEnrichedData(updatedData);
    setNewColumnName("");
  };

  const updateColumn = (index, value) => {
    const updatedData = enrichedData.map((lead) => ({
      ...lead,
      [Object.keys(lead)[index]]: value, // Update the specified column with the new value
    }));
    setEnrichedData(updatedData);
  };

  const handleResize = (index, event) => {
    const startX = event.clientX;
    const initialWidth = columnWidths[index] || 100; // Default width

    const onMouseMove = (moveEvent) => {
      const newWidth = Math.max(initialWidth + moveEvent.clientX - startX, 50); // Minimum width of 50px
      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [index]: newWidth,
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="bg-[#1B1A17] p-5 rounded-lg flex flex-col items-start size-full overflow-hidden">
      <h2 className="text-[#C5A05E]">Upload your Realtor CSV file:</h2>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleFileChange(e.target.files[0])}
        className="mb-5"
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {enrichedData.length > 0 && (
        <div className="flex flex-col items-start w-full h-[80%]">
          <h3 className="text-[#C5A05E]">Enriched Data</h3>
          <button onClick={() => downloadCSV(enrichedData)} className="mb-5">
            Download Enriched CSV
          </button>
          <div className="size-full overflow-x-auto">
            <table ref={tableRef} className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#C5A05E]">
                  {Object.keys(enrichedData[0]).map((header, index) => (
                    <th
                      key={header}
                      className="border border-gray-300 p-2 text-[#1B1A17] relative"
                      style={{ width: columnWidths[index] || "auto" }}
                    >
                      {isEditing.rowIndex === null &&
                      isEditing.key === index ? (
                        <input
                          type="text"
                          defaultValue={header}
                          onBlur={() => {
                            const updatedData = handleHeaderEditEnd(
                              enrichedData,
                              index,
                              header
                            );
                            setEnrichedData(updatedData);
                            handleEditEnd();
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const updatedData = handleHeaderEditEnd(
                                enrichedData,
                                index,
                                e.target.value
                              );
                              setEnrichedData(updatedData);
                              handleEditEnd();
                            }
                          }}
                          className="w-full border-none bg-transparent text-[#C5A05E]"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() =>
                            setIsEditing({ rowIndex: null, key: index })
                          }
                          className="cursor-pointer"
                        >
                          {header}
                        </div>
                      )}
                      <div
                        onMouseDown={(e) => handleResize(index, e)}
                        className="cursor-col-resize w-1 h-full bg-[#C5A05E] absolute right-0 top-0"
                      />
                      {/* Input for updating the entire column */}
                      <input
                        type="text"
                        placeholder="Set column value"
                        className="mt-1 w-full border border-gray-300 rounded p-1"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            updateColumn(index, e.target.value); // Update entire column when Enter is pressed
                            e.target.value = ""; // Clear input after setting value
                          }
                        }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrichedData.map((lead, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(lead).map((key) => (
                      <td
                        key={key}
                        className="border border-gray-300 p-2 text-[#C5A05E] relative truncate-cell"
                      >
                        {isEditing.rowIndex === rowIndex &&
                        isEditing.key === key ? (
                          <input
                            type="text"
                            defaultValue={lead[key] || ""} // Allow empty values
                            onBlur={() => handleEditEnd()}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                const updatedData = handleCellChange(
                                  enrichedData,
                                  rowIndex,
                                  key,
                                  e.target.value
                                );
                                setEnrichedData(updatedData);
                                handleEditEnd();
                              }
                            }}
                            className="w-full border-none bg-transparent text-[#C5A05E]"
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => setIsEditing({ rowIndex, key })} // Make empty cells clickable
                            className="cursor-pointer w-full min-h-[20px] flex"
                          >
                            {lead[key] === "" ? "" : lead[key]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="New Column Name"
              className="mr-2 p-1"
            />
            <button onClick={addNewColumn}>Add Column</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadEnricher;
