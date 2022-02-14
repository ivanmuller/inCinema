export const isAdminPage = () => {
  if (window.location.href.includes('admin')) {
    return true
  }else{
    return false
  }
}

export const prepareDataToSave = (mapper, itemsToRemove) => {
  let dataToSave = {};
  mapper.forEach(({ id, ...event }) => {
    dataToSave[id] = event;
  });
  itemsToRemove.forEach((id) => {
    dataToSave[id] = null;
  });
  return dataToSave;
}

export const oderEvents = (events) => {
  return events.sort((a, b) => {
    return a.datetime < b.datetime ? -1 : 1;
  });
};

export const mapOptionsToValues = options => {
  return options.map(option => ({
    value: option.id,
    label: option.title + " - " + option.release_date.split('-')[0]
  }));
};
