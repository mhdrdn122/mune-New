import { useState } from "react";
import { PermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";
 import TablesContainer from "../../../Containers/Tables/TablesContainer";
import SubAppBar from "../../../utils/SubAppBar";

const breadcrumbs = [
  {
    label: "الأصناف",
    to: "/admin",
  },
  {
    label: " الطاولات",
  },
].reverse();

/**
 * `TablesPage` renders the tables management interface.
 * It includes a header, permission-based "Add" button, and the tables list container.
 *
 * @returns {JSX.Element} Page component for managing tables
 */
const TablesPage = () => {
  const [showAddTable, setShowAddTable] = useState(false);
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const [mode, setMode] = useState(false);

  return (
    <div>
       

      <SubAppBar
        title=" الطاولات "
        showAddButton={true}
        showViewToggle={true}
        onViewToggle={() => setMode((prev) => !prev)}
        viewMode={mode}
        onAdd={() => setShowAddTable(true)}
        showRefreshButton={true}
        refresh={randomNumber}
        setRefresh={refreshRandomNumber}
        requiredPermission={{
          Add: PermissionsEnum.USER_ADD,
        }}
      />
      <TablesContainer
        showAddTable={showAddTable}
        handleCloasAddTable={() => setShowAddTable(false)}
        refresh={randomNumber}
        mode={mode}
      />
    </div>
  );
};

export default TablesPage;
