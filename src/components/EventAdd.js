import React, { useState, useEffect } from "react";
import config from '../config';

import { connect } from 'react-redux';
import { addEvent } from '../actions/events';

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

const mapOptionsToValues = options => {
  return options.map(option => ({
    value: option.id,
    label: option.title + " - " + option.release_date.split('-')[0]
  }));
};

const EventAdd = ({ handleOpenDialogSearchEvent, isOpenDialogSearchEvent, dispatch }) => {
  const [hasError, setErrors] = useState('');
  const [eventId, setEventId] = useState();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
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
            setErrors(config.errors.noResults);
          }
        }).catch(err => {
          setErrors(config.errors.cantLoadDatabase);
        });
      });
    }, 1000);
  }

  const getOptionsThrottled = throttle(getOptions, 1000);

  useEffect(() => {
    if (eventId) {
      fetch(`https://api.themoviedb.org/3/movie/${eventId}?api_key=${config.api.moviedb}&language=en-US`).then(response => {
        response.json().then(data => {
          if (data) {
            setSelectedEvent(data);
            setErrors('');
          } else {
            setErrors(config.errors.noResults);
          }
        }).catch(err => {
          setErrors(config.errors.cantLoadDatabase);
        });
      });
    }
  }, [eventId]);

  useEffect(() => {
    if (selectedEvent){
      setOpenPreviewModal(true);
      handleOpenDialogSearchEvent(false);
    }    
  }, [selectedEvent]);

  const handleOpenPreviewModal = (status) => {
    setOpenPreviewModal(status);
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    dispatch(addEvent({
      title: selectedEvent.title, 
      year: selectedEvent.release_date.split('-')[0],
      poster: config.poster.urlBase + selectedEvent.poster_path,
      datetime: selectedDate.format('YYYY-MM-DD HH:mm:ss'),
      duration: selectedEvent.runtime
    })
    );
    setOpenPreviewModal(false);
  };

  return (
    <>
      <Dialog open={isOpenDialogSearchEvent} onClose={() => handleOpenDialogSearchEvent(false)} aria-labelledby="form-dialog-title" maxWidth="lg" className="event-add-search">
        <DialogTitle id="form-dialog-title">Search in Movie Database</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {hasError && <span>{JSON.stringify(hasError)}</span>}
            <AsyncSelect
              maxMenuHeight="200px"
              autoFocus
              cacheOptions
              defaultOptions
              onChange={(q) => setEventId(q.value)}
              loadOptions={getOptionsThrottled}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => handleOpenDialogSearchEvent(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPreviewModal} className="event-add-preview" onClose={() => handleOpenPreviewModal(false)} aria-labelledby="form-dialog-title" maxWidth="md">
        <Grid container>
          <Grid item xs={4}>
            {selectedEvent.poster_path && <img src={`${config.poster.urlBase + selectedEvent.poster_path}`} width="100%" />}
          </Grid>
          <Grid item xs={8}>
            <Box display="flex" flexDirection="column" height="100%">
              <DialogTitle id="form-dialog-title">{selectedEvent.title}</DialogTitle>
              <DialogContent dividers>
                <DialogContentText>
                  {selectedEvent.overview} 
                </DialogContentText>
                <DialogContentText>
                  Duration: {selectedEvent.runtime} minutes
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
                <Button onClick={handleAddEvent} color="primary">
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
    events: state.events
  };
}

export default connect(mapStateToProps)(EventAdd);