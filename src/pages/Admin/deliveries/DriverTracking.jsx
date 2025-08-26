import { useState } from "react";
import SubAppBar from "../../../utils/SubAppBar";
import DeliveriesTrackingContainer from "../../../Containers/DriversContainer/DeliveriesTrackingContainer";

const DriverTracking = () => {
  return (
    <div className="m-0 p-0">
      <SubAppBar title=" تتبع السائقين" />
      <DeliveriesTrackingContainer />
    </div>
  );
};

export default DriverTracking;
