import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (msg, type) => {
  if (type === "warn") toast.warn(msg);
  else if (type === "success") toast.success(msg);
  else if (type === "error") toast.error(msg);
  else if (type === 'info') toast.info(msg)
};

export default notify;
