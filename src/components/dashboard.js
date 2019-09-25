import React from 'react';

import config from '../config';

// Redux Store
import { connect } from 'react-redux';
import { addMovie, editAllMovies } from '../actions/movies.js';

// My components
import Movie from './movie';

// Third Party
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { Flipper, Flipped } from 'react-flip-toolkit'

// Third party styles
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';

import Planets from './planets';

class Dashboard extends React.Component {
  state = {
    isPaneOpen: false,
    showExampleModal: false
  };
  componentDidMount() {
    Modal.setAppElement('#main');
  };
  onEditHandle = (r) => {
    if (!r.error) {
      this.props.dispatch(editAllMovies(r.jsObject));
    }
  };
  handleOpenModal = () => {
    this.setState({ showExampleModal: true });
  };
  handleCloseModal = () => {
    this.setState({ showExampleModal: false });
  };
  handleAddMovie = () => {
    this.props.dispatch(addMovie());
  };
  render() {
    return (
      <div id="main">
        <Planets />
        <MuiThemeProvider theme={theme}>

          <Container>
            <SlidingPane
              className="custom-sliding-pane"
              isOpen={this.state.isPaneOpen}
              title="Edit in Advanced Mode"
              onRequestClose={() => {
                this.setState({ isPaneOpen: false });
              }}>
              <JSONInput
                id="advEditor"
                placeholder={this.props.movies}
                locale={locale}
                onChange={this.onEditHandle}
                width="100%"
                height="100%"
              />
            </SlidingPane>
            <Box textAlign="center"><h1>{config.appTitle}</h1></Box>
            <Grid container>
              <Flipper flipKey={this.props.movies.join('')}>
                {this.props.movies.map((movie, index) => <Flipped key={index} flipId={index}><Movie {...movie} index={index} /></Flipped>)}
              </Flipper>
            </Grid>
          </Container>

          <AppBar className="appBar" position="fixed" color="default">
            <Container>
              <Toolbar disableGutters={true}>
                <Grid container alignItems="flex-start" justify="flex-end" direction="row">
                  <Button variant="contained" onClick={this.handleAddMovie}>Add Movie</Button>
                  <Button style={{ 'marginLeft': '1em' }} variant="contained" onClick={() => this.setState({ isPaneOpen: !this.state.isPaneOpen })}>Advanced Edition <Icon style={{ 'marginLeft': '5px' }}>code</Icon></Button>
                  <Button style={{ 'marginLeft': '1em' }} color="primary" variant="contained">Deploy <Icon style={{ 'marginLeft': '5px' }}>screen_share</Icon></Button>
                </Grid>
              </Toolbar>
            </Container>
          </AppBar>          
        </MuiThemeProvider>
      </div>
    )
  }
};

const orderedMovies = (movies) => {
    return movies.sort((a, b) => {
        return a.datetime < b.datetime ? -1 : 1;
    });
};

const mapStateToProps = (state) => {
  //console.log(orderedMovies(state.movies));
  return {
    movies: orderedMovies(state.movies)
  }
}

//HOC
export default connect(mapStateToProps)(Dashboard);