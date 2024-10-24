import { toast } from "sonner";

const showToast = (title, description, action=undefined) => {
  toast(title, {
    description: description,
    action
  });
};

export default showToast;