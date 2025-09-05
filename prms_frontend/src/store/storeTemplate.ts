import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface IRoutesStore {}

const useStore = create<IRoutesStore>()((set) => ({}));

export default useStore;

const _ = useStore(useShallow((state) => ({})));
