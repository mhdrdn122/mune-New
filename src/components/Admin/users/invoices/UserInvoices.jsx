import React, { useState } from 'react'
import { useGetUsersQuery } from '../../../../redux/slice/users/usersApi';
import { useParams } from 'react-router-dom';
import { Spinner} from 'react-bootstrap';
import { useGetUsersInvoicesQuery } from '../../../../redux/slice/usersInvoices/usersInvoicesApi';
import Header from '../../../../utils/Header';
import Breadcrumb from '../../../../utils/Breadcrumb';
import { IconButton } from '@mui/material';
import { FaEye } from 'react-icons/fa';
import InvoiceOrderModal from './InvoiceOrderModal';
import PageHeader from '../../../PageHeader/PageHeader';
import Table from '../../../Tables/Tables';

const breadcrumbs = [
  {
    label: " الفواتير",
    to: "",
  },  
  {
    label: " المستخدمين",
    to: "/admin/users",
  },
]
const UserInvoices = () => {
      const tableHeader = ["رقم الفاتورة","اسم المستخدم","تاريخ الإنشاء","تاريخ الاستلام","الحالة","الحدث"]
      const fieldsToShow = ["num","user","created_at","received_at","status"]
      const [passedData,setPassedData] = useState()
      const {userId } = useParams();
      const [showOrdersInvoice,setShowOrdersInvoice]=useState(false)

      const {
            data: invoices,
            isError,
            error,
            isLoading: loading,
            isFetching,
          } = useGetUsersInvoicesQuery(userId ,  {
            skip: !userId, // Skip the API call if `show` is null or false
        });

        const handleShowInvoice=(invoice)=>{
          setShowOrdersInvoice(true)
          setPassedData(invoice)
        }
       const handleCloseShowInvoice=(orders)=>{
          setShowOrdersInvoice(false)
        }
  const actions = [
    {
      icon:<FaEye/>,
      name:'view',
      onClickFunction:handleShowInvoice
    },
  ]
  return (
    <div>
      <PageHeader
        breadcrumbs={breadcrumbs}
        heading={"فواتير المستخدم"}
      />
      <Table
        columns={tableHeader}
        fieldsToShow={fieldsToShow}
        data={invoices?.data}
        isFetching={isFetching}
        error={error}
        actions = {actions}
      />
      <InvoiceOrderModal show={showOrdersInvoice} invoice={passedData} handleClose={()=>setShowOrdersInvoice(false)} />
    </div>
  )
}

export default UserInvoices