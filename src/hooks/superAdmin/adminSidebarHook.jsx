import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  createBackupDBAction,
  downloadBackupDBAction,
  getBackupImagesAction,
  logOutSuperAdminAction,
  resetAuthState,
  resetBackupImagesState,
  resetCreateBackupState,
  resetDownloadBackupState,
} from "../../redux/slice/super_admin/auth/authSlice";
// import notify from "../useNotification";
import { toast } from "react-toastify";
import { useMediaQuery } from "@uidotdev/usehooks";
import notify from "../../utils/useNotification";
import { useGetDataTokenSuperAdmin } from "../Admin/useGetData";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const AdminSidebarHook = () => {
  const { hasPermission } = usePermissions();
  const { pathname } = useLocation();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isSmallDevice ? true : false);
  const [selected, setSelected] = useState("المدن");
  const [loadingBackupDb, setLoadingBackupDb] = useState(false);
  const [loadingBackupImgs, setLoadingBackupImgs] = useState(false);
  // const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const superAdminRoles = JSON.parse(
    localStorage.getItem("superAdminInfo")
  ).roles;
  const handleLogout = async() => {
    await dispatch(resetAuthState())
    await localStorage.clear();
  };
  
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(
    (state) => state.authSuper.backupCreate
  );
  const {
    loading: load,
    error: err,
    data: dataDownload,
  } = useSelector((state) => state.authSuper.backupDownload);
  const {
    loading: loadImgs,
    error: errImgs,
    data: dataDownloadImgs,
  } = useSelector((state) => state.authSuper.backupImages);

  // console.log(data);

  const handleBackupDB = async () => {
    try {
      setLoadingBackupDb(true);
      await dispatch(createBackupDBAction());
      await dispatch(downloadBackupDBAction());
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingBackupDb(false);
    }
  };

  const handleBackupImages = async () => {
    setLoadingBackupImgs(true)
    const promise = dispatch(getBackupImagesAction()).unwrap();
    toast.promise(
      promise.then((response) => {
        
        const blob = new Blob([response], { type: "application/zip" });
        const url = URL.createObjectURL(blob);

        // Create a link element to initiate the download
        const link = document.createElement("a");
        link.href = url;
        link.download = "storage_backup.zip"; // Provide a default file name
        document.body.appendChild(link);
        link.click();

        // Cleanup: Remove the link and revoke the object URL
        link.remove();
        URL.revokeObjectURL(url);
        setLoadingBackupImgs(false)
        dispatch(resetBackupImagesState());


        return response; // Important to return response for the success toast
      }),
      {
        // pending: "Downloading backup images...",
        success: "Backup images downloaded successfully!",
        error: "Failed to download backup images.",
      }
    );
  };

  useEffect(() => {
    if (!loadImgs && errImgs) {
      notify(errImgs.message, "error");
    }
  }, [loadImgs, errImgs]);

  useEffect(() => {
    if (loading) {
      // notify("Downloading...", "success");
    } else if (error) {
      notify(error.message, "error");
    } else if (Object.keys(data).length > 0) {
      // notify(data.message, "success");
    }
  }, [loading, error, data]);

  useEffect(() => {
    // Reset the state after handling notifications
    if (!loading && (error || Object.keys(data).length > 0)) {
      dispatch(resetCreateBackupState());
    }
  }, [loading, error, data, dispatch]);

  useEffect(() => {
    if (!load && Object.keys(dataDownload).length > 0) {
      // Assuming dataDownload is the file data (could be a URL or blob data)
      const blob = new Blob([dataDownload], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);

      // Create a link element to initiate the download
      const link = document.createElement("a");
      link.href = url;
      link.download = "backup_DB.sql"; // Provide a default file name
      document.body.appendChild(link);
      link.click();

      // Cleanup: Remove the link and revoke the object URL
      link.remove();
      URL.revokeObjectURL(url);
    } else if (!load && err) {
      notify(error.message, "error");
    }

    if (!load && (err || Object.keys(dataDownload).length > 0)) {
      dispatch(resetDownloadBackupState());
    }
  }, [dataDownload, load]);

  const handleContracts = async (type, name) => {
    // Function to fetch data from a specific page
    const fetchDataForPage = async (page) => {
      return await useGetDataTokenSuperAdmin(
        `/superAdmin_api/${type}?page=${page}`
      );
    };

    let allData = [];
    let currentPage = 1;
    let lastPage = 1;

    if(type === 'show_contracts'){
      setLoading2(true)
    }else {
      // setLoading(true)
    }

    // Initial data fetch for page 1
    let res = await fetchDataForPage(currentPage);
    console.log(res)

    if (res?.data) {
      allData = res.data.data; // Assuming the API returns data in `data.data`
      lastPage = res.data.last_page; // Assuming the API returns `last_page` in the response
      notify("Success", "success");
    } else {
      // Handle error case
      // notify(res.data.message, "error");
      return; // Exit the function if there's an error
    }
    console.log(lastPage);
    // Fetch data for remaining pages if `last_page` > 1
    while (currentPage < lastPage) {
      currentPage++;
      res = await fetchDataForPage(currentPage);
      console.log(res)

      if (res?.data) {
        allData = allData.concat(res.data.data);
      } else {
        // Handle error case
        // notify(res.data.message, "error");
        return; // Exit the function if there's an error
      }
    }

    console.log(allData)

    let formattedData = []
    if (type === "show_contracts") {
      // Select only the relevant columns (Name, City, Date)
        formattedData = allData?.map((item) => ({
        Name: item.name,
        City: item.city,
        Date: item.date, // Adjust these keys according to the actual structure of your data
      }));
    } else {
      formattedData = allData?.map((item) => ({
        'Admin name': item.admin_name,
        Name: item.name,
        Rate: item.rate, // Adjust these keys according to the actual structure of your data
        Gender: item.gender, // Adjust these keys according to the actual structure of your data
        Birthday: item.birthday, // Adjust these keys according to the actual structure of your data
        Phone: item.phone, // Adjust these keys according to the actual structure of your data
        Note: item.note, // Adjust these keys according to the actual structure of your data
      }));
    }

    // Now that we have all data, proceed with generating the Excel file
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    if(type === 'show_contracts'){
      setLoading2(false)
    }else {
      // setLoading(false)
    }
    saveAs(blob, `${name}.xlsx`);
  };

  return [
    hasPermission,
    pathname,
    isCollapsed,
    setIsCollapsed,
    selected,
    setSelected,
    superAdminRoles,
    handleBackupDB,
    handleBackupImages,
    handleLogout,
    loadImgs,
    loadingBackupDb,
    loadingBackupImgs,
    loading2,
    handleContracts
  ];
};
