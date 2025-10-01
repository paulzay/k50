import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

type Player = {
  name: string;
  score: number;
};

type PlayerListProps = {
  players: Player[];
  onAddPlayer: (name: string) => void;
};

export default function PlayerList({ players, onAddPlayer }: PlayerListProps) {
  const [name, setName] = useState('');

  return (
    <View>
      <Text>Players</Text>
      {players.map((p, i) => (
        <Text key={i}>{p.name} - {p.score}</Text>
      ))}
      <TextInput placeholder="Player Name" value={name} onChangeText={setName} style={styles.input} />
      <Button title="Add Player" onPress={() => { onAddPlayer(name); setName(''); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
  },
});