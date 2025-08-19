import { useContext, useEffect, useState } from "react";
import { Modal , Button, Spinner } from "react-bootstrap";
import shisha from "../../assets/User/icons8-shisha-50.png";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import { LanguageContext } from "../../context/LanguageProvider";
import { CircularProgress } from "@mui/material";
import notify from "../useNotification";
import { useRequestOrderMutation } from "../../redux/slice/tables/tablesApi";
import { ToastContainer } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { UserContext } from "../../context/UserProvider";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import { useNavigate } from "react-router-dom";

const initialState = {
  waiter: { loading: false, success: null, error: null },
  arakel: { loading: false, success: null, error: null },
  invoice: { loading: false, success: null, error: null },
};

export const SidebarBottom = ({ adminDetails }) => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  
  const { userToken,setUserToken } = useContext(UserContext);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [requestOrder] = useRequestOrderMutation();

  const [selectedOption, setSelectedOption] = useState(null);
  const adminTable_id=adminDetails.is_table==1 && !localStorage.getItem('tableId')? true: false;

  // State model for request handling
  const [requestState, setRequestState] = useState(initialState);
  const [loadingSubmit,setLoadingSubmit]=useState(false)

  const [loginUserModal,setLoginUserModal]=useState(false)


  
  const [showWelcomeMessageModal,setShowWelcomeMessageModal]=useState(adminTable_id) //show the modal of question

  const [welcomeMessageAnswer,setWelcomeMessageAnswer]=useState(false) //the answer of question yes or no (inside the restaurant)
  const [ifAnswerNoMessage,setIfAnswerNoMessage]=useState(false);
  const handleCloseCloseMessage=()=>setShowWelcomeMessageModal(false)
  const [tableId,setTableId]=useState(null);
  const [heSaidNo,setHeSaidNo]=useState(false)
  const isTakeout=localStorage.getItem('isTakeout')
  useEffect(()=>{
    console.log("isTakeout : ",isTakeout)
  },[])
  useEffect(()=>{
    if(localStorage.getItem('tableId')){
      setShowWelcomeMessageModal(false)
    }
    if(localStorage.getItem('heSaidNo')){
      setShowWelcomeMessageModal(false)
    }
  },[tableId,heSaidNo])

  const handleShowModal = (type) => {
    setShowModal(true);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleEnterId = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true)
    const data = new FormData();
    data.append('table_id', selectedOption);
    data.append('id', adminDetails.id);
    try {
      let response = await fetch(`${baseURLLocalPublic}/customer_api/choose_table` ,{
        method:"POST",
        body:data
      })
      response = await response.json()
      console.log('response of enter tableId : ',response)
     if(response.status==true){
      setTimeout(() => {
        notify('لقد تم تحديد رقم الطاولة بنجاح','success')
      }, 500);
      localStorage.setItem('userToken',response?.data?.token)
       setTableId(selectedOption);
      setUserToken(response?.data?.token)
     }
    } catch (error) {
        console.error('error from enter Id : ',error)
    }finally{
      setLoadingSubmit(false)
      localStorage.setItem('tableId',selectedOption)
    }
  };

  const handleRequest = async (type) => {
    try {
      setRequestState(initialState);
      setRequestState(() => ({
        ...initialState,
        [type]: { ...initialState[type], loading: true },
      }));
      handleShowModal(type);
      const result = await requestOrder({
        type,
        tableId: adminDetails.table_id || tableId || localStorage.getItem('tableId'),
        language
      }).unwrap();
      console.log("Service added successfully:", result);
      if (result.status === true) {
        setRequestState((prev) => ({
          ...prev,
          [type]: { loading: false, success: result.message, error: null },
        }));
        setTimeout(() => {
          handleCloseModal();
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to add service:", error);
      const errorMsg =
        error.status === "FETCH_ERROR"
          ? "No Internet Connection"
          : error.data.message;
      setRequestState((prev) => ({
        ...prev,
        [type]: { loading: false, success: null, error: errorMsg },
      }));
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } finally {
      setRequestState((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
    }
  };

  return (
    <>
      {  
        adminDetails?.is_table === 1 &&
        (adminDetails?.table_id || localStorage.getItem('tableId')
        && userToken )  && (
          <nav
            className="navbar_bottom text-white"
            style={{
              background: `#${adminDetails?.color?.substring(10, 16)}`,
            }}
          >
            <div className="icons">
              <div onClick={() => handleRequest("waiter")}>
                <PersonIcon />
                <p>{language === "en" ? "Request a Waiter" : "طلب نادل"}</p>
              </div>
              <div onClick={() => handleRequest("arakel")}>
                <img src={shisha} alt="" />
                <p>{language === "en" ? "Request Shisha" : "طلب أركيلة"}</p>
              </div>
              <div onClick={() => handleRequest("invoice")}>
                <DescriptionIcon onClick={() => {}} />
                <p> {language === "en" ? "Request the Bill" : "طلب الفاتورة"} </p>
              </div>
            </div>
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              centered
              className="hie"
            >
              <Modal.Body className="p-3">
                {requestState[modalType]?.loading && (
                  <div className="d-flex align-items-center justify-content-center my-4">
                    <CircularProgress size={50} className={"color"} />
                  </div>
                )}

                {requestState[modalType]?.error && (
                  <div className="alert alert-danger my-3 text-center text-danger font">
                    {requestState[modalType].error}
                  </div>
                )}
                {requestState[modalType]?.success && (
                  <div className="alert alert-success my-3 text-center text-success font ">
                    {language === "ar" ? (
                      <>
                        <CheckCircleIcon />
                        {requestState[modalType].success}
                      </>
                    ) : (
                      <>
                        {requestState[modalType].success}
                        <CheckCircleIcon />
                      </>
                    )}
                  </div>
                )}
              </Modal.Body>
            </Modal>

            <ToastContainer />
          </nav>
        )
      }
  
      {adminDetails?.is_table === 1 &&  !tableId  && 
        welcomeMessageAnswer && !adminDetails?.table_id &&  (
          <nav
            className="navbar_bottom2 text-white"
            style={{
              background: `#${adminDetails?.color?.substring(10, 16)}`,
            }}
          >
            {
              <div className=" w-full max-w-md mx-auto text-center">
                <form onSubmit={handleEnterId} className="space-y-4 ">
                  <select
                    id="table-select"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    required
                    style={{
                      backgroundColor: `#${
                        adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                      }`,
                      border:'none'
                    }}
                    className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500 "
                  >
                    <option value="" disabled selected>{language=='en'?<>Enter your table id</>:<>أدخل رقم الطاولة</>}</option>
                    {adminDetails?.available_tables.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.number_table}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="w-full font-bold py-2 px-4 rounded mt-2 outline-none"
                    disabled={!selectedOption}
                    style={{
                      backgroundColor: `#${
                        adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                      }`,
                      border:'1px solid #999'
                    }}
                  >
                    {loadingSubmit?<Spinner size="sm" />:
                      language =='en'?
                        <>Submit</>:<>تأكيد</>
                      }
                      
                  </button>
                </form>
              </div>
            }
          </nav>
        )
      }

      { !isTakeout && 
        <Modal
          show={showWelcomeMessageModal}
          onHide={handleCloseCloseMessage}
          centered
        >
          <Modal.Header className="d-flex justify-content-center ">
            <Modal.Title
              className="update"
              style={{
                color: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              <p> {adminDetails?.welcome} </p>
              <p className="text-center">{adminDetails?.name}</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 d-flex align-items-center justify-content-center flex-row-reverse gap-3">
            <div>
              <Modal.Title
                className="update"
                style={{
                  color: `#${
                    adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                  }`,
                }}
              >
                <p className="text-center">{adminDetails?.question}</p>
              </Modal.Title>
            </div>
            <Button
              variant="primary"
              className="p-2 mt-3 rounded"
              style={{
                background: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
                  width:'25%'
              }}
              onClick={()=>{
                setIfAnswerNoMessage(true);
                setShowWelcomeMessageModal(false);
                setUserToken(false)
                localStorage.setItem('heSaidNo',true)
                console.log('we are here')
                if(adminDetails?.is_takeout){
                  navigate(`/takeout`)
                }

              }}
            >
              لا
            </Button>
            <Button
              variant="primary"
              className="p-2 mt-3 rounded"
              style={{
                background: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
                width:'25%'
              }}
              onClick={()=>{
                setShowWelcomeMessageModal(false);
                setWelcomeMessageAnswer(true)
              }}
            >
              نعم
            </Button>
          </Modal.Body>
        </Modal>
      }

      {
        !adminDetails?.is_takeout && 
        <Modal
          show={ifAnswerNoMessage}
          onHide={handleCloseCloseMessage}
          centered
        >
          <Modal.Header className="d-flex justify-content-center ">
            <Modal.Title
              style={{
                color: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
              }}
            >
              <p> {adminDetails?.if_answer_no}</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button
              variant="primary"
              className="p-2 mt-3 rounded text-center"

              // disabled={loadingSendRequest}
              style={{
                background: `#${
                  adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                }`,
                
                width:'25%'
              }}
              onClick={()=>{
                setIfAnswerNoMessage(false)
                setLoginUserModal(true)
                setHeSaidNo(true)
                localStorage.setItem('heSaidNo',true)
                window.dispatchEvent(new Event("storage")); // Force re-render globally
              }}
            >
              حسنا
            </Button>
          </Modal.Body>
        </Modal>
      }
      
        
        
    </>
  );
};
