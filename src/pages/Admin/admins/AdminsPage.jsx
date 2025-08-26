
import React from "react";
import Page from "../../EmployeesPage";

const AdminsPage = () => {
  const breadcrumbs = [
    {
      label: "الرئيسية",
      to:"/admin",
    },
    {
      label: "الموظفين",
    },
  ].reverse();
  return <Page isSuperAdmin={false} breadCrumbs={breadcrumbs}/>
};

export default AdminsPage;
