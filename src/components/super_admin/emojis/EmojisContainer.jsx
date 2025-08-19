/**
 * EmojisContainer component handles the management of emoji records
 * in the Super Admin dashboard.
 *
 * Functionalities:
 * - Fetches and displays a paginated table of emojis
 * - Allows super admin to:
 *    • View emoji details
 *    • Add new emoji (via ModalAddEmoji)
 *    • Edit existing emoji (via ModalEditEmoji)
 *    • Delete an emoji (with confirmation modal)
 *    • Activate or deactivate emojis (with confirmation modal)
 * - Uses Redux to manage state and side effects
 * - Displays notifications via `react-toastify`
 *
 * Props:
 * - `show` (boolean): Determines whether the add emoji modal is visible.
 * - `handleClose` (function): Function to close the add emoji modal.
 * - `randomNumber` (number): Used to trigger refetch when refreshed from parent.
 */


import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { useDispatch } from "react-redux";
import {
  deactiveEmojiAction,
  deleteEmojiAction,
  getAllEmojisAction,
  resetDeactiveEmoji,
  resetDeletedEmoji,

} from "../../../redux/slice/super_admin/emoji/emojiSlice";
import { useSelector } from "react-redux";
import ModalEditEmoji from "./ModalEditEmoji";
import notify from "../../../utils/useNotification";
import { ToastContainer } from "react-toastify";
import ModalShowEmoji from "./ModalShowEmoji";
import Table from "../../Tables/Tables";
import AttentionModal from "../../Modals/AttentionModal/AttentionModal";
import ModalAddEmoji from './ModalAddEmoji'
const EmojisContainer = ({ show, handleClose , randomNumber}) => {
  const tableHeader = ["الاسم","الحالة","الحدث"]
  const fieldsToShow = ["name","is_active"]
  const [passedData,setPassedData] = useState();


  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [showEdit, setShowEidt] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactiveModal, setShowDeactiveModal] = useState(false);
  const [errorDelete, serErrorDelete] = useState("");
  const [errorDeactive, serErrorDeactive] = useState("");

  const handleShowEmoji = (emoji) => {
    setPassedData(emoji)
    setShowEmoji(true);
  };
  const handleShowEdit = (emoji) => {
    setPassedData(emoji)
    setShowEidt(true);
  };
  const handleShowDeleteModal = (emoji) => {
    setPassedData(emoji)
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowDeactiveModal = (emoji) => {
    setPassedData(emoji)
    setShowDeactiveModal(true);
  };

  const handleCloseDeactiveModal = () => {
    setShowDeactiveModal(false);
  };

  const { emojis, loading, error, status } = useSelector(
    (state) => state.emojiSuper
  );
  const {
    emojiDeletedDetails,
    loading: loadingDel,
    error: errorDel,
  } = useSelector((state) => state.emojiSuper.deletedEmoji);

  const fetchData = async () => {
    await dispatch(getAllEmojisAction(page));
  };
  useEffect(() => {
    if (status === "idle") {
      fetchData();
    }
  }, [dispatch, page,randomNumber]);

  const handleDelete = async (id) => {
    await dispatch(deleteEmojiAction(id));
  };
  console.log(emojiDeletedDetails);
  console.log(errorDel);

  useEffect(() => {
    if (emojiDeletedDetails && emojiDeletedDetails.status === true) {
      notify("تم الحذف بنجاح", "success");
      handleCloseDeleteModal();
      setTimeout(() => {
        fetchData();
        dispatch(resetDeletedEmoji());
      }, 1500);
    }
  }, [emojiDeletedDetails, loadingDel]);

  useEffect(() => {
    if (errorDel) {
      notify(errorDel.message, "error");
      serErrorDelete(errorDel.message);
      dispatch(resetDeletedEmoji());
    }
  }, [errorDel]);

  const {
    emojiDeactiveDetails,
    loading: loadingDeactive,
    error: errorDeac,
  } = useSelector((state) => state.emojiSuper.deactiveEmoji);

  const handleDeactive = async (id) => {
    await dispatch(deactiveEmojiAction(id));
  };
  console.log(emojiDeactiveDetails);

  useEffect(() => {
    if (emojiDeactiveDetails && emojiDeactiveDetails.status === true) {
      notify("تمت العملية بنجاح", "success");
      handleCloseDeactiveModal();
      setTimeout(() => {
        fetchData();
        dispatch(resetDeactiveEmoji());
      }, 1500);
    }
  }, [emojiDeactiveDetails, loadingDeactive]);

  useEffect(() => {
    if (errorDeac) {
      notify(errorDeac.message, "error");
      serErrorDeactive(errorDeac.message);
      dispatch(resetDeactiveEmoji());
    }
  }, [errorDeac]);

  const actions =[
    {
      icon: <FaEye />,
      name: 'view',
      onClickFunction: handleShowEmoji
    },
    {
      icon: <EditOutlinedIcon />,
      name: 'edit',
      onClickFunction: handleShowEdit
    },
    {
      icon: <DeleteIcon />,
      name: 'delete',
      onClickFunction: handleShowDeleteModal
    },
    {
      icon: <BlockOutlinedIcon />,
      name: 'active',
      onClickFunction: handleShowDeactiveModal
    },
  ]

  return(
    <>
      <Table
        data={emojis?.data}
        actions={actions}
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        error={error}
        isFetching={loading}
      />
      {
        show &&
        <ModalAddEmoji show={show} handleClose={handleClose} />

      }
      {
        showEmoji && 
        <ModalShowEmoji show={showEmoji} emoji = {passedData} handleClose={()=>setShowEmoji(false)} />
      }
      {
        showEdit && 
        <ModalEditEmoji show={showEdit} emoji={passedData} handleClose={()=>setShowEidt(false)} />
      }
      {
        showDeleteModal && 
        <AttentionModal
          handleClose={()=>setShowDeleteModal(false)}
          loading={loadingDel}
          message={"هل أنت متاكد من عملية الحذف"}
          onIgnore={()=>setShowDeleteModal(false)}
          onOk={()=>handleDelete(passedData?.id)}
          show={showDeleteModal}
          title={"حذف الرمز"}
        />
      }
      {
        showDeactiveModal && 
        <AttentionModal
          handleClose={()=>setShowDeactiveModal(false)}
          loading={loadingDeactive}
          message={passedData?.is_active?"هل أنت متاكد من عملية إلغاء التنشيط":"هل أنت متأكد من عملية التنشيط"}
          onIgnore={()=>setShowDeactiveModal(false)}
          onOk={()=>handleDeactive(passedData?.id)}
          show={showDeactiveModal }
          title={passedData?.is_active?"الغاء تنشيط الرمز":"تنشيط الرمز"}
        />
      }
      <ToastContainer />
    </>
  )
  
};

export default EmojisContainer;
