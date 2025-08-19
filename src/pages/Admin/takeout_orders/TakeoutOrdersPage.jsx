import { useState } from "react";
import useRandomNumber from "../../../hooks/useRandomNumber";
import TakeoutOrdersContainer from "../../../Containers/TakeOutContainer/TakeoutOrdersContainer";
import PageHeader from "../../../components/PageHeader/PageHeader";
import SubAppBar from "../../../utils/SubAppBar";

const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/admin",
  },
  {
    label: "الطلبات الخارجية",
  },
].reverse();

/**
 * `TakeoutOrdersPage` is the main page component for managing takeout orders.
 * It sets up the header and passes refresh logic to the container.
 *
 * @returns {JSX.Element}
 */
const TakeoutOrdersPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <SubAppBar
        title=" الطلبات الخارجية "
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <TakeoutOrdersContainer refresh={refresh} />
    </div>
  );
};

export default TakeoutOrdersPage;
