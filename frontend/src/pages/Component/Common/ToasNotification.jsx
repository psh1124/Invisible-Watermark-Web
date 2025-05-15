const ToastNotification = ({ message, type }) => {
    return <div className={`toast ${type}`}>{message}</div>;
  };
  
  export default ToastNotification;
  