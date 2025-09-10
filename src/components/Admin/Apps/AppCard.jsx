// src/components/Admin/Apps/AppCard.jsx
import React from 'react';
import useGetStyle from '../../../hooks/useGetStyle';  

const AppCard = ({ icon, text, downloadLink }) => {
    const { Color } = useGetStyle(); 

    const handleDownload = () => {
        if (downloadLink) {
            window.open(downloadLink, '_blank');  
        } else {
            console.warn(`No download link provided for ${text} app.`);
        }
    };

    return ( 
        <div 
            className="flex flex-col items-center p-4 cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={handleDownload}  
        >
            <div 
                style={{
                    backgroundColor: "#" + Color 
                }} 
                className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl flex items-center justify-center shadow-lg"
            >
                 {React.isValidElement(icon) ? 
                    React.cloneElement(icon, { className: "text-white text-5xl md:text-6xl" }) : 
                    <div className="text-white text-3xl">?</div>  
                }
            </div>
            <div className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg text-lg font-medium shadow-md">
                {text}
            </div>
        </div>
    );
};

export default AppCard;