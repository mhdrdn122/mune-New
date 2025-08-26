import { useState } from "react";
 import UsersContainer from "../../Containers/UsersContainer/UsersContainer";
 import SubAppBar from "../../utils/SubAppBar";

 

const UsersPage = () => { 
  const [role, setRole] = useState("");
  const [mode, setMode] = useState(false);

  return (
    <div>
      <SubAppBar
        title="  المستخدمين"
        showViewToggle={true}
        onViewToggle={() => setMode((prev) => !prev)}
        showRefreshButton={true}
      />
      <UsersContainer role={role} mode={mode} />
    </div>
  );
};

export default UsersPage;
