import BadWordsFilter from 'bad-words';

const checkBadWrods = (documents) => {
  const badWordsFilter = new BadWordsFilter();
  for (const entry in documents) {
    if (badWordsFilter.isProfane(entry)) return false;
  }
  return true;
};

export default checkBadWrods;
