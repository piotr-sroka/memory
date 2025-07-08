import type { FetchError } from 'ofetch';

export interface StateInterface<T> {
  data: T | null;
  error: FetchError | null;
  pending: boolean;
}
