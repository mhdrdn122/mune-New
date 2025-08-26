import React from 'react'
import Header from '../../utils/Header'
import Breadcrumb from '../../utils/Breadcrumb'

const PageHeader = ({breadcrumbs,heading,buttonText,onButtonClick,requiredPermission,setRefresh,refresh,refreshRandomNumber}) => {
  return (
    <div>
      {/* <Breadcrumb breadcrumbs={breadcrumbs} /> */}
      <Header
        heading={heading}
        buttonText={buttonText}
        onButtonClick={onButtonClick}
        requiredPermission={requiredPermission}
        setRefresh={setRefresh}
        refresh={refresh}
        refreshRandomNumber={refreshRandomNumber}
      />
    </div>
  )
}

export default PageHeader
