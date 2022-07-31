import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from '@apollo/client';
import { GET_RIDER_DETAILS } from '../queries/GET_RIDER_DETAILS';
import { GET_DRIVER_DETAILS } from '../queries/GET_DRIVER_DETAILS';
import { Grid, Box, Typography, Button, Chip, Avatar, Divider } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from "react-router-dom";
import { RatingCards } from '../components/RatingCards';
// import Button from '@material-ui/core/Button';
import RatingDialog from '../components/RatingDialog';
import { UPDATE_RIDER_RIDES } from '../queries/UPDATE_RIDER_RIDES';
import { UPDATE_DRIVER_RATINGS } from '../queries/UPDATE_DRIVER_RATINGS';
import { useNavigate } from 'react-router-dom';
import { UPDATE_RIDER_RATINGS } from '../queries/UPDATE_RIDER_RATINGS';
import { UPDATE_DRIVER_RIDES } from '../queries/UPDATE_DRIVER_RIDES';
import { sendErrorToSentry } from "../index.js";
import StarsRoundedIcon from '@material-ui/icons/StarsRounded';
import CallIcon from '@material-ui/icons/Call';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import { deepPurple } from '@material-ui/core/colors';
import LocationOnIcon from '@material-ui/icons/LocationOn';
const useStyles = makeStyles((theme) => ({
    endbutton: {
        backgroundColor: '#8c96e5',
        marginBottom: '10px',
        width: 'fix-content',
    },
    logbutton: {
        backgroundColor: '#ec8e8e',
        marginBottom: '10px',
    },
    profile: {
        backgroundColor: '#b7ffc4',
        paddingLeft: '70px',
        justifyContent: 'center',
        textAlign: '-webkit-center',
    },
    star: {
        color: 'green',
        justifyContent: 'center',
        // alignItems: 'center',
        marginTop: '16px'
    },
    flex: {
        display: 'flex',
    },
    flexItems: {
        display: 'flex',
        margin: '10px',
        justifyContent: 'flex-start',

    },
    name: {
        fontSize: '25px',
        // fontFamily: 'Roboto',
        alignItems: 'center',
    },
    margin: {
        marginTop: '35px',
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
        margin: '10px',
        height: '80px',
        width: '80px',
    },
    border: {
        marginTop: '30px',
    },
    icon: {
        marginRight: '15px',
    },
    rating: {
        color: '#efa300 !important',
    },
    label: {
        fontWeight: 600,
    },
    cardDeck: { margin: "2rem 0rem 2rem 5rem !important" },
}));

