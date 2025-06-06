
import { call, put, takeEvery } from 'redux-saga/effects';
import { setTasks, setLoading, setError } from '../slices/taskSlice';

function* fetchTasks() {
  try {
    yield put(setLoading(true));
    const response = yield call([supabase.from('tasks'), 'select'], '*');
    const orderedResponse = yield call([response, 'order'], 'due_date', { ascending: true });
    
    if (orderedResponse.error) throw orderedResponse.error;
    yield put(setTasks(orderedResponse.data || []));
  } catch (error: any) {
    yield put(setError(error.message));
  } finally {
    yield put(setLoading(false));
  }
}

function* taskSaga() {
  yield takeEvery('tasks/fetch', fetchTasks);
}

export default taskSaga;
