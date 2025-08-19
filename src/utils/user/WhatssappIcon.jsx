import { Dropdown } from "react-bootstrap";
import whatss from '../../assets/User/واتس.png'

const WhatssappIcon = ({ link }) => {
  return (
    <>
      {link && (
        <Dropdown.Item
          href={`https://wa.me/+963${link.substring(0)}`}
          target="_blank"
          className="dorp_down_item "
        >
          <img src={whatss} alt="" className="" />
        </Dropdown.Item>
      )}
    </>
  );
};

export default WhatssappIcon;
