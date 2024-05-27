import {
  ActivityPubUserAdapter,
  UserInterface, UserType
} from "@dhaaga/shared-abstraction-activitypub/src";
import {createContext, useContext, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../libs/redux/store";
import {AccountState} from "../libs/redux/slices/account";

type Type = {
  user: UserInterface | null
  userRaw: UserType | null
  setData: (o: UserInterface) => void
  setDataRaw: (o: UserType) => void
}

const defaultValue: Type = {
  user: undefined,
  userRaw: undefined,
  setData: function (o: UserInterface): void {
    throw new Error("Function not implemented.");
  },
  setDataRaw: function (o: UserType): void {
    throw new Error("Function not implemented.");
  }
}

const ActivitypubUserContext =
    createContext<Type>(defaultValue);


export function useActivitypubUserContext() {
  return useContext(ActivitypubUserContext);
}

type Props = {
  user: UserType,
  children: any
}

function WithActivitypubUserContext({user, children}: Props) {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const domain = accountState?.activeAccount?.domain

  const [Value, setValue] = useState<UserInterface | null>(
      ActivityPubUserAdapter(null, domain)
  )
  const [RawValue, setRawValue] = useState<UserType | null>(
      null
  )

  // init
  useEffect(() => {
    setRawValue(user)
    setValue(ActivityPubUserAdapter(user, domain))
  }, [user]);


  const set = (o: UserInterface) => setValue(o)
  const setRaw = (o: UserType) => {
    setRawValue(o)
    setValue(ActivityPubUserAdapter(o, domain))
  }

  return <ActivitypubUserContext.Provider value={{
    user: Value,
    userRaw: RawValue,
    setData: set,
    setDataRaw: setRaw
  }}>
    {children}
  </ActivitypubUserContext.Provider>
}

export default WithActivitypubUserContext;