export const RiderProfile = () => {
    const loginType = localStorage.getItem('loginType');
    const navigate = useNavigate();
    if (!loginType) navigate('/login')
    const isRider = loginType === 'rider';
    const classes = useStyles();
    const { loading: rloading, error: rerror, data: rdata } = useQuery(GET_RIDER_DETAILS);
    const { loading: dloading, error: derror, data: ddata } = useQuery(GET_DRIVER_DETAILS);
    if (rerror) {
        sendErrorToSentry({
            name: "rider details",
            message: "Fetching connection failed",
            extra: [{ type: "errorEncounter", rerror }],
        });
    }
    if (derror) {
        sendErrorToSentry({
            name: "driver details",
            message: "Fetching connection failed",
            extra: [{ type: "errorEncounter", derror }],
        });
    }
    const isloading = isRider ? rloading : dloading;
    const [updateRiderRides,{loading}] = useMutation(UPDATE_RIDER_RIDES,{
        onError: (error) => {
            sendErrorToSentry({
                name: "UPDATE_RIDER_RIDES",
                message: "updation failed",
                extra: [{ type: "errorEncounter", error }],
            });
        }
    });
    const [updateDriverRating] = useMutation(UPDATE_DRIVER_RATINGS,{
        onError: (error) => {
            sendErrorToSentry({
                name: "UPDATE_DRIVER_RATINGS",
                message: "updation failed",
                extra: [{ type: "errorEncounter", error }],
            });
        }
    });
    const [updateRiderRatings] = useMutation(UPDATE_RIDER_RATINGS,{
        onError: (error) => {
            sendErrorToSentry({
                name: "UPDATE_RIDER_RATINGS",
                message: "updation failed",
                extra: [{ type: "errorEncounter", error }],
            });
        }
    });
    const [updateDriverRides] = useMutation(UPDATE_DRIVER_RIDES,{
        onError: (error) => {
            sendErrorToSentry({
                name: "UPDATE_DRIVER_RIDES",
                message: "updation failed",
                extra: [{ type: "errorEncounter", error }],
            });
        }
    });

    const [open, setOpen] = React.useState(false);
    const [driveopen, setDriveOpen] = React.useState(true);

    const { id } = useParams();

    const updateRiderCache = (cache, { data }) => {
        const currentValue = cache.readQuery({
            query: GET_RIDER_DETAILS,
        });
        const updatedData = data;
        cache.writeQuery({
            query: GET_RIDER_DETAILS,
            data: { uberrider: [updatedData, ...currentValue.uberrider] },
        });
    };
    const updateDriverCache = (cache, { data }) => {
        const currentValue = cache.readQuery({
            query: GET_DRIVER_DETAILS,
        });
        const updatedData = data;
        cache.writeQuery({
            query: GET_DRIVER_DETAILS,
            data: { uberdriver: [updatedData, ...currentValue.uberdriver] },
        });
    };

    const Userdata = isRider ? rdata?.uberrider.find((e) => e.id === id)
        : ddata?.uberdriver.find((e) => e.id === id);
    let allRides = Userdata?.rides ? JSON.parse(Userdata?.rides) : [];
    let pickRide = (() => {
        const Count = isRider ? ddata?.uberdriver?.length : '';
        return isRider ? ddata?.uberdriver?.[Math.floor(Math.random() * (Count))] : rdata?.uberrider.find((e) => e.id === Userdata?.lastride);
    })();

    const handleClickOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        window.addEventListener('popstate', (event) => {
            localStorage.clear();
            navigate('/login');
        });
        if (pickRide && loginType === 'driver') {
            setDriveOpen(true);
        }
    }, [])

    if (isloading) return <h1>loading....</h1>
    if (!Userdata) return <h1>Page not found 404</h1>;

    const handleClose = (value) => {
        setOpen(false)
        setDriveOpen(false);
        const index = allRides.findIndex(object => {
            return object.id === pickRide?.id;
        });
        const finaljson = (() => {
            if (index < 0) { allRides.push({ id: pickRide?.id, name: pickRide?.name, rating: value, entry: 1, rides: 1 }); return allRides }
            else return allRides.map((obj, ind) => {
                if (ind === index) {
                    return { ...obj, rating: obj.rating + value, entry: obj.entry + 1, rides: obj.rides + 1 };
                }
                return obj
            })
        })();
        if (loginType === 'rider') {
            updateDriverRating({
                variables: {
                    id: pickRide?.id,
                    trips: pickRide?.trips + 1,
                    entry: pickRide?.entry + 1,
                    rating: pickRide?.rating + value,
                    lastride: id,
                },
                update: updateDriverCache
            })

            updateRiderRides({
                variables: {
                    id: id,
                    trips: Userdata?.trips + 1,
                    rides: JSON.stringify(finaljson),
                },
                update: updateRiderCache
            })
        }
        else {
            updateRiderRatings({
                variables: {
                    id: pickRide?.id,
                    trips: pickRide?.trips,
                    entry: pickRide?.entry + 1,
                    rating: pickRide?.rating + value,
                },
                update: updateRiderCache
            })

            updateDriverRides({
                variables: {
                    id: id,
                    trips: Userdata?.trips,
                    rides: JSON.stringify(finaljson),
                    lastride: '',
                },
                update: updateDriverCache
            })
        }
    };
    function vehical(vehical) {
        switch (vehical) {
            case 'car':
                return <img src="/car.png" style={{ width: '150px', height: '110px', marginBottom: '-25px' }} alt="Car" />
            case 'auto':
                return <img src="/auto.png" style={{ width: '120px', height: '100px', marginBottom: '-25px' }} alt="Auto" />
            case 'bike':
                return <img src="/bike.png" style={{ width: '120px', height: '80px', marginTop: '15px', marginBottom: '-15px' }} alt="Bike" />
            default:
                return <img src="/car.png" style={{ width: '150px', height: '110px', marginBottom: '-25px' }} alt="Car" />
        }
    }

    const profileRating = Userdata?.entry ? Userdata?.rating / Userdata?.entry : Userdata?.rating;
    return <div>
        <Box sx={{ width: '100%' }}>
            <h1>Uber Rating</h1>
            <Grid container spacing={2}>
                <Grid className={classes.profile} item xs={2}>
                    <div>
                        <h1>{isRider ? 'Rider' : 'Driver'} profile</h1>
                        <Avatar className={classes.purple} />
                        <Typography className={classes.name}>{Userdata?.name}</Typography>
                        <Chip classes={{ label: classes.label }} label={(Math.round(profileRating * 10) / 10)} avatar={<StarsRoundedIcon className={classes.rating} />} />
                        <Divider className={classes.border} />
                        {!isRider ? <Typography>{vehical(Userdata?.vehical)}</Typography> : ''}
                        <div>
                            <div className={classes.margin}>
                                <div className={classes.flexItems}> <LocationOnIcon className={classes.icon} /><Typography> India</Typography></div>
                                <div className={classes.flexItems}><CallIcon className={classes.icon} /><Typography> {Userdata?.contact}</Typography></div>
                                <div className={classes.flexItems}><LocalTaxiIcon className={classes.icon} /><Typography> {Userdata?.trips}</Typography></div>
                            </div>
                        </div>
                        {isRider ? <Button className={classes.endbutton} disabled={loading} onClick={handleClickOpen}>End Ride{loading?<CircularProgress/>:''}</Button> : ''} <br />
                        <Button className={classes.logbutton} onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</Button>
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <div className={classes.cardDeck}>
                        <Grid container spacing={3}>
                            {allRides.length > 0 ?
                                (allRides.map((rides, index) => (
                                    <Grid item key={index}>
                                        <RatingCards rides={rides} />
                                    </Grid>
                                ))) : isRider ? <h1>No Rides to show, Click on End ride</h1> : <h1>you havent made any trips</h1>}

                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </Box>
        {open && <RatingDialog open={open} pickRide={pickRide} type={loginType} onClose={handleClose} />}
        {driveopen && Userdata?.lastride?.length > 1 && pickRide && <RatingDialog open={driveopen} pickRide={pickRide} type={loginType} onClose={handleClose} />}
    </div>
}