import React from 'react';

import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const Sidebar = (props) => {
  return (
    <>
      <Drawer
        className="sidebar"
        variant="persistent"
        anchor="right"
        open={props.isSidebarOpen}
      >
        <div className="sidebar-header">
          <IconButton onClick={() => props.handleSidebarOpen(false)}>
            <Icon>keyboard_arrow_left</Icon>
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <ListItem button>
          <ListItemText primary="Log Out" onClick={() => props.dispatch(startLogout())}/>
        </ListItem>
      </Drawer>
    </>
  );
}

const mapStateToProps = (state, props) => {
  return {
    events: state.events
  };
}

export default connect(mapStateToProps)(Sidebar);