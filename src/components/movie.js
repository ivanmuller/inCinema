import React from 'react';
import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { editMovie, removeMovie } from '../actions/movies.js';

import Icon from '@material-ui/core/Icon';
import Card from '@material-ui/core/Card';

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
        movieTimeDifference: `<span>Finished</span> ${humanDiff} ago`,
        playing: false,
        finished: true
      });
    } else if(movieTime.isBefore(now)) {//already started movie
      //console.log(moment.utc(now.diff(movieTime)).format("HH:mm:ss"));
      this.setState({
        movieTimeDifference: `
          <span>Started</span> ${humanDiff} ago
        `,
        playing: true,
        finished: false
      });
    }else {//not started movie
      this.setState({
        movieTimeDifference: `<span>Starts in</span> ${humanDiff}`,
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
    const { id, datetime} = this.props;
    return (
      <Card className={['event-item', this.state.finished && 'finished', this.state.playing && 'playing'].join(" ")}>

        <MoviePoster id={id} />
        <MovieTitle id={id} processed={{ ...this.state }} />

        <div className="event-item-section event-time">
          <a href="#" onClick={(e) => this.setDatePickerOpen(e, true)} dangerouslySetInnerHTML={{ __html: this.state.movieTimeDifference }}></a><br />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              className="hide"
              variant="inline"
              ampm={true}
              open={this.state.pickerIsOpen}
              onOpen={(e) => this.setDatePickerOpen(e, true)}
              onClose={(e) => this.setDatePickerOpen(e, false)}
              value={datetime}
              onChange={this.handleDateChange} />
          </MuiPickersUtilsProvider>
        </div>

        <MovieSeats id={id} processed={{ ...this.state }} />
        <MovieRoom id={id} />
        <div className="event-actions"><a href="/#" onClick={this.handleRemoveMovie}><Icon>cancel_presentation</Icon></a></div>
      </Card>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    movie: state.movies.find((movie) => movie.id === props.id)
  };
}

export default connect(mapStateToProps)(Movie);
