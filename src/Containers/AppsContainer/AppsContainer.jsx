// src/Containers/AppsContainer/AppsContainer.jsx
import { FaMotorcycle, FaUser } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import AppCard from "../../components/Admin/Apps/AppCard";
import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminProvider";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllRestsManagerAction } from "../../redux/slice/restsManager/ratesManagerSlice";

const AppsContainer = () => {
    // Extracts restaurant manager state from Redux store
    const {
        restsManager,
        // , loading, error, status
    } = useSelector((state) => state.restsManager);

    const dispatch = useDispatch()

    let item = {};
    if (restsManager?.data?.length > 0) {
        item = restsManager?.data[0];
    }


    /**
     * Fetches the restaurant manager data for the current page.
     * This action is dispatched only if the Redux state is idle.
     */
    const fetchData = async () => {
        await dispatch(getAllRestsManagerAction());
    };

    // On mount or when `page` changes, fetch the data if status is idle
    useEffect(() => {
        fetchData();
    }, []);

    const deliveryAppDownloadLink = item?.delivery_link_link;
    const userAppDownloadLink = item?.user_link;
    const adminAppDownloadLink = item?.admin_link;

    return (
        <div className="flex flex-wrap justify-center items-center my-10 md:my-20 gap-x-8 gap-y-12 p-4">
            <AppCard
                icon={<FaMotorcycle />}
                text="delivery"
                downloadLink={deliveryAppDownloadLink}
            />
            <AppCard
                icon={<FaUser />}
                text="User"
                downloadLink={userAppDownloadLink}
            />
            <AppCard
                icon={<MdOutlineAdminPanelSettings />}
                text="Admin"
                downloadLink={adminAppDownloadLink}
            />
        </div>
    );
};

export default AppsContainer;