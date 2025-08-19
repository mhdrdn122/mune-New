import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import avatar from "../../../assets/avatar.png";
import {  Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import notify from "../../../utils/useNotification";
import {
  addNewItemAction,
  getAllItemsAction,
  resetAddItem,
  resetUpdatedItem,
  updateItemAction,
} from "../../../redux/slice/items/itemsSlice";
import { CiCircleRemove } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";


/**
 * ModalAddItem Component
 * 
 * This component provides a modal interface to create or edit an item.
 * It supports features like uploading images, setting prices, defining sizes,
 * adding extra toppings, components, and nutritional information.
 * 
 * Props:
 * @param {boolean} show - Whether the modal is visible.
 * @param {Function} handleClose - Callback to close the modal.
 * @param {number} page - Current page number for pagination (used after item creation or edit).
 * @param {number|string} masterId - ID of the main category.
 * @param {number|string} subId - ID of the subcategory ("0" means no subcategory).
 * @param {Object} initialValues - Pre-filled values for editing an item.
 * @param {string} mode - Mode of the modal, either "add", "edit", or "view".
 * 
 * Return:
 * @returns {JSX.Element} Modal component containing a form for item manipulation.
 */

export const ModalAddItem = ({ show,handleClose, page, masterId, subId,initialValues,mode}) => {
  const [nutrition,setNutrition] = useState(initialValues?.nutrition || {
    amount:'',
    unit:'',
    kcal:'',
    protein:'',
    fat:'',
    carbs:''
  })
  const [showNutritionSection,setShowNutritionSection] = useState(initialValues?.nutrition?.amount>0)
  useEffect(()=>console.log('nutiration',nutrition),[nutrition])
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const dispatch = useDispatch();

  const [mainImage, setMainImage] = useState(mode==="edit" ||mode==="view"?initialValues?.image:avatar);
  const [iconImage, setIconImage] = useState(mode==="edit" || mode ==='view'?initialValues?.icon:avatar);
  const [adds, setAdds] = useState(initialValues?.toppings || []);
  const [sizes,setSizes] = useState(initialValues?.sizes || []);
  const [components,setComponents] = useState(initialValues?.components || [])

  useEffect(()=>console.log('initialValues',initialValues),[initialValues])


  const addExtra = () => setAdds([...adds, { name_en: "", name_ar: "", price: "", icon: null }]);
  const addSize = () => setSizes([...sizes, { name_en: "", name_ar: "", price: "",image:null,description_ar:"",description_en:"" }]);
  const addComponent = () => setComponents([...components, { name_en: "", name_ar: "", status: "" }]);

  
  const removeExtra = (index) => setAdds(adds.filter((_, i) => i !== index));
  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));
  const removeComponent = (index) => setComponents(components.filter((_, i) => i !== index));

  const handleExtraChange = (index, field, value) => {
    console.log(index,field,value)
    const updatedAdds = adds.map((extra, i) =>
      i === index ? { ...extra, [field]: value } : extra
    );
    setAdds(updatedAdds);
  };
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = sizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    );
    setSizes(updatedSizes);
  };
  const handleComponentChange = (index, field, value) => {
    const updatedComponents = components.map((component, i) =>
      i === index ? { ...component, [field]: value } : component
    );
    setComponents(updatedComponents);
    console.log(updatedComponents)
  };

  const handleImageChange = (event, setter, fieldName) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(file);
      setter(imageUrl);
      formik.setFieldValue(fieldName, file);
    }
  };

  const formik = useFormik({
    initialValues: initialValues? initialValues : {
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      price: "",
      is_topping:0,
      is_size:0,
      is_component:0,
      is_nutrition:0,
      image: null,
      icon: null,
      category_id: subId === "0" ? masterId : subId,
      is_panorama: 0,
      sizes: [],
      toppings: [],
      components:[],
      nutrition:null
    },
    onSubmit: async (values) => {
      const is_size = sizes.length >0 ? 1 : 0
      const is_component = components.length>0 ? 1 : 0
      const is_nutrition = nutrition?.amount > 0 ? 1:0
      const is_topping = adds?.length>0 ? 1 : 0
      
      if(mode==="edit"){
        let updatedValues;
        let image;
        let icon;
        if (values.image && typeof values.image === "string" && values.image.startsWith("http")) {
          image = ""
        }
        if (values.icon && typeof values.icon === "string" && values.icon.startsWith("http")){
          icon = ""
        }
        const updatedAdds = adds.map((add)=>{
          if(typeof add.icon === "string" && add.icon.startsWith('http'))
            return {
              ...add,
              icon:""
            }
          else return add;
        })
        updatedValues = {
          ...values,
          image:"",
          is_size,
          is_topping,
          is_component,
          is_nutrition,
          toppings:updatedAdds,
          components,
          sizes,
          nutrition:is_nutrition ? nutrition : null,
          id:initialValues?.id,
          icon:icon
        }
        console.log(updatedValues)
        await dispatch(updateItemAction({ data: updatedValues, id: masterId, subId }));
        await dispatch(resetUpdatedItem());
        await dispatch(getAllItemsAction({ id: masterId, subId, page }));
      }else{
        const finalValues = { 
          ...values,
          is_size,
          is_topping,
          is_component,
          is_nutrition,
          toppings:adds,
          components,
          sizes,
          nutrition: is_nutrition? nutrition : null
        };
        console.log(finalValues)
        await dispatch(addNewItemAction({ data: finalValues, id: masterId, subId }));
      }
      const message = mode === 'edit' ? "تم التعديل بنجاح" : "تمت الاضافة بنجاح"
      notify(message, "success");
      handleClose();
      formik.resetForm();
      setMainImage(avatar);
      setIconImage(avatar);
      getItems();
      await dispatch(resetAddItem());
      setAdds([]);
      setSizes([])
      setComponents([])
      setIconImage(avatar)
      setMainImage(avatar)
      
    },
    validationSchema: Yup.object({
      name_ar: Yup.string().required("الاسم باللغة العربية مطلوب"),
      name_en: Yup.string().required("الاسم باللغة الثانوية مطلوب"),
    }),
  });

  const { loading:addLoading, itemDetails, error:addError } = useSelector((state) => state.items.newItem);
  const { loading:updateLoading, updateditemDetails, error:updateError } = useSelector((state) => state.items.updatedItem
  );

  const getItems = async () => {
    await dispatch(getAllItemsAction({ id: masterId, subId, page }));
  };

  useEffect(() => {
    if (!addLoading && updateLoading) {
      formik.resetForm();
    }
  }, [handleClose, addLoading,updateLoading]);

  useEffect(() => {
    const error = addError || updateError
    if (error) notify(error.message, "error");
  }, [addError,updateError]);

  return (
    <Modal show={show} onHide={handleClose} centered >
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>{
            (mode === 'view' && "عرض تفاصيل العنصر" )||
            (mode === 'edit' && "تعديل النصر") ||
            "إضافة عنصر"
          }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box display="flex" gap={10} justifyContent="center" mb="20px">
            {[{ setter: setMainImage, label: "أضف صورة المنتج", id: "upload-photo", field: "image", src: mainImage },
              { setter: setIconImage, label: "أضف صورةأيقونةالمنتج", id: "upload-icon-photo", field: "icon", src: iconImage }].map((img, idx) => (
              <Box display="flex" justifyContent="center" mb="20px" key={idx}>
                <label htmlFor={img.id}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <img
                      src={img.src}
                      alt={img.label}
                      width="140px"
                      height="120px"
                      style={{ cursor: "pointer", aspectRatio: "3/2" }}
                    />
                    {img.label}
                  </Box>
                </label>
                {
                  mode !='view' && 
                  <input
                    accept="image/*"
                    id={img.id}
                    name="image"
                    type="file"
                    onChange={(e) => handleImageChange(e, img.setter, img.field)}
                    style={{ display: "none" }}
                  />
                }
              </Box>
            ))}
          </Box>

          {[
            { id: "name_ar", label: "الاسم باللغة العربية" },
            { id: "name_en", label: "الاسم باللغة الثانوية" },
            { id: "description_ar", label: "الوصف باللغة العربية" },
            { id: "description_en", label: "الوصف باللغة الثانوية" },
            { id: "price", label: "السعر", type: "number", inputProps: { min: 0 } },
          ].map(({ id, label, ...rest }) => (
            <TextField
              disabled = {mode === "view"}
              key={id}
              margin="dense"
              id={id}
              name={id}
              label={label}
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[id]}
              error={!!formik.touched[id] && !!formik.errors[id]}
              helperText={formik.touched[id] && formik.errors[id]}
              dir={id.includes("ar") ? "rtl" : "ltr"}
              {...rest}
              sx={id === "price" ? {
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
                "& input[type=number]": { MozAppearance: "textfield" },
              } : {}}
            />
          ))}

          <FormControl disabled={mode ==="view"} variant="outlined" fullWidth margin="dense" error={!!formik.touched.is_panorama && !!formik.errors.is_panorama}>
            <InputLabel id="is_panorama-label">Panorama</InputLabel>
            <Select
              labelId="is_panorama-label"
              id="is_panorama"
              name="is_panorama"
              value={formik.values.is_panorama}
              onChange={formik.handleChange}
              label="Panorama"
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>NO</MenuItem>
            </Select>
            {formik.touched.is_panorama && <FormHelperText>{formik.errors.is_panorama}</FormHelperText>}
          </FormControl>


          <h5  dir="rtl">الأحجام</h5>
          { sizes?.length > 0 ? sizes?.map((size,index)=>(
            <Grid container spacing={0} alignItems="center" key={index}>
              {
                mode!="view" &&
                <Grid item xs={1}>
                  <IconButton onClick={() => removeSize(index)}>
                    <CiCircleRemove color="error" />
                  </IconButton>
                </Grid>
              }
              {
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" mb="10px">
                    <label htmlFor={`upload-photo-${index}`} style={{ cursor: "pointer" }}>
                      <Box
                        width="80px"
                        height="80px"
                        borderRadius="50%"
                        overflow="hidden"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px solid #ccc"
                        sx={{ background: "#f0f0f0" }}
                      >
                        <img
                          src={typeof size.image === "string" ? size.image : size.image ? URL.createObjectURL(size.image) : avatar}
                          alt="extra"
                          width="100%"
                          height="100%"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    </label>
                    {
                      mode !="view" &&
                      <input
                        accept="image/*"
                        id={`upload-photo-${index}`}
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => handleSizeChange(index, "image", e.target.files[0])}
                      />
                    }
                  </Box>
                </Grid>
              }
              {["name_en", "name_ar", "price","description_ar","description_en"].map((field, i) => (
                <Grid item xs={12} key={field} mb={1}>
                  <TextField
                    disabled = {mode ==="view"}
                    label={field === "price" ? "Price" : field === "name_en" ? "Name (English)" : field === "name_ar" ?  "Name(Arabic)" : field === "description_en" ? "Description (English)" : "Description (Arabic)"}
                    type={field === "price" ? "number" : "text"}
                    value={size[field]}
                    onChange={(e) => handleSizeChange(index, field, e.target.value)}
                    fullWidth
                    inputProps={field === "price" ? { min: 0 } : {}}
                    sx={field === "price" ? {
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
                      "& input[type=number]": { MozAppearance: "textfield" },
                    } : {}}
                  />
                </Grid>
              ))}
            </Grid>
          )):(
            mode === "view" && 
            <h5  dir="rtl">لايوجد أحجام ن هذا المنتج</h5>
          )}
          {mode!="view"&&
            <Button
              startIcon={<IoIosAddCircleOutline />}
              variant="outlined"
              color="primary"
              onClick={addSize}
              style={{ marginTop: "10px",marginBottom:"10px" }}
            />
          }


          <h5  dir="rtl">الإضافات</h5>
          {adds?.length > 0 ? adds.map((extra, index) => (
            <Grid container spacing={0} alignItems="center" key={index}>
              {
                mode!="view" && 
                <Grid item xs={1}>
                  <IconButton onClick={() => removeExtra(index)}>
                    <CiCircleRemove color="error" />
                  </IconButton>
                </Grid>
              }
              {
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" mb="10px">
                    <label htmlFor={`upload-photo-${index}`} style={{ cursor: "pointer" }}>
                      <Box
                        width="80px"
                        height="80px"
                        borderRadius="50%"
                        overflow="hidden"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px solid #ccc"
                        sx={{ background: "#f0f0f0" }}
                      >
                        <img
                          src={typeof extra.icon === "string" ? extra.icon : extra.icon ? URL.createObjectURL(extra.icon) : avatar}
                          alt="extra"
                          width="100%"
                          height="100%"
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                    </label>
                    {
                      mode !="view" &&
                      <input
                        accept="image/*"
                        id={`upload-photo-${index}`}
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => handleExtraChange(index, "icon", e.target.files[0])}
                      />
                    }
                  </Box>
                </Grid>
              }
              {["name_en", "name_ar", "price"].map((field, i) => (
                <Grid item xs={12} key={field} mb={1}>
                  <TextField
                    disabled = {mode ==="view"}
                    label={field === "price" ? "Price" : `Name (${field === "name_en" ? "English" : "Arabic"})`}
                    type={field === "price" ? "number" : "text"}
                    value={extra[field]}
                    onChange={(e) => handleExtraChange(index, field, e.target.value)}
                    fullWidth
                    inputProps={field === "price" ? { min: 0 } : {}}
                    sx={field === "price" ? {
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
                      "& input[type=number]": { MozAppearance: "textfield" },
                    } : {}}
                  />
                </Grid>
              ))}

              
            </Grid>
          )):(
            mode==="view" && <p  dir="rtl"> لايوجد إضافات لهذا المنتج </p>
          )}
          {
            mode !="view"&&
            <Button
              startIcon={<IoIosAddCircleOutline />}
              variant="outlined"
              color="primary"
              onClick={addExtra}
              style={{ marginTop: "10px",marginBottom:"10px" }}
            />
          }

          <h5 dir="rtl">المكونات</h5>
          {components.length>0? components?.map((component,index)=>(
            <Grid container spacing={0} alignItems="center" key={index}>
              {
                mode!="view" &&
                <Grid item xs={1}>
                  <IconButton onClick={() => removeComponent(index)}>
                    <CiCircleRemove color="error" />
                  </IconButton>
                </Grid>
              }
              {["name_en", "name_ar"].map((field, i) => (
                <Grid item xs={12} key={field} mb={1}>
                  <TextField
                    disabled = {mode==="view"}
                    label={`Name (${field === "name_en" ? "English" : "Arabic"})`}
                    type={"text"}
                    value={component[field]}
                    onChange={(e) => handleComponentChange(index, field, e.target.value)}
                    fullWidth
                    inputProps={field === "price" ? { min: 0 } : {}}
                    sx={{ MozAppearance: "textfield" }}
                  />
                </Grid>
              ))}
              <Grid item xs={12} key={"status"} mb={1}>
                <InputLabel id="status">يمكن الإزالة</InputLabel>
                <Select disabled={mode==="view"} labelId="status" fullWidth value={component["status"]} onChange={(e)=>handleComponentChange(index,"status",e.target.value)}>
                  <MenuItem value={1}>نعم</MenuItem>
                  <MenuItem value={0}>لا</MenuItem>
                </Select>
              </Grid>
            </Grid>
          )):(
            mode === "view" && <p dir="rtl">المكونات غير متوفرة</p>
          )}
          {
            mode !== "view" && 
            <Button
              startIcon={<IoIosAddCircleOutline />}
              variant="outlined"
              color="primary"
              onClick={addComponent}
              style={{ marginTop: "10px",marginBottom:"10px"  }}
            />
          }

          <h5>القيمة الغذائية</h5>
          <Grid container spacing={0} alignItems="center" >
            {
              mode!="view" &&
              <Grid item xs={1}>
                <IconButton onClick={() => {
                  setShowNutritionSection(false)
                  setNutrition({
                    amount:'',
                    unit:'',
                    kcal:'',
                    protein:'',
                    fat:'',
                    carbs:''
                  })
                }}>
                  <CiCircleRemove color="error" />
                </IconButton>
              </Grid>
            }
            {showNutritionSection && ["amount", "kcal","protein","fat","carbs"].map((field, i) => (
              <Grid item xs={12} key={field} mb={1}>
                <TextField
                  disabled = {mode==="view"}
                  label={field}
                  type={"number"}
                  value={nutrition[field]}
                  onChange={(e) => setNutrition({...nutrition,[field]:e.target.value})}
                  fullWidth
                  sx={{ MozAppearance: "textfield" }}
                  inputProps={{min:0}}
                  required = {field === "amount" || field === "kcal"}
                />
              </Grid>
            ))}
            {showNutritionSection&&<Grid item xs={12} key={"unit"} mb={1}>
              <InputLabel id="unit">الواحدة</InputLabel>
              <Select disabled={mode==="view"} labelId="unit" fullWidth value={nutrition["unit"]} onChange={(e)=>setNutrition({...nutrition,unit:e.target.value})}>
                <MenuItem value={'g'}>g</MenuItem>
                <MenuItem value={"kg"}>kg</MenuItem>
                <MenuItem value={"L"}>L</MenuItem>
                <MenuItem value={"ml"}>ML</MenuItem>
              </Select>
            </Grid>}
          </Grid>
          {
            mode !== "view" && 
            <Button
              startIcon={<IoIosAddCircleOutline />}
              variant="outlined"
              color="primary"
              onClick={()=>setShowNutritionSection(true)}
              style={{ marginTop: "10px",marginBottom:"10px"  }}
            />
          }

          
        </Modal.Body>
        {
          mode!='view'&&
          <Modal.Footer>
            <Button variant="contained" className="mx-2" onClick={handleClose}>
              تجاهل
            </Button>
            <Button variant="contained" type="submit">
              {addLoading || updateLoading ? <Spinner animation="border" role="status" /> : "حفظ"}
            </Button>
          </Modal.Footer>
        }
      </form>
    </Modal>
  );
};
