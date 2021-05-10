import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';

import useStore from '../hooks/useStore';
import useSubmitForm from '../hooks/useSubmitForm';
import { formatCurrency } from '../common/intl';

const ConfirmInfo = () => {
  const [isTocChecked, setToc] = useState(false);
  const store = useStore();

  const [isLoading, isAlertShown, submitForm] = useSubmitForm();

  const handleChangeToc = useCallback((event) => {
    setToc(event.target.checked);
  }, []);

  return (
    <>
      {isAlertShown && (
        <Alert severity="error" data-testid="alert">
          <AlertTitle>Something went wrong!</AlertTitle>
          Please check you network connection
        </Alert>
      )}
      <Box display="flex" flexDirection="column" alignContent="stretch" alignItems="flex-start">
        <Box display="flex" flexDirection="row">
          <Box width="150px" p={1}>
            project
          </Box>
          <Box flexGrow={1} p={1}>
            {store.getCurrentProjectInfo()?.name}
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <Box width="150px" p={1}>
            email
          </Box>
          <Box flexGrow={1} p={1} data-testid="email">
            {store.investorData?.email}
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <Box width="150px" p={1}>
            amount
          </Box>
          <Box flexGrow={1} p={1} data-testid="amount">
            {formatCurrency(store.investorData?.amount)}
          </Box>
        </Box>
        <Box p={2}>
          <FormControl component="fieldset">
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  checked={isTocChecked}
                  onChange={handleChangeToc}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  data-testid="checkbox"
                />
              }
              label="I accept the terms and conditions"
              labelPlacement="end"
            />
          </FormControl>
        </Box>
        <Box display="flex" p={2} justifyContent="center" data-testid="button">
          <Button
            type="button"
            disabled={!isTocChecked || isLoading}
            variant="contained"
            color="primary"
            onClick={submitForm}>
            {isLoading && <CircularProgress size={20} data-testid="spinner" />}
            Invest
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default observer(ConfirmInfo);
