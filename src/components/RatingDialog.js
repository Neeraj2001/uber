import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
    root: {
        width: 200,
        display: 'flex',
        alignItems: 'center',
        margin: '15px',
        width: '250px',
    },
    content: {
        paddingLeft: '20px',
    }
});
const labels = {
    1: 'Very poor',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
};
 const RatingDialog = (props) => {
    const classes = useStyles();
    const { onClose, pickRide, open, type } = props;
    const [rating, setRating] = useState(3);
    const [hover, setHover] = React.useState(-1);
    const handleListItemClick = (value) => {
        onClose(value);
    };
    return (
        open && <Dialog aria-labelledby="simple-dialog-title" open={open} >
            <DialogTitle id="simple-dialog-title">Rating</DialogTitle>
            <div className={classes.content}>
                <h4>Name: {pickRide?.name}</h4>
               {type === 'rider' && <h4>Trips: {pickRide?.trips}</h4>}
            </div>
            <div className={classes.root}>
                <Rating
                    name="hover-feedback"
                    value={rating}
                    precision={1}
                    defaultValue={5}
                    onChange={(event, newValue) => {
                        setRating(Math.floor(newValue));
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}
                />
                {rating !== null && <Box ml={2}>{labels[hover !== -1 ? hover : rating]}</Box>}
            </div>
            <Button onClick={() => rating ? handleListItemClick(rating): alert("rating required")}>Submit</Button>
        </Dialog>
    );
};

export default RatingDialog;