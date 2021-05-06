import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Container from '@material-ui/core/Container';
import { useRouter } from 'next/router';

import { cms } from '../common/cms';

import useStore from '../hooks/useStore';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(6),
    paddingTop: theme.spacing(6),
    borderTop: '1px solid grey',
  },
}));

const Layout = ({ children }) => {
  const store = useStore();
  const classes = useStyles();
  const router = useRouter();
  const pageInfo = store.getCurrentPageInfo(router.asPath);
  return (
    <div>
      <Stepper activeStep={pageInfo?.number - 1}>
        {cms.map(({ title, id }) => (
          <Step key={id}>
            <StepLabel>{title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="h6" component="h6" align="center">
        Step
        {pageInfo?.number}
      </Typography>
      <Typography variant="h6" component="h6" align="center" gutterBottom>
        {pageInfo?.title}
      </Typography>
      <div className={classes.root}>
        <Container maxWidth="sm">{children}</Container>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default observer(Layout);
