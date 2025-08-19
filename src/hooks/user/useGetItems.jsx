import { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../../context/AdminProvider";
import { useParams } from "react-router-dom";
import { useGetItemsQuery } from "../../redux/slice/user section/itemsApi";
import { LanguageContext } from "../../context/LanguageProvider";

export const useGetItems = () => {
  
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { username, id, id2 } = useParams();
  const [items, setItems] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const pageCountItems = useRef();


  const {
    data: itemsData,
    isError,
    isSuccess,
    error,
    isLoading: pending,
  } = useGetItemsQuery(
    {
      catId: parseInt(id2) !== 0 ? id2 : id,
      word: debouncedSearch,
      page,
      language,
    },
    { skip: !get }
  );

  console.log(itemsData);

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
      setItems(itemsData.data);
      pageCountItems.current = itemsData?.meta?.total_pages
    }
  }, [pending, isSuccess, itemsData]);

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

  return {
    pending,
    isError,
    error,
    items,
    debouncedSearch,
    searchWord,
    setSearchWord,
    onPress,
    pageCountItems,
    adminDetails
  };
};
