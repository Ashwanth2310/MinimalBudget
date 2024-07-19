import { View, Text, ViewStyle, TextStyle } from "react-native";

interface CardProps extends React.PropsWithChildren {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Card({ children, style = {}, textStyle = {} }: CardProps) {
  return (
    <View
      style={{
        padding: 15,
        borderRadius: 15,
        backgroundColor: "black",
        elevation: 8,
        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.15,
        ...style,
      }}
    >
      <Text style={{ color: "white", ...textStyle }}>
        {children}
      </Text>
    </View>
  );
}
