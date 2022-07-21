import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        // display: 'flex',
        width: '250px',
        marginBottom: '10px',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'lightgrey',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: '100px',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));
const labels = {
    1: 'Very poor',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
};
export const RatingCards = (props) => {
    const {  rides } = props
    console.log( {rides})
    const classes = useStyles();
    return (
        rides.map((ride, index) =>
        <Card key={index} className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {ride.name ?? 'driver'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Rides: {ride?.rides}
                    </Typography>
                    <Rating name="half-rating-read" value={Math.floor(ride?.rating/ride?.entry)} defaultValue={3} precision={1} readOnly />
                    {ride?.rating !== null ? <Box ml={2}>{labels[Math.floor(ride?.rating/ride?.entry)]}</Box> : <Box ml={2}>{labels[3]}</Box>}

                </CardContent>
            </div>
        </Card>
    )
    );
}
