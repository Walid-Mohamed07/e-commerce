'use client';

import { FC, useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
  errorMsg: string | undefined;
}

const ErrorToast: FC<Props> = ({ errorMsg }) => {
  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg, { id: `error-${errorMsg}` });
    }
  }, [errorMsg]);

  return null;
};
export default ErrorToast;
