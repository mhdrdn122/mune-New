import { useState } from "react";
import { PermissionsEnum } from "../../../constant/permissions";
import useRandomNumber from "../../../hooks/useRandomNumber";
import PageHeader from "../../../components/PageHeader/PageHeader";
import TablesContainer from "../../../Containers/Tables/TablesContainer";

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

  return (
    <div>
      <PageHeader 
        breadcrumbs={breadcrumbs}
        buttonText={"إضافة"}
        heading={"الطاولات"}
        onButtonClick={() => setShowAddTable(true)}
        refreshRandomNumber={refreshRandomNumber}
        requiredPermission={PermissionsEnum.TABLE_ADD}
      />
      <TablesContainer
        showAddTable={showAddTable}
        handleCloasAddTable={() => setShowAddTable(false)}
        refresh={randomNumber}
      />
    </div>
  );
};

export default TablesPage;
