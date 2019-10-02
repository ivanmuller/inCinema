import React, {useState} from 'react';

// Redux Store
import { connect } from 'react-redux';
import { editMovie } from '../actions/movies.js';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const MoviePoster = (props) => {
    const { id, poster } = props.movie;
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
      props.dispatch(editMovie(id, { poster }));
      setOpen(false);
    };
    const handlePreviewChange = (e) => {
      const preview = e.target.value;
      setPreview(preview);
    };
    return (
      <React.Fragment>
        <a onClick={handleClickOpen}>
          <img src={poster ? poster : "https://placeimg.com/640/960/nature/grayscale"} width="100%" />
        </a>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm">
          <Grid container>
            <Grid item xs={4}>
              <img src={preview ? preview : "https://placeimg.com/640/960/nature/grayscale"} width="100%" />
            </Grid>
            <Grid item xs={8}>
              <DialogTitle id="form-dialog-title">Change Image</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please add the url of the image here
              </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Image URL"
                  type="text"
                  fullWidth 
                  onChange={handlePreviewChange}
                  value={preview}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
              </Button>
                <Button onClick={handlePosterChange} color="primary">
                  Modify
              </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </Dialog>
      </React.Fragment>
    )
}

const mapStateToProps = (state, props) => {
  return {
    movie: state.movies.find((movie) => movie.id === props.id)
  };
}

export default connect(mapStateToProps)(MoviePoster);