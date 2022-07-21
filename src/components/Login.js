import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_DRIVER_AUTH } from '../queries/GET_DRIVER_AUTH';
import { GET_RIDER_AUTH } from '../queries/GET_RIDER_AUTH';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit">
                Uber Rides
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
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [type, setType] = useState('rider');
    const [password, setPassword] = useState('');
    const [trigger, setTrigger] = useState(true);
    // const [valid, setValid] = useState(false);
    const navigate = useNavigate();
    // const query = type === 'driver' ? GET_DRIVER_AUTH : GET_RIDER_AUTH
    // const { loading, error, data } = useQuery(type === 'driver' ? GET_DRIVER_AUTH : GET_RIDER_AUTH);
    // console.log(data)
    // if(error)  Sentry.captureException(error);
    // console.log(data)
    // let variables = {};
    const handleSubmit = (event) => {
        event.preventDefault();
        getLoginDetails({
            variables: {
                name: name,
                password: password
            }
        })
    }
    // useEffect(() => {
    //     setName('');
    //     setPassword('');
    //     setTrigger(false);
    // }, [type])
    const [getLoginDetails, { loading, error }] = useLazyQuery(
        type === 'driver' ? GET_DRIVER_AUTH : GET_RIDER_AUTH, {
        // fetchPolicy: "network-only",
        onCompleted: (data) => {
            const userDetails = type === 'driver' ? data?.uberdriver : data?.uberrider;
            console.log(userDetails?.length)
            if (!userDetails?.length) alert("invalid username or password");

            let UserExist = ''
            if (Array.isArray(userDetails) && userDetails.length > 0) {
                UserExist = userDetails[0].id
            }
            console.log({ userDetails, data })
            if (userDetails?.length) {
                localStorage.setItem('loginType', type);
                navigate(`/${type}/${UserExist}`);
            }
        }
    }
    )

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                {/* <form className={classes.form} onSubmit={handleSubmit}> */}
                <TextField variant="outlined"
                    required
                    fullWidth
                    name="type"
                    autoComplete="type"
                    id="type"
                    label="Signin as"
                    value={type}
                    onChange={(e) => setType(e.target.value)} select>
                    <MenuItem value="rider">Rider</MenuItem>
                    <MenuItem value="driver">Driver</MenuItem>
                </TextField>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e) => handleSubmit(e)}
                >
                    Sign In {loading ? 'loading...' : ''}
                </Button>
                <Grid container>
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
                {/* </form> */}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}