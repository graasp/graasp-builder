import itemMutations from './item';
import memberMutations from './member';
import tagsMutations from './itemTag';

export default (queryClient) => {
  itemMutations(queryClient);
  memberMutations(queryClient);
  tagsMutations(queryClient);
};
