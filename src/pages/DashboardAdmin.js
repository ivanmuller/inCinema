import React, { useState } from 'react';
import { oderEvents } from '@root/utils/utils';

import { connect } from 'react-redux';

import Event from '@root/components/Event';
import AdminBar from '@root/components/AdminBar';

import EventAdd from '@root/components/EventAdd';

import FlipMove from 'react-flip-move';
import Sidebar from '@root/components/Sidebar';


const DashboardAdmin = (props) => {
  const [isOpenDialogSearchEvent, setOpenDialogSearch] = useState(false);
  const [queueToDelete, setQueueToDelete] = useState([]);
  const [isSidebarOpen, setSidebarOpened] = useState(false);

  const handleOpenDialogSearchEvent = (status) => {
    setOpenDialogSearch(status);
  };

  const handleQueueToDelete = (id) => {
    setQueueToDelete([...queueToDelete,id]);
  };

  const handleSidebarOpen = (status) => {
    setSidebarOpened(status);
  };

  return (
    <>
      <div id="main" className={"admin " + (isSidebarOpen && 'sidebar-opened')}>
    
        <div className="events-list">
          <FlipMove leaveAnimation="none">
            {props.events.map((event, index) => (
              <div key={event.id}><Event key={index} {...event} index={index} handleQueueToDelete={handleQueueToDelete}/></div>
            ))}
          </FlipMove>
        </div>

        <AdminBar 
          isSidebarOpen={isSidebarOpen} 
          handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} 
          queueToDelete={queueToDelete}
          handleSidebarOpen={handleSidebarOpen}
          />

        {/* modal */}
        <EventAdd handleOpenDialogSearchEvent={handleOpenDialogSearchEvent} isOpenDialogSearchEvent={isOpenDialogSearchEvent} />

      </div>
      <Sidebar isSidebarOpen={isSidebarOpen} handleSidebarOpen={handleSidebarOpen}/>
    </>
  )
};

const mapStateToProps = (state) => {
  return {
    events: oderEvents(state.events)
  }
}

//HOC
export default connect(mapStateToProps)(DashboardAdmin);