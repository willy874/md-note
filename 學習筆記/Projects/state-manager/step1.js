
const createStore = (initialState, reducer) => {
  let state = initialState;
  const listeners = [];
  const getState = () => state;
  const dispatch = (payload) => {
    state = reducer(state, payload);
    listeners.forEach(listener => listener());
  };
  const subscribe = listener => listeners.push(listener);
  const unsubscribe = listener => listeners.filter(l => l !== listener);
  return { getState, dispatch, subscribe, unsubscribe };
}

const store = createStore({ count: 0 }, (state, payload) => state.count + payload);


// React Hook
const useReactStore = () => {
  const [state, setState] = useState(store.getState());
  useEffect(() => {
    const onChange = () => {
      setState(store.getState());
    }
    store.subscribe(onChange);
    return () => store.unsubscribe(onChange);
  }, [state]);
  const dispatch = (payload) => store.dispatch(state, payload);
  return [state, dispatch];
}

// Vue Composable
const useVueStore = () => {
  const state = ref(store.getState());
  const dispatch = (payload) => store.dispatch(state.value, payload);
  const onChange = () => {
    state.value = store.getState();
  }
  onMounted(() => store.subscribe(onChange));
  onUnmounted(() => unsubscribe(onChange));
  return [state, dispatch];
}

