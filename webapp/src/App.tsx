import { useRef } from 'react';
import { HashRouter, Route, useHistory, } from 'react-router-dom';

import './firebaseinit';
import './App.css';
import 'filepond/dist/filepond.css';
import firebase from 'firebase';

import Home from './Home';
import Login from './Login';
import Classes from './Classes';
import Class from './Class';
import Assignment from './Assignment';

import React, { useState, useEffect } from 'react';

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
import List from '@material-ui/core/List'
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { apiRequest } from './utils';

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

  const handleClick = (event: any) => {
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

        }}>{props.user.displayName}</MenuItem>
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
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [joinOpen, setJoinOpen] = React.useState<boolean>(false);
  const [createOpen, setCreateOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const joinRef = useRef('');
  const nameRef = useRef('');
  const descRef = useRef('');

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleJoinClass = async () => {
    // @ts-ignore
    const code = joinRef.current.value.replace(/ /g, '');
    if (code.length > 6) return alert('Invalid Class Code!')
    setLoading(true)

    try {
      const response = await apiRequest({
        route: '/joinclass',
        payload: {
          joinCode: code
        },
        method: 'POST'
      })
      window.location.reload();
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  }

  const handleCreateClass = async () => {
    // @ts-ignore
    const name = nameRef.current.value;
    // @ts-ignore
    const desc = descRef.current.value;

    if (!name || !desc) return alert('Please complete the form!')

    try {
      const response = await apiRequest({
        route: '/classes',
        payload: {
          name: name,
          description: desc
        },
        method: 'POST'
      })
      alert(`Class created with join code ${response.joinCode}`)
      window.location.reload();
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="fixed">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography onClick={() => history.push('/h')} className={classes.title} variant="h5" noWrap style={{ cursor: "pointer", }}>
            codingScale
          </Typography>
          <Route path="/h">
            <IconButton onClick={handleClick}>
              <AddIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                setJoinOpen(true);
                handleClose();
              }}>Join Class</MenuItem>
              <Dialog open={joinOpen} onClose={() => setJoinOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Join class</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Ask your teacher for the class code, then enter it here.
                   </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="6-Digit Class Code"
                    type="text"
                    fullWidth
                    inputRef={joinRef}
                    disabled={loading}
                    required
                  />
                </DialogContent>
                <DialogActions>
                  <Button disabled={loading} onClick={() => setJoinOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button disabled={loading} onClick={() => {
                    handleJoinClass();
                  }} color="primary">
                    Join
                  </Button>
                </DialogActions>
              </Dialog>
              <MenuItem onClick={() => {
                setCreateOpen(true);
                handleClose();
              }}>Create Class</MenuItem>
              <Dialog open={createOpen} onClose={() => setCreateOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create a new class</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Class Name"
                    type="text"
                    fullWidth
                    inputRef={nameRef}
                    disabled={loading}
                    required
                  />
                  <TextField
                    margin="dense"
                    id="name"
                    label="Description"
                    type="text"
                    fullWidth
                    inputRef={descRef}
                    disabled={loading}
                    required
                  />
                </DialogContent>
                <DialogActions>
                  <Button disabled={loading} onClick={() => setCreateOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button disabled={loading} onClick={() => {
                    handleCreateClass();
                  }} color="primary">
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </Menu>
          </Route>
          {props.user !== null && (
            <>
              {props.user ? (
                <AvatarButton user={props.user} />
              ) : (
                <Button onClick={() => history.push('/login')}>
                  Sign in
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </div >
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        console.log('Hey! What are you doing in the JavaScript console?')
      } else {
        history.push('/login')
        setUser(undefined);
      }
    })
  })

  return (
    <>
      <ButtonAppBar user={user} />
      <Container style={{ marginTop: "128px" }}>
        {user !== null && (
          <>
            <Route exact path="/"><Home /></Route>
            <Route exact path="/h"><Classes user={user} /></Route>
            <Route exact path="/c/:cid"><Class user={user} /></Route>
            <Route exact path="/c/:cid/a/:aid"><Assignment /></Route>
          </>
        )}
        <Route exact path="/login"><Login user={user} /></Route>
      </Container>
    </>
  );
}

function AppWithRouter() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}

export default AppWithRouter;
