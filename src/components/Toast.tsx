import React, { useCallback } from "react";
import { ToastContainer, toast, Slide, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

const Toast: React.FC<ToastProps> = ({ type, message }) => {
  const showToast = useCallback(() => {
    switch (type) {
      case "success":
        toast.success(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
        break;
      case "error":
        toast.error(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Bounce,
        });
        break;
      case "warning":
        toast.warn(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Bounce,
        });
        break;
      case "info":
        toast.info(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
        break;
      default:
        toast(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
        break;
    }
  }, [type, message]);

  React.useEffect(() => {
    showToast();
  }, [type, message, showToast]);

  return <ToastContainer />;
};

export default Toast;
