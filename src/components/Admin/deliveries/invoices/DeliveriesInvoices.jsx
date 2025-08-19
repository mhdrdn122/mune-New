// This file displays a list of invoices related to a specific delivery driver,
// with the ability to view each invoice in a modal.

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetDeliveriesInvoicesQuery } from '../../../../redux/slice/deliveriesInvoices/deliveriesInvoices';
import Breadcrumb from '../../../../utils/Breadcrumb';
import Header from '../../../../utils/Header';
import { IconButton } from '@mui/material';
import { FaEye } from 'react-icons/fa';
import InvoiceOrderModal from './InvoiceOrderModal';
import { Spinner } from 'react-bootstrap';

/**
 * `DeliveriesInvoices` Component
 * Displays all invoices for a specific delivery driver.
 * 
 * @returns {JSX.Element} The rendered invoices page.
 */
const DeliveriesInvoices = () => {
  const breadcrumbs = [
    { label: " الفواتير", to: "" },
    { label: " السائقين", to: "/admin/deliveries" },
  ];

  const { deliveryId } = useParams();

  const [showOrdersInvoice, setShowOrdersInvoice] = useState(false);

  // Fetch all invoices related to the driver using their ID from the URL
  const {
    data: invoices,
    isError,
    error,
    isLoading: loading,
    isFetching,
  } = useGetDeliveriesInvoicesQuery(deliveryId, {
    skip: !deliveryId, // Skip query if deliveryId is not defined
  });

  /**
   * Shows the modal with detailed invoice data.
   * @param {Object} invoice - The selected invoice object.
   */
  const handleShowInvoice = (invoice) => {
    setShowOrdersInvoice(invoice);
  };

  /**
   * Closes the invoice modal.
   */
  const handleCloseShowInvoice = () => {
    setShowOrdersInvoice(false);
  };

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Header heading="فواتير السائقين" />

      <div className="table-responsive table_container">
        <table className="table" dir="rtl">
          <thead>
            <tr>
              <th className="col"> رقم الفاتورة </th>
              <th className="col"> اسم المستخدم </th>
              <th className="col"> تاريخ الإنشاء </th>
              <th className="col"> تاريخ الإستلام </th>
              <th className="col"> الحالة </th>
              <th className="col-2"> الحدث </th>
            </tr>
          </thead>

          {isFetching ? (
            <tbody>
              <tr>
                <td colSpan="7">
                  <div className="my-4 text-center">
                    <p className="mb-2">جار التحميل</p>
                    <Spinner animation="border" role="status" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : error ? (
            <tbody>
              <tr>
                <td colSpan="7">
                  <p className="my-5">{error.data?.message || "حدث خطأ"}</p>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {invoices?.data?.length > 0 ? (
                invoices.data.map((invoice, i) => (
                  <tr key={i} className="table-row align-items-center">
                    <td style={{ textAlign: "center" }}>{invoice.num}</td>
                    <td style={{ textAlign: "center" }}>{invoice.username}</td>
                    <td style={{ textAlign: "center" }}>{invoice.created_at || "..."}</td>
                    <td style={{ textAlign: "center" }}>{invoice.received_at || "..."}</td>
                    <td style={{ textAlign: "center" }}>
                      <p
                        className="p-1"
                        style={{
                          background: "#1F2A40",
                          color: "white",
                          borderRadius: "8px",
                        }}
                      >
                        {invoice.status}
                      </p>
                    </td>
                    <td>
                      <IconButton sx={{ color: "#000" }} onClick={() => handleShowInvoice(invoice)}>
                        <FaEye />
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <p className="my-5">لا توجد بيانات</p>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Modal to show individual invoice details */}
      <InvoiceOrderModal show={showOrdersInvoice} handleClose={handleCloseShowInvoice} />
    </div>
  );
};

export default DeliveriesInvoices;
