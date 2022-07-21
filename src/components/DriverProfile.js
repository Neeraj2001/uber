// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { useMutation, useQuery } from '@apollo/client';
// import { GET_RIDER_DETAILS } from '../queries/GET_RIDER_DETAILS';
// import { GET_DRIVER_DETAILS } from '../queries/GET_DRIVER_DETAILS';
// import { Grid, Box } from '@material-ui/core';
// import { useParams } from "react-router-dom";
// import { RatingCards } from '../components/RatingCards';
// import Button from '@material-ui/core/Button';
// import RatingDialog from '../components/RatingDialog';
// import { UPDATE_RIDER_RATINGS } from '../queries/UPDATE_RIDER_RATINGS';
// import { UPDATE_DRIVER_RIDES } from '../queries/UPDATE_DRIVER_RIDES';
// import StarsRoundedIcon from '@material-ui/icons/StarsRounded';
// import * as Sentry from '@sentry/react';
// import { useNavigate } from 'react-router-dom';
// const useStyles = makeStyles(() => ({
//     button: {
//         backgroundColor: 'blue',
//         marginBottom: '10px',
//     },
//     profile: {
//         backgroundColor: 'skyblue',
//         paddingLeft: '70px',
//     },
//     star: {
//         color: 'green',
//         justifyContent: 'center',
//         // alignItems: 'center',
//         marginTop: '16px'
//     },
//     flex: {
//         display: 'flex',
//     }
// }));
// export const DriverProfile = () => {
//     const classes = useStyles();
//     const { error:rerror, data: rdata } = useQuery(GET_RIDER_DETAILS);
//     const { loading, error:derror, data: ddata } = useQuery(GET_DRIVER_DETAILS);
//     if(rerror) Sentry.captureException(rerror);
//     if(derror) Sentry.captureException(derror);
//     const [updateRiderRatings] = useMutation(UPDATE_RIDER_RATINGS);
//     const [updateDriverRides] = useMutation(UPDATE_DRIVER_RIDES);
//     const [open, setOpen] = React.useState(false);
//     const { driverid } = useParams();
//     const [selectedValue, setSelectedValue] = React.useState(1);
//     const navigate = useNavigate();
//     const updateCache = (cache, { data }) => {
//         const currentValue = cache.readQuery({
//             query: GET_DRIVER_DETAILS,
//         });
//         const updatedData = data;
//         cache.writeQuery({
//             query: GET_DRIVER_DETAILS,
//             data: { driver: [updatedData, ...currentValue.driver] },
//         });
//     };
//     const driverdata = ddata?.driver.find((e) => e.driverid === driverid);
//     let rides = driverdata?.driverrides ? JSON.parse(driverdata?.driverrides) : [];
//     const pickRide = (() => {
//         const riderCount = rdata?.rider?.length;
//         return rdata?.rider?.[Math.floor(Math.random() * (riderCount))];

//     })();
//     const handleClickOpen = () => {
//         setOpen(true)
//     };
//     // throw new Error("cath it");
//     const handleClose = (value) => {
//         setOpen(false)
//         const index = rides.findIndex(object => {
//             return object.id === pickRide?.riderid;
//         });
//         const finaljson = (() => {
//             if (index < 0) { rides.push({ id: pickRide?.riderid, name: pickRide?.ridername, rating: value, rides: 1 }); return rides }
//             else return rides.map((obj, ind) => {
//                 if (ind === index) {
//                     return { ...obj, rating: Math.floor((obj.rating + value) / 2), rides: obj.rides + 1 };
//                 }
//                 return obj
//             })
//         })();
//         updateRiderRatings({
//             variables: {
//                 riderid: pickRide?.riderid,
//                 ridertrips: pickRide?.ridertrips + 1,
//                 riderrating: Math.floor((pickRide?.riderrating + value) / 2),
//             },
//         })

//         updateDriverRides({
//             variables: {
//                 driverid: driverid,
//                 drivertrips: driverdata?.drivertrips + 1 ?? 0,
//                 driverrides: JSON.stringify(finaljson),
//             },
//             update: updateCache
//         })
//         setSelectedValue(0);
//     };
//     return <div>
//         <Box sx={{ width: '100%' }}>
//             <Grid container spacing={2}>
//                 <Grid className={classes.profile} item xs={4}>
//                     {loading ? <p>loading....</p> : <div>
//                         <h1>Driver profile</h1>
//                         <h3>Name: {driverdata?.drivername}</h3>
//                         {/* <h3>Rating: {driverdata?.driverrating}</h3> */}
//                         <div className={classes.flex}>
//                             <div>
//                                 <h3>Rating: {driverdata?.driverrating} </h3>
//                             </div>
//                             <div className={classes.star}><StarsRoundedIcon /></div>
//                         </div>
//                         <h3>Vehical: {driverdata?.drivervehical}</h3>
//                         <h3>Rides: {driverdata?.drivertrips}</h3>
//                         <Button className={classes.button} onClick={handleClickOpen}>End Ride</Button> <br />
//                         <Button className={classes.button} onClick={() => navigate('/login')}>Logout</Button>
//                     </div>}
//                 </Grid>
//                 <Grid item xs={8}>

//                     <RatingCards ddata={ddata} rides={rides} />
//                 </Grid>
//             </Grid>
//         </Box>
//         <RatingDialog open={open} selectedValue={selectedValue} pickRide={pickRide} type='driver' onClose={handleClose} />
//     </div>
// }