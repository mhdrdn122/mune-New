import notify from "../../utils/useNotification";

export const handleShowRestaurant = async (rest,update,triggerRedirect,navigate) => {
    try {
      const result = await update(rest.id).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        const superAdminInfo = JSON.parse(
          localStorage.getItem("superAdminInfo")
        );
        localStorage.setItem(
          "adminInfo",
            JSON.stringify({
                restaurant: {
                is_advertisement: rest.is_advertisement,
                is_news: rest.is_news,
                is_order: rest.is_order,
                is_rate: rest.is_rate,
                is_table: rest.is_table,
                name_url: rest.name_url,
                id:rest.id
                },
                token: superAdminInfo.token,
                restaurant_id: rest.id,
                super: true,
                id: superAdminInfo.id,
                menu_id:rest.menu_template_id,
            })
        );
        localStorage.setItem('selected', 'الأصناف')
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } else {
        notify(result.message, "error");
      }
    } catch (e) {
      console.log(e);
      if (e?.status === 401) {
        triggerRedirect();
      } else {
        notify(e?.data?.message, "error");
      }
    }
};

export const handleDelete = async (id,deleteRest,handleClose,triggerRedirect) => {
    try {
      const result = await deleteRest(id).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        handleClose();
      } else {
        notify(result.message, "error");
      }
    } catch (error) {
      if (error?.status === 401) {
        triggerRedirect();
      } else {
        console.error("Failed:", error);
        notify(error?.data?.message, "error");
      }
    }
};

export const handleDeactive = async (id,deactivateRest,handleClose,triggerRedirect) => {
    try {
      const result = await deactivateRest(id).unwrap();
      if (result.status === true) {
        notify(result.message, "success");
        handleClose();
      } else {
        notify(result.message, "error");
      }
    } catch (error) {

      if (error?.status === 401) {
        triggerRedirect();
      } else {
        console.error("Failed:", error);
        notify(error?.data?.message, "error");
      }
    }
};