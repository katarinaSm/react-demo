import { useContext } from 'react';
import { MobXProviderContext } from 'mobx-react';

const useStore = () => useContext(MobXProviderContext).rootStore;

export default useStore;
