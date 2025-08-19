import { useState } from "react";
import useRandomNumber from "../../hooks/useRandomNumber";
import UsersContainer from "../../Containers/UsersContainer/UsersContainer";
import PageHeader from "../../components/PageHeader/PageHeader";
import SubAppBar from "../../utils/SubAppBar";

const breadcrumbs = [
  {
    label: "الرئيسية",
    to: "/admin",
  },
  {
    label: "المستخدمين",
  },
].reverse();

const UsersPage = () => {
  const [randomNumber, refreshRandomNumber] = useRandomNumber(1, 100);
  const [refresh, setRefresh] = useState(false);
  const [role, setRole] = useState("");
  const [mode, setMode] = useState(false);


  return (
    <div>
      <SubAppBar
        title="  المستخدمين"
        showViewToggle={true}
        onViewToggle={() => setMode( prev => !prev)}
         showRefreshButton={true}
       />
      <UsersContainer role={role} mode={mode} />
    </div>
  );
};

export default UsersPage;
