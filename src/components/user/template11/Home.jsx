import React, { useContext } from 'react'
import StoriesSlider from './StoriesSlider'
import { cards } from './constants'
import NavBarUser from '../../../utils/user/NavBarUser'
import CategoryMenu from './CategoryMenu'
import { ToastContainer } from 'react-toastify'
import { SidebarBottom } from '../../../utils/user/SidebarBottom'
import { AdminContext } from '../../../context/AdminProvider'
import { AdvertismentsContext } from "../../../context/AdvertismentsProvider";
const Home = () => {
  const { adminDetails, updateUsername } = useContext(AdminContext);
  const { advertisments } = useContext(AdvertismentsContext);
  return (
    <div className='w-100 height-100 d-flex flex-column bgColor '>
      <NavBarUser  withRatings={true}/>
      <StoriesSlider defaultDurationMs={5000} advertisments={advertisments}/>
      <CategoryMenu />
      <SidebarBottom adminDetails={adminDetails} />
      
    </div>
  )
}

export default Home
