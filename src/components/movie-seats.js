import React from 'react';
import Icon from '@material-ui/core/Icon';

// Redux Store
import { connect } from 'react-redux';

function MovieSeats(props) {
  const { finished } = props.processed;
  const { seats } = props.movie;
  const handleSeats = () => {
    switch (true) {
      case (seats === 0 || finished):
        return "Sold";
        break;
      case (seats == 1):
        return `${seats} seat left`;
        break;
      case (seats <= 10):
        return `${seats} seats left`;
        break;
      default:
        return `Seats Available`;
        break;
    }
  };
  const handleSeatsIcons = () => {
    let renderedIcons = [];
    if (seats <= 10) {
      for (let i = 0; i < seats; i++) {
        renderedIcons.push(<Icon key={i} color="error" className="blink-1">event_seat</Icon>);
      }
      return (
        <React.Fragment>{renderedIcons}</React.Fragment>
      )
    }else{
      return (
        <React.Fragment><Icon>event_seat</Icon> {seats}+</React.Fragment>
      )
    }
    
  };
  return (
    <React.Fragment>
      <p>{handleSeats()}</p>
      {(seats > 0 && !finished) && 
        <p>{handleSeatsIcons()}</p>
      }
    </React.Fragment>
  )
}

const mapStateToProps = (state, props) => {
  return {
    movie: state.movies.find((movie) => movie.id === props.id)
  };
}

export default connect(mapStateToProps)(MovieSeats);