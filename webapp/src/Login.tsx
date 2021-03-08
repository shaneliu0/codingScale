import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

import Typography from '@material-ui/core/Typography';

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessURL: '/h',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
}

function Login(props: any) {

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <Typography variant='h3'>Welcome Back!</Typography>
                <Typography variant='h4'>We're so excited to see you again!</Typography>
            </div>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </>
    )
}

export default Login;