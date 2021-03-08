import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import {
  Container
} from '@material-ui/core';

import './firebaseinit';
import './App.css';
import firebase from 'firebase';

import Home from './Home';
import Login from './Login';
import Classes from './Classes';

import { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: "monospace"
  },
}));

function AvatarButton(props: any) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar alt={props.user.displayName} src={props.user.photoURL} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          handleClose();

        }}>Settings</MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          firebase.auth().signOut();
        }}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

function ButtonAppBar(props: any) {
  const classes = useStyles();

  console.log(props.user);

  return (
    <div className={classes.root}>
      <AppBar color="transparent" position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {props.title ?? (
              <>
                <Typography className={classes.title} variant="h6" noWrap>
                  codingScale
                </Typography>
              </>
            )}
          </Typography>
          {props.user ? (
            <AvatarButton user={props.user} />
          ) : (
            <p>no hi</p>
          )}
        </Toolbar>
      </AppBar>
    </div >
  );
}

function App() {
  const [user, setUser] = useState<any>(undefined);
  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    })
  })



  return (
    <Router>
      <ButtonAppBar user={user} />
      <Container style={{ marginTop: "64px" }}>
        <Route exact path="/"><Home /></Route>
        <Route exact path="/login"><Login user={user} /></Route>
        <Route exact path="/h"><Classes user={user} /></Route>
        <Route exact path="/c/:cid"><Classes user={user} /></Route>
        <Route exact path="/c/:cid/a/:aid"></Route>
      </Container>
    </Router>
  );
}

export default App;
