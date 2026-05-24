"use client";

import { FC, useEffect } from "react";
import { toast } from "sonner";

interface Props {
  successMsg: string;
  onMessageClose?: () => void;
}

const SuccessToast: FC<Props> = ({
  successMsg: successMessage,
  onMessageClose,
}) => {
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        id: `success-${successMessage}`,
        onAutoClose: onMessageClose,
        onDismiss: onMessageClose,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage]);

  return null;
};
export default SuccessToast;
