//create basic navbar with material-ui
import React from 'react';
import { Grid, AppBar, Toolbar, CssBaseline, Typography, makeStyles, } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { SignIn } from '../SignIn';
import history from '../Navigation/history';
import { useUser } from '../Firebase/context';


const useStyles = makeStyles((theme) => ({
  navlinks: {
    display: "flex",

  },
  link: {
    fontFamily: 'Biryani, sans-serif',
    textDecoration: "none",
    fontWeight: 800,
    color: "white",
    fontSize: "15px",
    marginLeft: '10%',
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
    "&.active": {
      background: 'red',
      color: "yellow",
      borderBottom: "1px solid white",
    },
  },
  logo: {
    fontFamily: 'Biryani, sans-serif',
    fontSize: '1.5rem',
    color: 'white',
    fontWeight: 800,
    borderBottom: 'yellow 2px solid',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));
const Navbar = () => {
  const classes = useStyles();
  const user = useUser()

  function refreshPage() {
    window.location.reload(false);
  }
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" sx = {{zIndex: 1201}}>
        <Toolbar className={classes.toolbar}>
          <Grid item xs={4} className={classes.navlinks}>
              <Link
                to='/'
                onClick={() => history.push('/')}
                className={classes.link}
              >
                Home
              </Link>
            <Link
              to='/explore'
              onClick={() => history.push('/explore')}
              className={classes.link}>
              Explore
            </Link>
            {user &&
              <Link
                to='/myclubs'
                onClick={() => history.push('/myclubs')}
                className={classes.link}>
                My Clubs
              </Link>}
          </Grid>
          <Link
            to='/'
            onClick={() => history.push('/')}
            className={classes.link}
            style={{ margin: '0' }}>
            <Typography className={classes.logo}>CLUBHUB</Typography>
          </Link>
          <Grid xs={4} item style={{ display: 'flex', justifyContent: 'end', paddingRight: '46px' }}>
            <SignIn />
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
export default Navbar;