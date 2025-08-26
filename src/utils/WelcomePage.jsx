import { Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate(`/${name}`);
  };
  return (
    <div className="container " style={{ height: "calc(100vh - 70px)", backgroundColor: "" }}>
      <nav
        className="d-flex align-items-center justify-content-end"
        style={{ height: "70px" }}
      >
        <ul className="d-flex gap-5">
          <Link to="/admin/login">
            <li className="" style={{ listStyle: "none" }}>
              Admin
            </li>
          </Link>
          <Link to="/super_admin/login">
            <li style={{ listStyle: "none" }}>Super Admin</li>
          </Link>
        </ul>
      </nav>
      <form className="h-100 d-flex flex-column align-items-center justify-content-center">
        <label htmlFor="name" className="text-center w-100 mb-1">
          :ادخل الاسم
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-50 rounded p-1"
        />

        <Button
          type="submit"
          variant="outlined"
          color="inherit"
          sx={{ mt: "10px" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default WelcomePage;
