import { useState } from 'react';
import { useRouter } from 'next/router';

import useStore from './useStore';
import { API_INVESTMENT } from '../common/paths';
import useAlert from './useAlert';
import useNavigation from './useNavigation';
import { IInvestmentPayload } from '../common/types';

const useSubmitForm: () => [boolean, boolean, () => void] = () => {
  const [isLoading, setLoading] = useState(false);
  const store = useStore();
  const navigation = useNavigation();
  const router = useRouter();
  const [isAlertShown, setError] = useAlert();

  const submitForm = () => {
    setLoading(true);
    const payload: IInvestmentPayload = {
      email: store.investorData.email,
      investment_amount: store.investorData.amount,
      project_id: store.getCurrentProjectInfo()?.id,
    };
    window
      .fetch(API_INVESTMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        setError(false);
        navigation.setDataSent(true);
        navigation.nextPage(router.asPath);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [isLoading, isAlertShown, submitForm];
};

export default useSubmitForm;
