import React from "react";
import { IconButton } from "@mui/material";
import { CgUnblock } from "react-icons/cg";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";
import useGetStyle from "../../hooks/useGetStyle";

/**
 * Table Component
 *
 * A reusable table component for displaying structured data with action buttons.
 * Features:
 * - Responsive design with right-to-left (RTL) support
 * - Loading state with cell-level skeletons for both headers and data
 * - Error handling with customizable error messages
 * - Dynamic column rendering with action buttons
 *
 * @param {Object} props
 * @param {Array<string>} props.columns - Array of column header labels
 * @param {Array<Object>} props.data - Array of row data objects
 * @param {Array<string>} props.fieldsToShow - Keys of fields to display from each data object
 * @param {boolean} props.isFetching - Indicates if data is being fetched
 * @param {Object} props.error - Error object for error state
 * @param {Array<Object>} props.actions - Array of action button configurations for each row
 */
const Table = ({ columns, data, fieldsToShow, isFetching, error, actions }) => {
  const { Color } = useGetStyle();

  return (
    <div style={{ padding: "16px", maxWidth: "100%" }}>
      <div
        className="table-responsive table_container"
        style={{
          overflowX: "auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <table
          className="table"
          dir="rtl"
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontFamily: '"Roboto", "Noto Sans Arabic", sans-serif',
          }}
        >
          {/* Table Header */}
          <thead>
            <tr>
              {isFetching
                ? // Render skeletons for column headers during loading
                  columns?.map((_, index) => (
                    <th
                      key={`header-skeleton-${index}`}
                      style={{
                        padding: "14px 20px",
                        borderBottom: "2px solid #e0e0e0",
                        backgroundColor: Color ? "#" + Color : "#2F4B26",
                      }}
                    >
                      <DynamicSkeleton
                        count={1}
                        variant="text"
                        height={24}
                        animation="wave"
                        spacing={0}
                        columns={{ xs: 12 }}
                        sx={{
                          bgcolor: "gray.300",
                          borderRadius: "4px",
                          width: "60%",
                          margin: "0 auto",
                        }}
                      />
                    </th>
                  ))
                : // Render actual column headers
                  columns?.map((col, index) => (
                    <th
                      key={`header-${col}-${index}`}
                      style={{
                        textAlign: "center",
                        backgroundColor: Color ? "#" + Color : "#2F4B26",
                        color: "#fff",
                        padding: "14px 20px",
                        fontWeight: "600",
                        fontSize: "16px",
                         whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody style={{ backgroundColor: "#fff" }}>
            {isFetching ? (
              // Render cell-level skeletons for loading state
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr
                  key={`row-skeleton-${rowIndex}`}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "#f9fafb" : "#fff",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {columns.map((_, colIndex) => (
                    <td
                      key={`cell-skeleton-${rowIndex}-${colIndex}`}
                      style={{
                        textAlign: "center",
                        padding: "14px 20px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <DynamicSkeleton
                        count={1}
                        variant="rect"
                        height={32}
                        animation="wave"
                        spacing={0}
                        columns={{ xs: 12 }}
                        sx={{
                          bgcolor: "grey.200",
                          borderRadius: "4px",
                          width:
                            colIndex === columns.length - 1 && actions
                              ? "80px"
                              : "90%",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              // Error state
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      color: "#d32f2f",
                      fontSize: "16px",
                      fontWeight: "500",
                      margin: 0,
                    }}
                  >
                    {error.data?.message ||
                      "An error occurred while fetching data"}
                  </p>
                </td>
              </tr>
            ) : data?.length ? (
              // Data rendering
              data.map((item, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  style={{
                    backgroundColor: rowIndex % 2 === 0 ? "#f9fafb" : "#fff",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {fieldsToShow.map((field, colIndex) => (
                    <td
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={{
                        textAlign: "center",
                        padding: "14px 20px",
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: "14px",
                        color: "#1f2937",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {field === "is_active"
                        ? item[field] === 1
                          ? "نشط"
                          : "معطل"
                        : item[field] ?? "---"}
                    </td>
                  ))}

                  {/* Action Buttons */}
                  {actions && (
                    <td
                      style={{
                        textAlign: "center",
                        padding: "14px 20px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {actions.map((action, actionIndex) => (
                        <IconButton
                          key={`action-${actionIndex}`}
                          sx={{
                            color: Color ? "#" + Color : "#2F4B26",
                            "&:hover": {
                              color: "#1b2f17",
                              backgroundColor: "#f3f4f6",
                            },
                            margin: "0 4px",
                            padding: "8px",
                          }}
                          onClick={() => action.onClickFunction(item)}
                        >
                          {typeof action.icon === "function" ? (
                            action.icon(item)
                          ) : action?.name === "active" ? (
                            item["is_active"] ? (
                              action?.icon
                            ) : (
                              <CgUnblock size={20} />
                            )
                          ) : (
                            action?.icon
                          )}
                        </IconButton>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              // No data found
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "16px",
                      fontWeight: "500",
                      margin: 0,
                    }}
                  >
                    لا توجد بيانات
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
