import AdminSidebar from "../utils/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import AppBarComponent from "../utils/AppBarComponent";

function LayoutsAdmin() {
  return (
    <div className="d-flex min-h-screen flex-row-reverse">
      <AppBarComponent Role={"ADMIN"} />

      <AdminSidebar />

      <main className="content w-full mt-10 md:mt-15">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export default LayoutsAdmin;
