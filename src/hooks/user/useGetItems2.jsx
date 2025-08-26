import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminProvider";
import { useParams } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageProvider";
import { useGetItemsQuery } from "../../redux/slice/user section/itemsApi";

export const useGetItems2 = (subcategoryId) => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { username ,id } = useParams();
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [get, setGet] = useState(false);
  const [page, setPage] = useState(1);
  const { language } = useContext(LanguageContext);

  const {
    data: itemsData,
    isError,
    isSuccess,
    error,
    isLoading: pending,
    refetch,
  } = useGetItemsQuery(
    {
        catId: subcategoryId,
        word: debouncedSearch,
        page,
        language,
      },
    { skip: !get || !subcategoryId } // Skip if no subcategory selected
  );


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
    if (adminDetails && Object.keys(adminDetails).length > 0 && get) {
      refetch();
    }
  }, [language, subcategoryId, debouncedSearch, page]);

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
    items: itemsData?.data || [], 
    searchWord,
    setSearchWord,
    onPress,
    pageCount: itemsData?.meta?.last_page || 1, // Add pageCount for pagination
  };
  };