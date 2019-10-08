import React, { useState, useEffect } from "react";

// Redux Store
import { connect } from 'react-redux';
import { addMovie } from '../actions/movies.js';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';

import AsyncSelect from 'react-select/async';
import { throttle } from 'lodash';
import config from '../config.js';

const mapOptionsToValues = options => {
  return options.map(option => ({
    value: option.id,
    label: option.title + " - " + option.release_date.split('-')[0]
  }));
};

const AddMovieDialogs = ({ handleOpenDialogSearchMovie, openDialogSearchMovie, dispatch }) => {
  const [hasError, setErrors] = useState('');
  const [movieId, setMovieId] = useState();
  const [selectedMovie, setSelectedMovie] = useState('');
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format());

  const getOptions = (inputValue, callback) => {

    if (!inputValue) {
      return callback([]);
    }
    setTimeout(() => {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${config.api.moviedb}&language=en-US&query=${inputValue}&page=1&include_adult=false`).then(response => {
        response.json().then(data => {
          if (data.results.length > 0) {
            callback(mapOptionsToValues(data.results));
            setErrors('');
          } else {
            setErrors('No results');
          }
        }).catch(err => {
          setErrors('Can\'t load database');
        });
      });
    }, 1000);
  }

  const getOptionsThrottled = throttle(getOptions, 1000);

  useEffect(() => {
    if (movieId) {
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${config.api.moviedb}&language=en-US`).then(response => {
        response.json().then(data => {
          if (data) {
            setSelectedMovie(data);
            setErrors('');
          } else {
            setErrors('No results');
          }
        }).catch(err => {
          setErrors('Can\'t load database');
        });
      });
    }
  }, [movieId]);

  useEffect(() => {
    if (selectedMovie){
      setOpenPreviewModal(true);
      handleOpenDialogSearchMovie(false);
    }    
  }, [selectedMovie]);

  const handleOpenPreviewModal = (status) => {
    setOpenPreviewModal(status);
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddMovie = () => {
    dispatch(addMovie({
      title: selectedMovie.title, 
      year: selectedMovie.release_date.split('-')[0],
      poster: 'https://image.tmdb.org/t/p/w500/' + selectedMovie.poster_path,
      datetime: selectedDate.format('YYYY-MM-DD HH:mm:ss'),
      duration: selectedMovie.runtime
    })
    );
    setOpenPreviewModal(false);
  };

  return (
    <>
      <Dialog open={openDialogSearchMovie} onClose={() => handleOpenDialogSearchMovie(false)} aria-labelledby="form-dialog-title" maxWidth="lg" className="event-add-search">
        <DialogTitle id="form-dialog-title">Search in Movie Database</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {hasError && <span>{JSON.stringify(hasError)}</span>}
            <AsyncSelect
              maxMenuHeight="200px"
              autoFocus
              cacheOptions
              defaultOptions
              onChange={(q) => setMovieId(q.value)}
              loadOptions={getOptionsThrottled}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => handleOpenDialogSearchMovie(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPreviewModal} className="event-add-preview" onClose={() => handleOpenPreviewModal(false)} aria-labelledby="form-dialog-title" maxWidth="md">
        <Grid container>
          <Grid item xs={4}>
            {selectedMovie.poster_path && <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} width="100%" />}
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" flexDirection="column" height="100%">
              <DialogTitle id="form-dialog-title">{selectedMovie.title}</DialogTitle>
              <DialogContent dividers>
                <DialogContentText>
                  {selectedMovie.overview} 
                </DialogContentText>
                <DialogContentText>
                  Duration: {selectedMovie.runtime} minutes
                </DialogContentText>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DateTimePicker
                    variant="inline"
                    label="Date and Time"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleOpenPreviewModal(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleAddMovie} color="primary">
                  Add Movie
                </Button>
              </DialogActions>
            </Box>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )}

const mapStateToProps = (state, props) => {
  return {
    movies: state.movies
  };
}

export default connect(mapStateToProps)(AddMovieDialogs);