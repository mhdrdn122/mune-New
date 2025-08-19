import { IconButton } from '@mui/material';
import { Spinner } from 'react-bootstrap';
import { CgUnblock } from 'react-icons/cg';

/**
 * Table Component
 *
 * Reusable table layout for displaying structured data with action buttons.
 * Handles:
 * - Loading state
 * - Error display
 * - Data rendering with dynamic columns
 *
 * @param {Object} props
 * @param {Array<string>} props.columns - Table headers
 * @param {Array<Object>} props.data - Table row data
 * @param {Array<string>} props.fieldsToShow - Field keys to render from each data object
 * @param {boolean} props.isFetching - Loading state
 * @param {Object} props.error - Error object
 * @param {Array<Object>} props.actions - List of action buttons for each row (e.g., view, edit, delete)
 */
const Table = ({ columns, data, fieldsToShow, isFetching, error, actions }) => {
  return (
    <div>
      <div className="table-responsive table_container ">
        <table className="table" dir="rtl">
          {/* Table Header */}
          <thead>
            <tr>
              {columns?.map((col, index) => (
                <th
                  key={col}
                  style={{
                    textAlign: "center",
                    backgroundColor:"#2F4B26"
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white">
            {isFetching ? (
              // Loading State
              <tr>
                <td colSpan="7">
                  <div className="my-4 text-center">
                    <p className="mb-2">جار التحميل</p>
                    <Spinner className="m-auto" animation="border" role="status" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              // Error State
              <tr>
                <td colSpan="7">
                  <p className="my-5">{error.data?.message || "حدث خطأ أثناء تحميل البيانات"}</p>
                </td>
              </tr>
            ) : data?.length ? (
              // Data Rendering
              data.map((item, i) => (
                <tr key={i}>
                  {fieldsToShow.map((field, j) => (
                    <td key={`${i}-${j}`} style={{ textAlign: "center" }}>
                      {field === "is_active"
                        ? item[field] === 1
                          ? "Active"
                          : "Disabled"
                        : item[field] ?? "---"}
                    </td>
                  ))}

                  {/* Action Buttons */}
                  {actions && (
                    <td style={{ textAlign: "center" }}>
                      {actions.map((action, k) => (
                        <IconButton
                          key={k}
                          sx={{ color: "#2F4B26" }}
                          onClick={() => action.onClickFunction(item)}
                        >
                           {typeof action.icon === "function" ? action.icon(item) : action?.name === 'active' ? item['is_active'] ? action?.icon : <CgUnblock/> : action?.icon}
                        </IconButton>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              // No Data Found
              <tr>
                <td colSpan="5">
                  <p className="my-5">لا توجد بيانات</p>
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
