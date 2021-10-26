import classes from '*.module.sass';
import React, { useEffect, useState } from 'react';

import firebase from 'firebase';

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
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { red } from '@material-ui/core/colors';
import { useHistory } from 'react-router-dom';

import { apiRequest } from './utils';

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
        backgroundColor: red[500],
    },
}));

function ClassCard(props: any) {
    const { classid, classname, description } = props.class;
    const history = useHistory();
    const classes = useStyles();
    // const [anchorEl, setAnchorEl] = useState(null);

    // const handleClick = (event: any) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    return (
        <Box width="100%">
            <Card>
                <CardActionArea onClick={() => history.push(`/c/${classid}`)}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar} style={{ backgroundColor: '#' + intToRGB(hashCode(classname)) }}>
                                {classname.match(/\b(\w)/g).slice(0, 2).join('')}
                            </Avatar>
                        }
                        // action={
                        //     <>
                        //         <IconButton aria-label="settings">
                        //             <MoreVertIcon onClick={handleClick} />
                        //         </IconButton>
                        //         <Menu
                        //             id="simple-menu"
                        //             anchorEl={anchorEl}
                        //             keepMounted
                        //             open={Boolean(anchorEl)}
                        //             onClose={handleClose}
                        //         >
                        //             <MenuItem onClick={handleClose}>Leave Class</MenuItem>
                        //         </Menu>
                        //     </>
                        // }
                        title={classname}
                    />
                    {description && (
                        <>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {description}
                                </Typography>
                            </CardContent>
                        </>
                    )}
                </CardActionArea>
            </Card >
        </Box>
    );
}

function Classes(props: any) {
    const [classesList, setClassesList] = useState<any[] | undefined>(undefined);
    const { user } = props;

    useEffect(() => {
        apiRequest({
            route: "/classes",
            method: 'GET'
        }).then(data => setClassesList(data));
    }, [])

    const renderClasses = () => {
        if (!classesList) {
            return <CircularProgress style={{ marginLeft: "50%", marginTop: "50px" }} />
        }

        if (classesList.length === 0) {
            return (
                <>
                    <img style={{ height: "200px", width: "200px", borderRadius: "100%", marginLeft: "40%", marginRight: "40%" }} alt="nothing here" src="https://i.imgur.com/joO4I3D.png"></img>
                    <div style={{ textAlign: "center", marginLeft: "38%", marginRight: "auto", marginTop: "25px" }}>
                        <Typography variant="h6">No classes joined</Typography>
                        <p><Typography variant="subtitle1">Join a class and it will show up here.</Typography></p>
                    </div>
                </>
            )
        }

        return classesList.map((data, idx) => {
            return (
                <Grid item sm={4}>
                    <ClassCard key={idx} class={data} />
                </Grid>
            )
        })
    }

    return (
        <Grid container spacing={4}>
            {renderClasses()}
        </Grid>
    )
}

function hashCode(str: any) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i: any) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

export default Classes;