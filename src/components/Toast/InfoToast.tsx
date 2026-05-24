"use client";

import { FC, useEffect } from "react";
import { toast } from "sonner";

interface Props {
  infoMsg: string;
  onMessageClose?: () => void;
}

const InfoToast: FC<Props> = ({ infoMsg, onMessageClose }) => {
  useEffect(() => {
    if (infoMsg) {
      toast.info(infoMsg, {
        id: `info-${infoMsg}`,
        onDismiss: onMessageClose,
        onAutoClose: onMessageClose,
      });
    }
  }, [infoMsg, onMessageClose]);

  return null;
};
export default InfoToast;
