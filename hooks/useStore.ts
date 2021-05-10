import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';
import Store from '../store/store';

const useStore: () => Store = () => useContext(MobXProviderContext).rootStore;

export default useStore;
