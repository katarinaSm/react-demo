import React, { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import useStore from '../hooks/useStore';
import { PROJECT_LIST_API_EP } from '../common/paths';
import Project from './Project';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Projects = () => {
  const router = useRouter();
  const { isLoading, error, data } = useQuery('fetchProjs', () =>
    window.fetch(PROJECT_LIST_API_EP).then((res) => res.json()),
  );

  const store = useStore();

  useEffect(() => {
    store.setProjects(data?.projects);
  }, [data?.projects, store]);

  const onClick = useCallback(
    (project) => {
      store.setProject(project);
      store.nextPage(router.asPath);
    },
    [store, router.asPath],
  );

  const classes = useStyles();
  return (
    <div>
      <Typography variant="h5" component="h5">
        Projects
      </Typography>
      <Paper className={classes.paper}>
        {error && <h3>Something went ... </h3>}
        {isLoading && <h3 data-testid="loader">Searching for available projects</h3>}
        {data &&
          data.projects.map((project) => (
            <Project
              isActive={store.currentProject?.id === project.id}
              onClick={onClick}
              key={project.id}
              project={project}
            />
          ))}
      </Paper>
    </div>
  );
};

export default observer(Projects);
