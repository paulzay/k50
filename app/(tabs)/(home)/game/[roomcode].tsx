import CardDeck from '@/app/components/CardDeck';
import PlayerList from '@/app/components/PlayerList';
import ScoreSheet from '@/app/components/Scoresheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function GameRoom() {
  const { roomCode } = useLocalSearchParams();
  interface Player {
    name: string;
    score: number;
  }

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const room = await AsyncStorage.getItem(`room_${roomCode}`);
      if (room) {
        setPlayers(JSON.parse(room).players);
      }
    };
    fetchPlayers();
  }, [roomCode]);

  interface Player {
    name: string;
    score: number;
  }

  interface PlayerListProps {
    players: Player[];
    onAddPlayer: (name: string) => void;
  }

  interface ScoreSheetProps {
    players: Player[];
    onChangeScore: (index: number, delta: number) => void;
  }

  const addPlayer = async (name: string): Promise<void> => {
    const updatedPlayers: Player[] = [...players, { name, score: 0 }];
    setPlayers(updatedPlayers);
    await AsyncStorage.setItem(`room_${roomCode}`, JSON.stringify({ players: updatedPlayers }));
  };

  interface ChangeScoreParams {
    index: number;
    delta: number;
  }

  const changeScore = async (index: number, delta: number): Promise<void> => {
    const updatedPlayers: Player[] = players.map((p: Player, i: number) =>
      i === index ? { ...p, score: p.score + delta } : p
    );
    setPlayers(updatedPlayers);
    await AsyncStorage.setItem(`room_${roomCode}`, JSON.stringify({ players: updatedPlayers }));
  };

  return (
    <View style={styles.container}>
      <Text>Room Code: {roomCode}</Text>
      <PlayerList players={players} onAddPlayer={addPlayer} />
      <CardDeck roomCode={roomCode as string} />
      <ScoreSheet players={players} onChangeScore={changeScore} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' },
})