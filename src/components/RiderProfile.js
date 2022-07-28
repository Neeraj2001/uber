import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from '@apollo/client';
import { GET_RIDER_DETAILS } from '../queries/GET_RIDER_DETAILS';
import { GET_DRIVER_DETAILS } from '../queries/GET_DRIVER_DETAILS';
import { Grid, Box } from '@material-ui/core';
import { useParams } from "react-router-dom";
import { RatingCards } from '../components/RatingCards';
import Button from '@material-ui/core/Button';
import RatingDialog from '../components/RatingDialog';
import { UPDATE_RIDER_RIDES } from '../queries/UPDATE_RIDER_RIDES';
import StarsRoundedIcon from '@material-ui/icons/StarsRounded';
import { UPDATE_DRIVER_RATINGS } from '../queries/UPDATE_DRIVER_RATINGS';
import { useNavigate } from 'react-router-dom';
import { UPDATE_RIDER_RATINGS } from '../queries/UPDATE_RIDER_RATINGS';
import { UPDATE_DRIVER_RIDES } from '../queries/UPDATE_DRIVER_RIDES';
import { sendErrorToSentry } from "../index.js";
const useStyles = makeStyles(() => ({
    button: {
        backgroundColor: 'blue',
        marginBottom: '10px',
    },
    profile: {
        backgroundColor: 'skyblue',
        paddingLeft: '70px',
    },
    star: {
        color: 'green',
        justifyContent: 'center',
        // alignItems: 'center',
        marginTop: '16px'
    },
    flex: {
        display: 'flex',
    }
}));
export const RiderProfile = () => {
    // console.log(localStorage.getItem('loginType'))
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
    const [updateRiderRides] = useMutation(UPDATE_RIDER_RIDES);
    const [updateDriverRating] = useMutation(UPDATE_DRIVER_RATINGS);
    const [updateRiderRatings] = useMutation(UPDATE_RIDER_RATINGS);
    const [updateDriverRides] = useMutation(UPDATE_DRIVER_RIDES);

    const [open, setOpen] = React.useState(false);
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
    const pickRide = (() => {
        const Count = isRider ? ddata?.uberdriver?.length : rdata?.uberrider?.length;
        return isRider ? ddata?.uberdriver?.[Math.floor(Math.random() * (Count))] : rdata?.uberrider?.[Math.floor(Math.random() * (Count))];
    })();
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        window.addEventListener('popstate', (event) => {
            localStorage.clear();
            navigate('/login');
        });
    }, [])
    if(rloading || dloading) return <h1>loading....</h1>
    if(!Userdata) return <h1>Page not found 404</h1>;
    const handleClose = (value) => {
        setOpen(false)

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
                    trips: pickRide?.trips + 1,
                    entry: pickRide?.entry + 1,
                    rating: pickRide?.rating + value,
                },
                update: updateRiderCache
            })

            updateDriverRides({
                variables: {
                    id: id,
                    trips: Userdata?.trips + 1,
                    rides: JSON.stringify(finaljson),
                },
                update: updateDriverCache
            })
        }
    };
    return <div>
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={2}>
                <Grid className={classes.profile} item xs={4}>
                     <div>
                        <h1>{isRider ? 'Rider' : 'Driver'} profile</h1>        
                        <h3>Name: {Userdata?.name}</h3>
                        {!isRider? <h3><br/>Vehical: {Userdata?.vehical}</h3> : ''}
                        <h3><br/>Contact: {Userdata?.contact}</h3>
                        <div className={classes.flex}>
                            <div><h3>Rating: {Userdata?.entry ? Math.floor(Userdata?.rating / Userdata?.entry) : Userdata?.rating} </h3>
                            </div><div className={classes.star}><StarsRoundedIcon />
                            </div></div>
                        <h3>Rides: {Userdata?.trips}</h3>
                        <Button className={classes.button} disable={isloading} onClick={handleClickOpen}>End Ride</Button> <br />
                        <Button className={classes.button} onClick={() =>{localStorage.clear(); navigate('/login');}}>Logout</Button>
                    </div>
                </Grid>
                <Grid item xs={8}>

                    <RatingCards rides={allRides} />
                </Grid>
            </Grid>
        </Box>
        {open && <RatingDialog open={open} pickRide={pickRide} type={loginType} onClose={handleClose} />}
    </div>
}