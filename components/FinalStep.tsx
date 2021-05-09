import React from 'react';
import Box from '@material-ui/core/Box';

import { Typography } from '@material-ui/core';

const FinalStep = () => (
  <Box display="flex" flexDirection="column" alignContent="stretch">
    <Box display="flex" justifyContent="center" p={3}>
      <Typography variant="caption">Thank you!</Typography>
    </Box>
  </Box>
);

export default FinalStep;
