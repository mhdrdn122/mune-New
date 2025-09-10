// src/pages/Apps.jsx (or wherever your main Apps component is)
import React from 'react';
import SubAppBar from '../../../utils/SubAppBar';  
import AppsContainer from '../../../Containers/AppsContainer/AppsContainer';  

const Apps = () => {
    return (
        <>
            <SubAppBar title="حمل التطبيقات الملحقة" />
            <AppsContainer />
        </>
    );
};

export default Apps;