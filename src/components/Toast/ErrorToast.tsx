'use client';

import { FC, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface Props {
  errorMsg: string | undefined;
}

const ErrorToast: FC<Props> = ({ errorMsg }) => {
  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg]);

  return <Toaster richColors position="top-right" closeButton />;
};
export default ErrorToast;
