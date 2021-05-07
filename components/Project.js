import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2),
  },
}));

const Project = ({ project, onClick, isActive }) => {
  const { id, name, location } = project;
  const handleClick = useCallback(() => onClick(project), [project, onClick]);
  const classes = useStyles();
  return (
    <div className={classes.root} data-testid={`project_${id}`}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            onClick={handleClick}
            variant="contained"
            fullWidth
            color={isActive ? 'primary' : 'default'}>
            <Box spacing={2} display="flex" flexDirection="column" alignContent="stretch">
              <Box p={1}>
                <Typography variant="caption">{name}</Typography>
              </Box>
              <Box p={1}>
                <Typography variant="caption">{location}</Typography>
              </Box>
            </Box>
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

Project.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default observer(Project);
