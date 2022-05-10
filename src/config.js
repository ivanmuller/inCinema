export default {
  'appTitle': 'The Classic Cinema',
  'dateIntervalrefresh': 6000,
  'rooms': ['1','2','3','Main','kids'],
  'types': ['Imax 3D', 'Classic', '4D'],
  'enableFirebase': false,
  'yearsMin': 1950,
  'api': {
    'moviedb': process.env.MOVIEDB_KEY,
  },
  'poster': {
    'urlBase': 'https://image.tmdb.org/t/p/w500',
    'placeholder': 'https://placeimg.com/640/960/nature/grayscale'
  },
  'errors': {
    'deploy': 'Error Updating Items',
    'noResults': 'No results',
    'cantLoadDatabase': 'Can\'t load database'
  },
  'optionsAdd': ['Add movie from Database', 'Add movie Manually'],
  'seatsWarningThresold': 10,
  'loginTimeout': 2000
}