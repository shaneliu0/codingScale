import { useEffect, useState, useRef, forwardRef } from 'react';
import firebase from 'firebase';
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
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import CodeIcon from '@material-ui/icons/Code';
import DescriptionIcon from '@material-ui/icons/Description';
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close';
import Grow from '@material-ui/core/Grow';
import Container from '@material-ui/core/Container';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';

// @ts-ignore
import { FilePond, File, registerPlugin } from 'react-filepond';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import { apiRequest, baseURL } from './utils';
import { StringLiteral } from 'typescript';

registerPlugin(FilePondPluginFileRename, FilePondPluginFileEncode, FilePondPluginFileValidateSize)

const Transition = forwardRef(function Transition(props, ref) {
    // @ts-ignore
    return <Grow ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Submission(props: any) {
    const { submitted } = props;
    const [files, setFiles] = useState([]);
    const { cid, aid } = useParams<any>();
    const [token, setToken] = useState<string | undefined>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const entryPointRef = useRef<any>('');

    useEffect(() => {
        (async () => {
            const token = await firebase.auth().currentUser?.getIdToken(true);
            setToken(token);
        })();
    }, [])

    const handleSubmission = async () => {
        setSubmitting(true);
        let entrypoint = entryPointRef.current.value;
        entrypoint = entrypoint.replace(/\s/g, "");
        try {
            if (!entrypoint || !(entrypoint.endsWith(".py") || entrypoint.endsWith(".java")) || !(props.submissions.some((e: any) => e.filename === entrypoint) || files.some((e: any) => e.filename === entrypoint))) {
                setSubmitting(false);
                return alert('Looks like your entrypoint is incorrectly formatted. It should end with .py or .java and should be one of your uploaded files.')
            } else if (props.submissions.length === 0 && files.length === 0) {
                if (!window.confirm('Submit with no files and mark as complete?')) return setSubmitting(false);
            } else {
                if (!window.confirm('Are you sure you want to submit? This can\'t be undone.')) return setSubmitting(false);
            }
            const response = await apiRequest({
                route: `/classes/${cid}/assignment/${aid}`,
                method: "POST",
                payload: {
                    entrypoint: entrypoint
                }
            })

            if (response.status) {
                alert('Successfully submitted!');
                window.location.reload();
            }
        } catch (e) {
            console.log(e);
            alert(e.message);
        }
        setSubmitting(false);
    }

    if (token) {
        return (
            <div style={{ marginTop: "20px" }}>
                {!submitted && (
                    <div className="App">
                        <FilePond
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={true}
                            maxFiles={12}
                            allowRevert={false}
                            name="files"
                            labelIdle='Drag and Drop your files or <span class="filepond--label-action">Browse</span>.'
                            maxFileSize="5MB"
                            labelMaxFileSizeExceeded="File is too large! Max filesize is 5MB."
                            server={{
                                process: {
                                    url: `${baseURL}/classes/${cid}/assignment/${aid}/submissions`,
                                    headers: {
                                        authorization: token
                                    }
                                }
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Entry Point (Case-Sensitive)"
                            type="text"
                            fullWidth
                            inputRef={entryPointRef}
                            disabled={submitting}
                            required
                        />
                    </div>
                )}
                <Button onClick={handleSubmission} disabled={submitted} variant="contained" color="primary">{submitted ? "Submitted" : "Submit Assignment"}</Button>
            </div>
        )
    } else {
        return <CircularProgress variant="indeterminate" style={{ marginLeft: "50%", marginTop: "50px" }} />
    }
}

function GradeSubmissions() {
    const { cid, aid } = useParams<any>();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [method, setMethod] = useState('');
    const [resultList, setResultList] = useState<any>(undefined);
    const [submissionList, setSubmissionList] = useState<any>(undefined);
    const answerRef = useRef<any>('');
    const inputStringRef = useRef<any>('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: any) => {
        setMethod(event.target.value);
    };

    const handleSubmission = async () => {
        const inputString = inputStringRef.current.value;
        setSubmitting(true);
        try {
            const response = await apiRequest({
                route: `/classes/${cid}/assignment/${aid}/grade`,
                method: 'POST',
                payload: {
                    inputString: inputString
                }
            })

            console.log(response);
            setSubmissionList(response.submissions);
            setResultList(response.responses);
        } catch (e) {
            console.error(e);
        }
        setSubmitting(false);
    };

    const checkIfCorrect = (stdout: String) => {
        const answer = answerRef.current.value;
        switch (method) {
            case 'INCLUDES':
                if (stdout.includes(answer)) return true;
                break;
            case 'EXACTMATCH':
                if (stdout === answer || stdout.trimEnd() === answer) return true;
                break;
            case 'NEUTRAL':
                return false;
            default:
                return;
        }
    }

    const renderSubmissions = () => {
        return resultList!.map((data: any, idx: number) => {
            const submission = submissionList[idx];
            const fulfilled = data.status === 'fulfilled';
            const correct = fulfilled && checkIfCorrect(data.value.stdout);
            let avatarBackground;
            if (correct) {
                avatarBackground = "#009F6B"
            } else if (fulfilled && !correct) {
                avatarBackground = "#FFD300"
            } else {
                avatarBackground = "#C40233"
            }
            return (
                <Grid item sm={12}>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar style={{ backgroundColor: avatarBackground }}>
                                    {fulfilled ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                                </Avatar>
                            }
                            title={submission.studentname}
                        />
                        <CardContent>
                            <Typography variant="subtitle2">Entry Point: {submission.entrypoint}</Typography>
                            <p></p>
                            {fulfilled ? (
                                <>
                                    <Typography variant="h6">Program output</Typography>
                                    <Typography variant="body1">{data.value.stdout}</Typography>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">Program output</Typography>
                                    <Typography variant="body1">{data.reason.stdout}</Typography>
                                    <Typography variant="h6">Program Error</Typography>
                                    <Typography variant="body1">{data.reason.stderr}</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            )
        })
    }

    return (
        <div>
            <Button disabled={submissionList && submissionList.length === 0} variant="contained" color="primary" onClick={handleClickOpen}>
                Prepare for grading
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Grade Submissions
              </Typography>
                    </Toolbar>
                </AppBar>
                <Container style={{ marginTop: "20px" }}>
                    <Typography variant="h6">Set your test case</Typography>
                    <Typography variant="subtitle1">Tip: if you would enter name first and then email when running the program regularly,
                                                    you would enter with the line breaks<code><p>Tony Stark</p><p>tony@starkindustries.com</p></code></Typography>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Method</InputLabel>
                        <Select
                            id="demo-simple-select"
                            value={method}
                            onChange={handleChange}
                            required
                            disabled={submitting}
                        >
                            <MenuItem value={'INCLUDES'}>Output Includes (recommended)</MenuItem>
                            <MenuItem value={'EXACTMATCH'}>Exact Match</MenuItem>
                            <MenuItem value={'NEUTRAL'}>No Auto-Grading</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        multiline
                        margin="dense"
                        id="name"
                        label="Program Input"
                        type="text"
                        fullWidth
                        inputRef={inputStringRef}
                        disabled={submitting}
                        rows={3}
                    />
                    <TextField
                        multiline
                        margin="dense"
                        id="name"
                        label="Expected Output"
                        type="text"
                        fullWidth
                        inputRef={answerRef}
                        disabled={submitting}
                        rows={3}
                    />
                    <Button variant="outlined" color="primary" onClick={handleSubmission} disabled={submitting}>Submit to server for grading!</Button>
                    {submitting && (
                        <div style={{ margin: "50px" }}>
                            <LinearProgress />
                            <Typography style={{ textAlign: "center" }} variant="h6">Sit tight! We're running the code on our servers for you.</Typography>
                            <img style={{ marginLeft: "20%", marginRight: "auto", borderRadius: "30px" }} src="https://thumbs.gfycat.com/MellowFriendlyDeermouse-size_restricted.gif" alt="loading"></img>
                        </div>
                    )}
                    {resultList && (
                        <>
                            <Typography variant="h6">Results</Typography>
                            <Grid container spacing={4} style={{ marginTop: "25px" }}>
                                {renderSubmissions()}
                            </Grid>
                        </>
                    )}
                </Container>
            </Dialog>
        </div>
    );
}

function ViewAndRunCode(props: any) {
    const { cid, aid } = useParams<any>();
    const [submissionList, setSubmissionList] = useState<any>(undefined);

    useEffect(() => {
        (async () => {
            try {
                const { submissions } = await apiRequest({
                    route: `/classes/${cid}/assignment/${aid}/submissions`,
                    method: "GET",
                })

                setSubmissionList(submissions);
            } catch (e) {
                alert(e);
            }
        })();
    }, [])

    const renderSubmissions = () => {
        if (submissionList.length === 0) return (
            <>
                <img style={{ width: "200px", height: "200px", borderRadius: "100%", marginLeft: "20%", marginTop: "100px" }} src="https://i.imgur.com/Ht5ZipG.png" alt="none"></img>
                <div style={{ textAlign: "center", marginTop: "-100px", }}>
                    <Typography variant="h6">Looks like there aren't any submissions yet.</Typography>
                    <Typography variant="subtitle1">When one of your students submits an assignment, it will show up here.</Typography>
                </div>
            </>

        );
        return submissionList?.map((submission: any, idx: any) => {
            return (
                <Grid item key={idx}>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar src={submission.photoURL}></Avatar>
                            }
                            title={submission.studentname} />
                        <CardContent>
                            <Typography variant="body1">Files submitted</Typography>
                            <Typography variant="subtitle2">{moment(submission.timestamp).calendar()}</Typography>
                            <List dense>
                                {submission.files.map((data: any, idx: any) => {
                                    return (
                                        <ListItem>
                                            <ListItemIcon>
                                                {(data.filename === submission.entrypoint) ? <TransitEnterexitIcon /> : <DescriptionIcon />}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={data.filename} />
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            )
        })
    }

    if (submissionList) {
        return (
            <div style={{ marginTop: "20px" }}>
                <Typography variant="h6">Student Submissions</Typography>
                <GradeSubmissions />
                <Grid container spacing={4} style={{ height: "600px", overflowY: "auto", marginTop: "10px" }}>
                    {renderSubmissions()}
                </Grid>
            </div>
        )
    } else {
        return (
            <CircularProgress style={{ marginLeft: "50%", marginTop: "50px" }} />
        )
    }
}

function Assignment(props: any) {
    const { cid, aid } = useParams<any>();
    const [assignment, setAssignment] = useState<any>(undefined);
    const { name, description, id, created_at, classid } = assignment ?? {};
    const [submitted, setSubmitted] = useState<any>(undefined);
    const [submissions, setSubmissions] = useState<any>(undefined);
    const [isTeacher, setIsTeacher] = useState<any>(undefined);

    useEffect(() => {
        (async () => {
            try {
                const data = await apiRequest({
                    route: `/classes/${cid}/assignment/${aid}`,
                    method: 'GET'
                })

                setAssignment(data.assignment);
                setSubmitted(data.isSubmitted);
                setSubmissions(data.submissions);
                setIsTeacher(data.isTeacher);
            } catch (error) {
                alert(error)
            }
        })();
    }, [])

    const renderSubmitted = () => {
        if (!submissions) return;
        return submissions.map((data: any, idx: any) => {
            return (
                <Grid item>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar>
                                    <CodeIcon />
                                </Avatar>
                            }
                            title={data.filename} />
                    </Card>
                </Grid>
            )
        })
    }

    if (assignment) {
        return (
            <>
                <Grid container spacing={6}>
                    <Grid item sm={6}>
                        <Typography variant="h4">{name}</Typography>
                        <Typography variant="subtitle1">{moment(created_at).calendar()}</Typography>
                        <hr></hr>
                        <Typography variant="body1">{description}</Typography>
                    </Grid>
                    <Grid item sm={6}>
                        <div>
                            {!isTeacher && (
                                <>
                                    <Typography variant="h6">Your work</Typography>
                                    <Grid container spacing={4} style={{ marginTop: "10px" }}>
                                        {renderSubmitted()}
                                    </Grid>
                                    <Submission submitted={submitted} submissions={submissions} />
                                </>
                            )}
                            {isTeacher && <ViewAndRunCode />}
                        </div>
                    </Grid>
                </Grid>
            </>
        )
    } else {
        return <CircularProgress style={{ marginLeft: "50%", marginTop: "50px" }} />
    }
}

export default Assignment;