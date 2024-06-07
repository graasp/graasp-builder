import { Breakpoint } from '@mui/material';

export type SomeBreakPoints<T> = Partial<Record<Breakpoint, T>>;
