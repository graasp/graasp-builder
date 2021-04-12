import itemMutations from './item';
import memberMutations from './member';

export default (queryClient) => {
  itemMutations(queryClient);
  memberMutations(queryClient);
};
