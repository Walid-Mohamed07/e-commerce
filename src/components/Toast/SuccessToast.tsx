import { FC, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface Props {
  successMsg: string;
  onMessageClose?: () => void;
}

const ErrorToast: FC<Props> = ({
  successMsg: successMessage,
  onMessageClose,
}) => {
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        onAutoClose: onMessageClose,
        onDismiss: onMessageClose,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage]);

  return <Toaster richColors position="top-right" closeButton />;
};
export default ErrorToast;
