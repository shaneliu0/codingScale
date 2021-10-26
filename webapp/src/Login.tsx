import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessURL: '/#/h',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
}

function Login(props: any) {

    return (
        <>
            <Grid container style={{ marginTop: "33%" }}>
                <Grid item sm={6} style={{ borderRight: "1px solid black" }}>
                    <div style={{ textAlign: 'left', }}>
                        <Typography variant='h3'>Welcome Back!</Typography>
                        <Typography variant='h4'>We're so excited to see you again!</Typography>
                    </div>
                </Grid>
                <Grid item sm={6}>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                </Grid>
            </Grid>
        </>
    )
}

export default Login;