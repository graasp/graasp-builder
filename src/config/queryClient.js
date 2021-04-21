import { QueryClient } from 'react-query';
import configureMutations from '../mutations';

// Create a client
const queryClient = new QueryClient();

configureMutations(queryClient);

export default queryClient;
