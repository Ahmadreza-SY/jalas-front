import { toast, ToastContent } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ToastUtilsClass {
  constructor() {
    toast.configure({ draggable: false, closeButton: false, hideProgressBar: true });
  }
  error(content: ToastContent) {
    toast.error(content);
  }
  success(content: ToastContent){
    toast.success(content);
  }
}
export default new ToastUtilsClass();