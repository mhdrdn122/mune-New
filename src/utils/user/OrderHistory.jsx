import {
   FaEye, 
} from "react-icons/fa";
import { IconButton } from "@mui/material";

const OrderHistory = ({ e, i, handleShowOrder , adminDetails  }) => {
  return (
    <div key={i} className="d-flex justify-content-center my-4">
      <div
        style={{
          width: "350px",
          height: "250px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 4px",
        }}
      >
        <div
          style={{
            textAlign: "end",
            display: "flex",
            flexDirection: "column",
            padding: "15px",
            fontSize: "1.2em",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              padding: "5px",
              // borderRadius: "20px 0 20px 0",
              // border: `2px solid #${adminDetails?.color?.substring(10, 16)}`,
            }}
          >
            <IconButton onClick={() => handleShowOrder(e)}>
              <FaEye
                color={`#${adminDetails?.color?.substring(
                  10,
                  16
                )}`}
                size={25}
              />
            </IconButton>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
            className="mt-3"
          >
            <p
              style={{
                color: `#${adminDetails?.color?.substring(
                  10,
                  16
                )}`,
              }}
            >
              {e?.num}{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: `#${adminDetails?.color?.substring(
                    10,
                    16
                  )}`,
                }}
              >
                : رقم الفاتورة
              </span>
            </p>
            <p style={{ color: "#6c757d" }}>
              {e?.created_at}{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: `#${adminDetails?.color?.substring(
                    10,
                    16
                  )}`,
                }}
              >
                : تاريخ الطلب
              </span>
            </p>
            <p>
              <span>s.p {e?.delivery_price}</span>{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: `#${adminDetails?.color?.substring(
                    10,
                    16
                  )}`,
                }}
              >
                : أجرة التوصيل
              </span>
            </p>
            <hr />
          </div>
          <p>
            <span>s.p {e?.total} </span>
            <span
              style={{
                fontWeight: "bold",
                color: `#${adminDetails?.color?.substring(
                  10,
                  16
                )}`,
              }}
            >
              : المجموع الكلي
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory