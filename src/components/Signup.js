import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
// import { Navigate,  } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from '@apollo/client';
import Container from '@material-ui/core/Container';
import { INSERT_DRIVER } from '../queries/INSERT_DRIVER';
import { INSERT_RIDER } from '../queries/INSERT_RIDERS';
import * as Sentry from '@sentry/react';
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Uber rides
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const [type, setType] = useState('rider');
    const [vehical, setVehical] = useState('car');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const navigate = useNavigate();
    // console.log(type)
    function handleSubmit(event) {
        event.preventDefault();
        if (type === 'driver') {
            adddriverdetails({ variables: drivervariables });
        }
        else if (type === 'rider') {
            addriderdetails({ variables: ridervariables })
        }
        // navigate('/login');
    }

    const [adddriverdetails] = useMutation(INSERT_DRIVER, {
        onCompleted: (data) => {
            // console.log(data);
            { data && navigate('/login'); }
        },
        onError: (err) => {
            // console.log(err);
            Sentry.captureException(err);
            alert(err);
        },
    });
    const [addriderdetails] = useMutation(INSERT_RIDER, {
        onCompleted: (data) => {
            // console.log(data);
            { data && navigate('/login'); }
        },
        onError: (err) => {
            Sentry.captureException(err);
            alert(err);
        },
    });

    const drivervariables = {
        name: name,
        contact: contact,
        password: password,
        vehical: vehical,
    };
    const ridervariables = {
        name: name,
        contact: contact,
        password: password,
    };
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="contact"
                                label="Contact"
                                name="contact"
                                autoComplete="contact"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="outlined"
                                required
                                fullWidth
                                name="type"
                                autoComplete="type"
                                id="type"
                                label="Signup as"
                                value={type}
                                onChange={(e) => setType(e.target.value)} select>
                                <MenuItem value="rider">Rider</MenuItem>
                                <MenuItem value="driver">Driver</MenuItem>
                            </TextField>
                        </Grid>
                        {type === 'driver' && <Grid item xs={12}>
                            <TextField variant="outlined"
                                required
                                fullWidth
                                name="vehical"
                                autoComplete="vehical"
                                id="vehical"
                                label="Vehical"
                                value={vehical}
                                onChange={(e) => setVehical(e.target.value)} select>
                                <MenuItem value="auto">Auto</MenuItem>
                                <MenuItem value="car">Car</MenuItem>
                                <MenuItem value="bike">Bike</MenuItem>
                            </TextField>
                        </Grid>}
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}