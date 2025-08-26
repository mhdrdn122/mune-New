import { Fragment, useState } from "react";
import AdminSidebar from "../utils/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import SuperAdminSidebar from "../utils/super_admin/SuperAdminSidebar";
import AppBarComponent from "../utils/AppBarComponent";

function LayoutSuperAdmin() {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="d-flex flex-row-reverse">
        <AppBarComponent Role={"SUPER ADMIN"} />

      <SuperAdminSidebar isSidebar={isSidebar} />

      <main className="content   flex items-start mt-10 md:mt-15 w-full ">

        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export default LayoutSuperAdmin;
