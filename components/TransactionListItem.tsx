import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Category, Transaction } from "../types";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { categoryColors, categoryEmojies } from "../constants";
import Card from "./ui/Card";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category | undefined;
}

export default function TransactionListItem({
  transaction,
  categoryInfo,
}: TransactionListItemProps) {

  const [fontsLoaded] = useFonts({
    "Nothing": require("../assets/fonts/nothingfont.otf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const iconName =
    transaction.type === "Expense" ? "minuscircle" : "pluscircle";
  const color = transaction.type === "Expense" ? "red" : "green";
  const categoryColor = categoryColors[categoryInfo?.name ?? "Default"];
  const emoji = categoryEmojies[categoryInfo?.name ?? "Default"];
  
  return (
    <Card>
      <View style={styles.row}>
        <View style={{ width: "40%", gap: 3 }}>
          <Amount
            amount={transaction.amount}
            color={color}
            iconName={iconName}
          />
          <CategoryItem
            categoryColor={categoryColor}
            categoryInfo={categoryInfo}
            emoji={emoji}
          />
        </View>
      </View>
    </Card>
  );
}

function CategoryItem({
  categoryColor,
  categoryInfo,
  emoji,
}: {
  categoryColor: string;
  categoryInfo: Category | undefined;
  emoji: string;
}) {
  return (
    <View
      style={[
        styles.categoryContainer,
        { backgroundColor: categoryColor + "70" },
      ]}
    >
      <Text style={styles.categoryText}>
        {emoji} {categoryInfo?.name} ‎
      </Text>
    </View>
  );
}

function Amount({
  iconName,
  color,
  amount,
}: {
  iconName: "minuscircle" | "pluscircle";
  color: string;
  amount: number;
}) {
  return (
    <View style={styles.row}>
      <AntDesign name={iconName} size={18} color={color} />
      <AutoSizeText
        fontSize={32}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}
        style={[styles.amount, { maxWidth: "80%" }]}
      ><Text style={{fontFamily: "Nothing"}}>
        ${amount}</Text>
      </AutoSizeText>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    fontFamily: "Nothing"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    fontFamily: "Nothing"
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
    color: "white"
  },
  categoryText: {
    fontSize: 13,
    fontFamily: "Nothing"
  },
});
