import { FC, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface Props {
  infoMsg: string;
  onMessageClose?: () => void;
}

const InfoToast: FC<Props> = ({ infoMsg, onMessageClose }) => {
  useEffect(() => {
    if (infoMsg) {
      toast.info(infoMsg, {
        onDismiss: onMessageClose,
        onAutoClose: onMessageClose,
      });
    }
  }, [infoMsg, onMessageClose]);

  return <Toaster richColors position="top-right" closeButton />;
};
export default InfoToast;
