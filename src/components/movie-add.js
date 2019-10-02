import React, { useState, useEffect } from "react";

// Redux Store
import { connect } from 'react-redux';
import { addMovie } from '../actions/movies.js';

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

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
            setOpenPreviewModal(true);
            handleOpenDialogSearchMovie(false);
          } else {
            setErrors('No results');
          }
        }).catch(err => {
          setErrors('Can\'t load database');
        });
      });
    }
  }, [movieId]);

  const handleOpenPreviewModal = (status) => {
    setOpenPreviewModal(status);
  }

  const handleAddMovie = () => {
    dispatch(addMovie({
      title: selectedMovie.title, 
      year: selectedMovie.release_date.split('-')[0],
      poster: 'https://image.tmdb.org/t/p/w500/' + selectedMovie.poster_path,
      duration: selectedMovie.runtime
    })
    );
    setOpenPreviewModal(false);
  };

  return (
    <>
      <Dialog open={openDialogSearchMovie} onClose={() => handleOpenDialogSearchMovie(false)} aria-labelledby="form-dialog-title" maxWidth="lg" className="search-movie-dialog">
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
          <Button color="primary" onClick={() => handleOpenDialogSearchMovie(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPreviewModal} onClose={() => handleOpenPreviewModal(false)} aria-labelledby="form-dialog-title" maxWidth="md">
        <Grid container>
          <Grid item xs={4}>
            {selectedMovie.poster_path && <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} width="100%" />}
          </Grid>
          <Grid item xs={8}>
            <DialogTitle id="form-dialog-title">{selectedMovie.title}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedMovie.overview} <br />
                Duration: {selectedMovie.runtime}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleOpenPreviewModal(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddMovie} color="primary">
                Add Movie
              </Button>
            </DialogActions>
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