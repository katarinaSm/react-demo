import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';

import useStore from '../hooks/useStore';
import useNavigation from '../hooks/useNavigation';

const schema = yup.object().shape({
  amount: yup
    .number()
    .moreThan(0, 'Show me the money')
    .required('Please enter a number')
    .typeError('Please enter a valid positive number'),
  email: yup
    .string()
    .email('Please provide a valid email address')
    .required('Email is a required field'),
});

const InvestorInformation = () => {
  const store = useStore();
  const navigation = useNavigation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...store.investorData,
    },
  });

  const onSubmit = useCallback(
    (data) => {
      store.setInvestorData(data);
      navigation.nextPage(router.asPath);
    },
    [store, navigation, router],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl component="fieldset" error={!!errors} fullWidth>
        <Box display="flex" flexDirection="column" alignContent="stretch">
          <Box display="flex" flexDirection="column" p={1}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  onChange={onChange}
                  helperText={error ? error.message : null}
                  error={!!error}
                  value={value}
                  type="email"
                  placeholder="Your email address"
                  variant="outlined"
                  fullWidth
                  data-testid="email"
                />
              )}
            />
          </Box>
          <Box display="flex" flexDirection="column" p={1}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box flexGrow={1}>
                <Controller
                  name="amount"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      onChange={onChange}
                      helperText={error ? error.message : null}
                      error={!!error}
                      value={value}
                      type="tel"
                      placeholder="Investment amount"
                      variant="outlined"
                      fullWidth
                      data-testid="amount"
                    />
                  )}
                />
              </Box>
              <Box flexGrow={0} p={2}>
                EUR
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" p={3} data-testid="button">
            <Button type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </Box>
        </Box>
      </FormControl>
    </form>
  );
};

export default observer(InvestorInformation);
