import { Fragment, useState } from "react";
import RatesContainer from "../../../Containers/RatesContainer/RatesContainer";
import PageHeader from "../../../components/PageHeader/PageHeader";
import SubAppBar from "../../../utils/SubAppBar";

const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/admin",
  },
  {
    label: " التقييمات",
  },
].reverse();

/**
 * RatesPage
 *
 * This component renders the admin page for managing and viewing ratings (التقييمات).
 * It includes a breadcrumb header and the main content container for displaying ratings.
 *
 * @returns {JSX.Element} The rendered ratings management page.
 */
const RatesPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [mode, setMode] = useState(false);

  return (
    <Fragment>
      {/* <PageHeader breadcrumbs={breadcrumbs} heading={"التقييمات"} /> */}
      <SubAppBar
        title=" التقييمات "
        showRefreshButton={true}
        showViewToggle={true}
        onViewToggle={() => setMode(prev => !prev)}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <RatesContainer refresh={refresh} mode={mode} />
    </Fragment>
  );
};

export default RatesPage;
