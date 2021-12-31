import BadWordsFilter from 'bad-words';
import { stripHtml } from '../../utils/item';

const checkBadWrods = (documents) => {
  const strings = documents?.filter(Boolean).map((entry) => stripHtml(entry));
  const badWordsFilter = new BadWordsFilter();
  for (const index in strings) {
    if (badWordsFilter.isProfane(strings[index])) {
      return true;
    }
  }
  return false;
};

export default checkBadWrods;
