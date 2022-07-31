import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Box, CardMedia, Avatar } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { deepOrange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        // display: 'flex',
        width: '250px',
        marginBottom: '10px',
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#eaecff',
    },
    content: {
        flex: '1 0 auto',
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
    cover: {
        minWidth: '150px',
        maxWidth: '300px',
        // height: 150,
        margin: '20px',
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        // margin: '5px',
        height: '50px',
        width: '50px',
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
    const { rides } = props
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {rides?.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Rides: {rides?.rides}
                    </Typography>
                    <Rating name="half-rating-read" value={Math.floor(rides?.rating / rides?.entry)} defaultValue={3} precision={1} readOnly />
                    {rides?.rating !== null ? <Box ml={2}>{labels[Math.floor(rides?.rating / rides?.entry)]}</Box> : <Box ml={2}>{labels[3]}</Box>}

                </CardContent>
                <CardMedia
                    className={classes.cover}
                ><Avatar alt={rides?.name?.toUpperCase()} src="/broken-image.jpg" className={classes.orange} /></CardMedia>
            </div>
        </Card>
    );
}
