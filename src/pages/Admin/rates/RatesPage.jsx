import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import RatesContainer from "../../../Containers/RatesContainer/RatesContainer";
import SubAppBar from "../../../utils/SubAppBar";
import { useDispatch, useSelector } from "react-redux";
import {
  getRatesExcelAction,
  resetRatesExcel,
} from "../../../redux/slice/rates/ratesSlice";
import { saveAs } from "file-saver";
import notify from "../../../utils/useNotification";
import { usePermissions } from "../../../context/PermissionsContext";
import { PermissionsEnum } from "../../../constant/permissions";

const RatesPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [mode, setMode] = useState(false);
  const [isExcelRequested, setIsExcelRequested] = useState(false);
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();

  const { excelData, loading, error } = useSelector(
    (state) => state.rates.ratesExcel || {}
  );

  const hasDownloaded = useRef(false);

  const generateExc = useCallback((data) => {
    if (hasDownloaded.current) return;

    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "التقييمات.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    hasDownloaded.current = true;
    notify("تم تحميل الملف بنجاح", "success");
  }, []);

  useEffect(() => {
    if (isExcelRequested && excelData && !loading && !hasDownloaded.current) {
      generateExc(excelData);
      setIsExcelRequested(false);
      dispatch(resetRatesExcel());
    }

    if (isExcelRequested && error && !loading) {
      notify(error.message || "حدث خطأ أثناء تحميل الملف", "warn");
      setIsExcelRequested(false);
      dispatch(resetRatesExcel());
    }
  }, [isExcelRequested, error, dispatch, loading, excelData, generateExc]);

  const handleClickExcel = async () => {
    hasDownloaded.current = false;
    setIsExcelRequested(true);
    await dispatch(getRatesExcelAction());
  };

  return (
    <Fragment>
      <SubAppBar
        title="التقييمات"
        showRefreshButton={true}
        refresh={refresh}
        setRefresh={setRefresh}
        showViewToggle={(prev) => setMode(!prev)}
        viewMode={mode}
        showDownloadButton={
          true &&
          location.pathname !== "/admin/rests" &&
          hasPermission(PermissionsEnum.RATE_INDEX)
        }
        onDownloadExcel={handleClickExcel}
        onViewToggle={() => setMode((prev) => !prev)}
        downloadLoading={loading && isExcelRequested}
      />
      <RatesContainer  setRefresh={setRefresh} refresh={refresh} mode={mode} />
    </Fragment>
  );
};

export default RatesPage;
