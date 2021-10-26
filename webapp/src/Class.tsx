import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Collapse from '@material-ui/core/Collapse';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddButton from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PeopleIcon from '@material-ui/icons/People';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import moment from 'moment';

import { apiRequest } from './utils';
import { OpenInBrowserSharp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "auto"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: "grey",
    },
}));

function AssignmentCard(props: any) {
    const { name, id, created_at, classid } = props;
    const history = useHistory();
    const classes = useStyles();

    return (
        <>
            <Card>
                <CardActionArea onClick={() => history.push(`/c/${classid}/a/${id}`)}>
                    <CardHeader
                        avatar={
                            <Avatar className={classes.avatar}>
                                <AssignmentIcon />
                            </Avatar>
                        }
                        title={`You${props.isTeacher ? "" : "r teacher"} posted a new assignment: ` + name}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {moment(created_at).calendar()}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}

function StudentList(props: any) {
    const { studentList } = props;
    const { cid } = useParams<any>();
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const renderStudents = () => {
        return studentList.map((data: any, idx: number) => {
            return (
                <ListItem>
                    <ListItemIcon>
                        <Avatar src={data.photoURL}></Avatar>
                    </ListItemIcon>
                    {data.userid === data.teacherid ? (
                        <ListItemText
                            primary={`${data.name} (Teacher)`} />
                    ) : (
                        <ListItemText
                            primary={data.name} />
                    )}
                </ListItem>
            )
        })
    }

    return (
        <>
            <IconButton onClick={handleOpen} style={{ float: "right" }}>
                <PeopleIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Joined Students</DialogTitle>
                <DialogContent>
                    {!studentList && <CircularProgress style={{ marginLeft: "50%", marginTop: "50px" }} />}
                    {studentList && (
                        <List>
                            {renderStudents()}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function Class(props: any) {
    const { user } = props;
    const { cid } = useParams<any>();
    const [status, setStatus] = useState<any>('idle');
    const [classData, setClassData] = useState<any>(undefined);
    const [assignmentList, setAssignmentList] = useState<any>(undefined);
    const [isTeacher, setIsTeacher] = useState<any>(undefined);
    const [studentList, setStudentList] = useState<any>(undefined);

    const [open, setOpen] = useState<boolean>(false);
    const [posting, setPosting] = useState<boolean>(false);
    const nameRef = useRef<any>('');
    const descRef = useRef<any>('');

    useEffect(() => {
        updateAssignments();
        (async () => {
            const resp = await apiRequest({
                route: `/classes/${cid}/students`,
                method: 'GET',
            });
            setStudentList(resp.students);
        })();
    }, [])

    const updateAssignments = async () => {
        try {
            const data = await apiRequest({
                route: `/classes/${cid}`,
                method: 'GET'
            })
            setStatus(data.status);
            setClassData(data.class);
            setAssignmentList(data.assignments);
            setIsTeacher(data.class.teacherid === user.uid)
        } catch (error) {
            setStatus('failed');
        }
    }

    const handleAssignmentCreate = async () => {
        const name = nameRef.current.value;
        const desc = descRef.current.value;
        setPosting(true);

        try {
            if (!name || !desc) {
                setPosting(false);
                return alert('The form isn\'t complete!')
            }
            await apiRequest({
                route: `/classes/${cid}/assignments`,
                payload: {
                    name: name,
                    description: desc
                },
                method: 'POST'
            })
            updateAssignments();
            setOpen(false);
        } catch (error) {
            alert(error);
        }
        setPosting(false);
    }

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const renderAssignments = () => {
        if (!assignmentList || assignmentList.length === 0) {
            return <Typography>Looks like there's nothing here.🎉</Typography>
        }
        return assignmentList.map((data: any, idx: any) => {
            return (
                <Grid item key={idx} xs={12}>
                    <AssignmentCard {...data} isTeacher={isTeacher} />
                </Grid>
            )
        })
    }

    if (status === 'idle') {
        return <CircularProgress style={{ marginLeft: "50%", marginTop: "50px" }} />
    } else if (status === 'failed') {
        return <Typography>Something went wrong. Try logging out and back in.</Typography>
    } else {
        return (
            <>
                <Typography variant="h5">{classData?.classname}</Typography>
                <Typography variant="subtitle2">Join Code: {classData?.joincode}</Typography>
                {classData && classData.teacherid === user.uid && (
                    <>
                        <IconButton style={{ float: "right" }} onClick={handleOpen}>
                            <AddButton />
                        </IconButton>
                        <StudentList studentList={studentList}/>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Create an assignment</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Assignment Name"
                                    type="text"
                                    fullWidth
                                    inputRef={nameRef}
                                    disabled={posting}
                                    required
                                />
                                <TextField
                                    multiline
                                    margin="dense"
                                    id="name"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    inputRef={descRef}
                                    disabled={posting}
                                    rows={8}
                                    required
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={posting} onClick={handleClose} color="primary">
                                    Cancel
                        </Button>
                                <Button disabled={posting} onClick={() => {
                                    handleAssignmentCreate();
                                }} color="primary">
                                    Create
                        </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
                <Grid container spacing={4}>
                    {renderAssignments()}
                </Grid>
            </>
        )
    }
}

export default Class;