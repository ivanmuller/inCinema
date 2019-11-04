import React, {useState} from 'react';

// Redux Store
import { connect } from 'react-redux';
import { editEvent } from '../actions/events';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const EventPosterAdmin = ({ playing, dispatch, event: { id, poster}}) => {
    const [open, setOpen] = useState(false);
    const [preview = poster, setPreview] = useState(preview);

    const handleClickOpen = (e) => {
      setOpen(true);
      e.preventDefault();
    };
    const handleClose = () => {
      setOpen(false);
    };
    const handlePosterChange = () => {
      const poster = preview;
      dispatch(editEvent(id, { poster }));
      setOpen(false);
    };
    const handlePreviewChange = (e) => {
      const preview = e.target.value;
      setPreview(preview);
    };
    return (
      <div className="event-item-section event-poster">
        {playing && <Icon className="icon blink-1">play_arrow</Icon>}
        <a onClick={handleClickOpen}>
          <img src={poster ? poster : "https://placeimg.com/640/960/nature/grayscale"} width="100%" />
        </a>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm">
          <Grid container>
            <Grid item xs={4}>
              <img src={preview ? preview : "https://placeimg.com/640/960/nature/grayscale"} width="100%" />
            </Grid>
            <Grid item xs={8}>
              <Box display="flex" flexDirection="column" height="100%">
                <DialogTitle id="form-dialog-title">Change Image</DialogTitle>
                <DialogContent dividers>
                  <DialogContentText>
                    Please add the url of the image here
                </DialogContentText>
                  <TextField
                    autoFocus
                    multiline 
                    margin="dense"
                    rowsMax="4"
                    helperText="Image URL"
                    id="name"
                    type="text"
                    fullWidth 
                    onChange={handlePreviewChange}
                    value={preview}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">Cancel</Button>
                  <Button onClick={handlePosterChange} color="primary">Modify</Button>
                </DialogActions>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    )
}

const EventPosterPublic = ({ playing, event: { poster } }) => (
  <div className="event-item-section event-poster">
    {playing && <Icon className="icon blink-1">play_arrow</Icon>}
    <img src={poster ? poster : "https://placeimg.com/640/960/nature/grayscale"} width="100%" />
  </div>
)

const mapStateToProps = (state, props) => {
  return {
    event: state.events.find((event) => event.id === props.id)
  };
}

export const EventPosterAdminConn = connect(mapStateToProps)(EventPosterAdmin);
export const EventPosterPublicConn = connect(mapStateToProps)(EventPosterPublic);