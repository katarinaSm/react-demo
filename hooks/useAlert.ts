import { useEffect, useState } from 'react';

const VISIBLE_FOR_MS = 3000;

/**
 * useAlert hook is retriggerable
 * @returns {[boolean, fn:(boolean) => void]}
 * First item of tuple determines visibility of alert
 * Second item is used to trigger alert
 */
const useAlert: () => [boolean, (value: boolean) => void] = () => {
  const [hasError, setError] = useState(false);
  const [isAlertShown, setAlertShown] = useState(false);

  useEffect(() => {
    let timer;
    const clear = () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
    if (hasError) {
      clear();
      setAlertShown(true);
      timer = setTimeout(() => {
        setError(false);
        setAlertShown(false);
      }, VISIBLE_FOR_MS);
    }
    return clear;
  }, [hasError]);
  return [isAlertShown, setError];
};

export default useAlert;
