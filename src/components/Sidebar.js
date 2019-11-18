import React from 'react';

import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';

import AdvancedEdition from './AdvancedEdition';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
            <Icon>close</Icon>
          </IconButton>
        </div>
        <Divider />
        <List>
          <AdvancedEdition isSidebarOpen={props.isSidebarOpen} />
          <ListItem button disabled>
            <ListItemIcon>
              <Icon>save</Icon>
            </ListItemIcon>
            <ListItemText primary="Load / Save" secondary="Feature coming soon" />
          </ListItem>
        </List>
        <Divider />
        <ListItem button onClick={() => props.dispatch(startLogout())}>
          <ListItemIcon>
            <Icon>exit_to_app</Icon>
          </ListItemIcon>
          <ListItemText primary="Log Out" />
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