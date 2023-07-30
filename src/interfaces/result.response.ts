export interface ResultResponse<T> {
  result: 'success' | 'failed';
  data: T;
}
