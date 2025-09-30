import { Button, Text, View } from 'react-native';

type Player = {
  name: string;
  score: number;
};

type ScoreSheetProps = {
  players: Player[];
  onChangeScore: (index: number, delta: number) => void;
};

export default function ScoreSheet({ players, onChangeScore }: ScoreSheetProps) {
  return (
    <View>
      <Text>Scores</Text>
      {players.map((p, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{p.name}: {p.score}</Text>
          <Button title="+" onPress={() => onChangeScore(i, 1)} />
          <Button title="-" onPress={() => onChangeScore(i, -1)} />
        </View>
      ))}
    </View>
  );
}