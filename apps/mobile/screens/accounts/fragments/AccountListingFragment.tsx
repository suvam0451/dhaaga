import {View, Text, StyleSheet} from "react-native";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import {Button, Card} from "@rneui/base";
import {AccountState, accountSlice} from "../../../libs/redux/slices/account";
import {RootState} from "../../../libs/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {useObject, useQuery, useRealm} from "@realm/react";
import {Account} from "../../../entities/account.entity";
import AccountRepository from "../../../repositories/account.repo";
import {Types} from "realm";
import UUID = Types.UUID;

type Props = {
  id: UUID;
};

function AccountListingFragment({id}: Props) {
  const dispatch = useDispatch();
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const account = useObject(Account, id)
  const db = useRealm()

  const activeAccount =
      useQuery(Account).find((o) =>
          o._id.toString() === accountState.activeAccount?.id)

  const avatar = AccountRepository.findSecret(db, account, "avatar")?.value
  const displayName = AccountRepository.findSecret(db, account, "display_name")?.value

  function onSelectAccount(o: Account) {
    dispatch(accountSlice.actions.setAccount({
          id: o._id.toString(),
          domain: o.domain,
          subdomain: o.subdomain,
          username: o.username
        }
    ))
  }


  function onDeselectAccount(o: Account) {
    dispatch(accountSlice.actions.setAccount(null));
  }

  return (
      <Card
          wrapperStyle={{
            height: 48,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          containerStyle={{
            margin: 0,
            padding: 8,
            backgroundColor:
                activeAccount?._id?.toString()
                === account._id.toString() ? "#E5FFDA" : "white",
          }}
      >
        <View>
          {avatar && (
              <View style={{height: 48, width: 48}}>
                <Image
                    // @ts-ignore
                    style={styles.image}
                    source={avatar}
                    contentFit="fill"
                    transition={1000}
                />
              </View>
          )}
        </View>
        <View style={{marginLeft: 8, flexGrow: 1}}>
          {displayName && (
              <Text style={{fontWeight: "500"}}>{displayName}</Text>
          )}
          <Text style={{color: "gray", fontSize: 14}}>{account.username}</Text>
        </View>
        <View
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row",
              marginRight: 8,
              alignItems: "center",
            }}
        >
          {activeAccount?._id?.toString()
          !== account._id?.toString() ? (
              <Button
                  type="clear"
                  onPress={() => {
                    onSelectAccount(account);
                  }}
              >
                Select
              </Button>
          ) : (
              <Button
                  type="clear"
                  onPress={() => {
                    onDeselectAccount(account);
                  }}
              >
                Deselect
              </Button>
          )}

          <Ionicons name="menu-outline" size={32} color="black"/>
        </View>
      </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
});

export default AccountListingFragment;
