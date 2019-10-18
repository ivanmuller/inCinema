import React from 'react';

// Redux Store
import { connect } from 'react-redux';

// Components
import Event from './Event';

// Third party
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import FlipMove from 'react-flip-move';

const oderEvents = (events) => {
  return events.sort((a, b) => {
    return a.datetime < b.datetime ? -1 : 1;
  });
};

const DashboardPublic = (props) => {

  return (
    <div id="main">
      <MuiThemeProvider theme={theme}>
        <div className="events-list">
          <FlipMove leaveAnimation="none">
            {props.events.map((event, index) => (
              <div key={event.id}><Event key={index} {...event} index={index} /></div>
            ))}
          </FlipMove>
        </div>
      </MuiThemeProvider>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    events: oderEvents(state.events)
  }
}

//HOC
export default connect(mapStateToProps)(DashboardPublic);