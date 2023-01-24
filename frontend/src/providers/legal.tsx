import { createContext, useMemo, useContext, useReducer } from "react";
import { MenuResources } from '../types/Schemas';
import { onError } from '../utils/functions';
//import { nvFetch } from '../services/fetch';

interface LegalState {
  status: "idle" | "signOut" | "signIn";
  menuResources: MenuResources;
  appURL: string[]
}

type LegalAction =
  | {
      type: "SET_MENU";
      menuResources: MenuResources;
    };

interface LegalContextActions {
  setMenu: (menuResources: MenuResources) => void;
}

interface LegalContextType extends LegalState, LegalContextActions {}
const LegalContext = createContext<LegalContextType>({
  status: "idle",
  appURL: [],
  menuResources: {
    object: [],
    document: [],
  },
  setMenu: () => {},
});

export const LegalProvider = ({ userToken, children }: { userToken: string, children: React.ReactNode }) => {
  const initProvider = (arg: LegalState) => {
    try {
      console.log('reinitialised provider')
    } catch (err) {
      onError('token error')
    }
    return arg;
  }
  const [state, dispatch] = useReducer(LegalReducer, {
    status: "idle",
    appURL: [],
    menuResources: {
      object: [],
      document: [],
    },
  }, initProvider);
  console.log('legal provider')

  const legalActions: LegalContextActions = useMemo(
    () => ({
      setMenu: async (menuResources: MenuResources) => {
        dispatch({ type: "SET_MENU", menuResources });
      }
      //ADD REFRESH FUNCTION 
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userToken]
  );

  return (
    <LegalContext.Provider value={{ ...state, ...legalActions }}>
      {children}
    </LegalContext.Provider>
  );
};

const LegalReducer = (prevState: LegalState, action: LegalAction): LegalState => {
  switch (action.type) {
    case "SET_MENU":
      return {
        ...prevState,
        menuResources: action.menuResources,
      };
  }
};

export const useLegal = (): LegalContextType => {
  const context = useContext(LegalContext);
  if (!context) {
    throw new Error("useLegal must be inside an LegalProvider with a value");
  }
  /*
    you can add more drived state here
    const isLoggedIn  = context.status ==== 'signIn'
    return ({ ...context, isloggedIn})
  */
  return context;
};
