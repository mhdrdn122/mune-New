import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { AdminContext } from "../../../context/AdminProvider";

const Search = ({ searchWord, setSearchWord, language }) => {
  const { adminDetails } = useContext(AdminContext);
  const [heSaidNo, setHeSaidNo] = useState(localStorage.getItem('heSaidNo')); 

  return (
    <div
      className="containerSearch"
      style={{
        // right: language === "en" ? adminDetails.is_order === 1 ?  "80px" : "60px" : "",
        // left: language === "ar" ?  adminDetails.is_order === 1 ? "80px" : "60px" : "",
        left:adminDetails?.menu_template_id==6?"60px":heSaidNo?"40px":"75px"
      }}
    >
      <Form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", alignItems: "center" }}
        className="search-form mx-3"
      >
        <input
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          type=""
          lang="ar"
          placeholder={language === "en" ? "Search..." : "...ابحث"}
          // className="form-search py-2 h-100"
          className="search-field"
          style={{ textAlign: language === "en" ? "" : "right" }}
        />
      </Form>
    </div>
  );
};

export default Search;
