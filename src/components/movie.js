import React from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editMovie, removeMovie } from '../actions/movies.js';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import MoviePoster from './movie-poster';
import MovieTitle from './movie-title';
import MovieSeats from './movie-seats';
import MovieRoom from './movie-room';

import moment from 'moment';
import {DateTimePicker,  MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';

class Movie extends React.Component {
  state = {
    movieTimeDifference: "",
    playing: false,
    finished: false,
    pickerIsOpen: false
  };
  handleDateChange = (date) => {
    this.props.dispatch(editMovie(this.props.id,{'datetime': date.format('YYYY-MM-DD HH:mm:ss')}));
  };
  handleRemoveMovie = (e) => {
    this.props.dispatch(removeMovie({id: this.props.id}));
    e.preventDefault();
  };
  setDatePickerOpen = (e, status) => {
    this.setState({ pickerIsOpen: status });
    if(e){e.preventDefault()}
  };
  handleDate = () => {
    const now = moment();
    const movieTime = moment(this.props.datetime);
    const humanDiff = moment(movieTime).fromNow(true);
    const movieTimeFinished = moment(this.props.datetime).add(this.props.duration, 'm');
    if (now.isAfter(movieTimeFinished)) { //Finished Movie
      //console.log(moment.utc(movieTime.diff(now)).format("HH:mm:ss"));
      const humanDiff = moment(movieTimeFinished).fromNow(true);
      this.setState({
        movieTimeDifference: `Finished ${humanDiff} ago`,
        playing: false,
        finished: true
      });
    } else if(movieTime.isBefore(now)) {//already started movie
      //console.log(moment.utc(now.diff(movieTime)).format("HH:mm:ss"));
      this.setState({
        movieTimeDifference: `Started ${humanDiff} ago`,
        playing: true,
        finished: false
      });
    }else {//not started movie
      this.setState({
        movieTimeDifference: `Starts in ${humanDiff}`,
        playing: false,
        finished: false
      });
    }
  };
  componentDidMount() {
    this.handleDate();
    this.interval = setInterval(() => {
      this.handleDate();
    }, config.dateIntervalrefresh);
  };
  componentWillUnmount() {
    clearInterval(this.interval);
  };
  componentDidUpdate(prevPros){
    if (prevPros.datetime !== this.props.datetime || prevPros.duration !== this.props.duration){
      this.handleDate();
    }
  };  
  render() {
    const { id, poster, datetime} = this.props;
    return (
      <Grid item xs={12} className={[this.state.finished && 'finished', this.state.playing && 'playing'].join(" ")}>
        <Grid container spacing={2}>
          <Grid item xs={1}><MoviePoster id={id}/></Grid>
          <Grid item xs={4}>
            <MovieTitle id={id} processed={{...this.state}} />
          </Grid>
          <Grid item xs={3}>
            <a href="#" onClick={(e) => this.setDatePickerOpen(e,true)}>{this.state.movieTimeDifference}</a><br />
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimePicker 
                className="hide"
                variant="inline" 
                ampm={true}
                open={this.state.pickerIsOpen} 
                onOpen={(e) => this.setDatePickerOpen(e,true)} 
                onClose={(e) => this.setDatePickerOpen(e,false)}
                value={datetime} 
                onChange={this.handleDateChange} />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={2}><MovieSeats id={id} processed={{ ...this.state }}/></Grid>
          <Grid item xs={1}><MovieRoom id={id}/></Grid>
          <Grid item xs={1}><a href="/#" onClick={this.handleRemoveMovie}>Remove</a></Grid>
        </Grid>
        <Divider />
      </Grid>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    movie: state.movies.find((movie) => movie.id === props.id)
  };
}

export default connect(mapStateToProps)(Movie);
