import { useContext, useEffect, useRef, useState } from "react";
import { useGetSubCatsQuery } from "../../redux/slice/user section/subCatsApi";
import { AdminContext } from "../../context/AdminProvider";
import { useParams } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageProvider";

export const useGetSubCat = ()=> {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { language } = useContext(LanguageContext);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);
  const { username,id } = useParams();
  const [subCat, setSubCat] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const pageCountSub = useRef();


  const {
    data: subCategories,
    isError,
    isSuccess,
    error,
    isLoading,
    isFetching: pending
  } = useGetSubCatsQuery(
    {
      resId: adminDetails && adminDetails.id,
      catId: id,
      word: debouncedSearch,
      page,
      language
    },
    { skip: !get }
  );

  console.log(subCategories);

  const handleUpdateUsername = () => {
    updateUsername(username);
  };
  useEffect(() => {
    handleUpdateUsername();
  }, []);

  useEffect(() => {
    if (adminDetails && Object.keys(adminDetails).length > 0) {
      setGet(true);
    }
  }, [adminDetails]);

  useEffect(() => {
    if (!pending && isSuccess) {
      setSubCat(subCategories.data);
      pageCountSub.current = subCategories.meta.total_pages
    }
  }, [pending, isSuccess, subCategories]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchWord);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchWord]);

  const onPress = (page) => {
    setPage(page);
  };

  return {pending, isError,error, subCat, debouncedSearch,searchWord, setSearchWord ,onPress,pageCountSub}
}