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
      <SuperAdminSidebar isSidebar={isSidebar} />

      <main className="content   flex items-start pt-[90px] w-full ">
        <AppBarComponent Role={"SUPER ADMIN"} />

        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export default LayoutSuperAdmin;
