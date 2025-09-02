import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketProvider";
import { IconButton } from "@mui/material";
import {
  FaCheckCircle,
  FaEye,
  FaHome,
  FaMotorcycle,
  FaStore,
} from "react-icons/fa";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const InvoiceCurrentCard = ({
  e,
  i,
  adminDetails,
  handleShowDelete,
  handleShowOrder,
}) => {
  const [invoice, setInvoice] = useState(e);
  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "bqfkpognxb0xxeax5bjc",
    cluster: "mt1",
    wsPort: 8080,
    wsHost: "192.168.1.37",
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  window.Echo.channel(`order.${e.id}`).listen("OrderUpdated", (event) => {
    console.log("📩 OrderUpdated received:", event);
    setInvoice(event);
  });

  // useEffect(() => {
  //   if (!channel) {
  //     console.warn("⚠️ Channel not ready yet for order:", e.id);
  //     return;
  //   }

  //   const eventName = ".App\\Events\\OrderUpdated";

  //   // ✅ الاستماع للحدث
  //   channel.listen(eventName, (event) => {
  //     console.log("📩 OrderUpdated received:", event);
  //     setInvoice(event);
  //   });

  //   // ✅ التحقق من حالة الاشتراك
  //   channel.subscribed(() => console.log("✅ Subscribed to channel:"));

  //   channel.error((err) =>
  //     console.error("❌ WebSocket Error on channel:", err)
  //   );

  //   // ✅ cleanup عند التفكيك
  //   return () => {
  //     console.log("🛑 Unsubscribed from channel:");
  //     channel.stopListening(eventName);
  //   };
  // }, [channel, e.id]);

  return (
    <div key={i} className="container p-4 bg-white rounded shadow-sm mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-secondary fw-bold">#{invoice?.num}</span>
        <span
          style={{
            color: `#${adminDetails?.color?.substring(10, 16)}`,
          }}
          className="fw-bold"
        >
          {invoice?.region}
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          disabled={["Under delivery", "Paid", "Processing"].includes(
            invoice.status
          )}
          onClick={() => handleShowDelete(invoice.id)}
          className="btn btn-danger btn-sm"
        >
          حذف الطلب
        </button>
        <h5 className="text-dark fw-bold">
          <IconButton onClick={() => handleShowOrder(invoice)}>
            <FaEye size={25} />
          </IconButton>
        </h5>
      </div>

      {/* Progress Bar */}
      <div className="d-flex align-items-center justify-content-between mt-4">
        <div className="text-center">
          <FaHome
            color={
              e.status === "paid"
                ? `#${adminDetails?.color?.substring(10, 16)}`
                : ""
            }
            className="fs-4"
          />
        </div>
        <div
          className="flex-grow-1 mx-2 bg-secondary"
          style={{ height: "2px" }}
        ></div>

        <div className="text-center">
          <FaMotorcycle
            color={
              ["Under delivery", "Paid"].includes(invoice.status)
                ? `#${adminDetails?.color?.substring(10, 16)}`
                : ""
            }
            className="fs-4"
          />
        </div>
        <div
          className="flex-grow-1 mx-2 bg-secondary"
          style={{ height: "2px" }}
        ></div>

        <div className="text-center">
          <FaStore
            color={
              ["Processing", "Under delivery", "Paid"].includes(invoice.status)
                ? `#${adminDetails?.color?.substring(10, 16)}`
                : ""
            }
            className="fs-4"
          />
        </div>
        <div
          className="flex-grow-1 mx-2 bg-secondary"
          style={{ height: "2px" }}
        ></div>

        <div className="text-center">
          <FaCheckCircle
            color={
              ["Approved", "Processing", "Under delivery", "Paid"].includes(
                invoice.status
              )
                ? `#${adminDetails?.color?.substring(10, 16)}`
                : invoice.status === "rejected"
                ? "#BB2D3B"
                : ""
            }
            className="fs-4"
          />
        </div>
      </div>

      <p className="text-muted text-center mt-3">
        {invoice.status === "Approved" && <>لقد تم الموافقة على طلبك</>}
        {invoice.status === "Processing" && <>طلبك قيد التحضير</>}
        {invoice.status === "Under delivery" && <>طلبك قيد التوصيل</>}
        {invoice.status === "Paid" && <>لقد تم توصيل الطلب</>}
        {invoice.status === "Rejected" && <>لقد تم رفض الطلب </>}
        {![
          "Approved",
          "Processing",
          "Under delivery",
          "Paid",
          "Rejected",
        ].includes(invoice.status) && <>طلبك قيد الانتظار </>}
      </p>
    </div>
  );
};

export default InvoiceCurrentCard;
