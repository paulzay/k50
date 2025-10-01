
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { cards as initialCards } from '../data/cards';

// Shuffle utility
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function CardDeck({ roomCode }: { roomCode: string }) {
  const [deck, setDeck] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // countdown
  const timerRef = useRef<any | null>(null);

  // Load deck from AsyncStorage or initialize
  useEffect(() => {
    const loadDeck = async () => {
      const savedDeck = await AsyncStorage.getItem(`deck_${roomCode}`);
      if (savedDeck) {
        const { deck: storedDeck, currentCard: storedCard } = JSON.parse(savedDeck);
        setDeck(storedDeck);
        setCurrentCard(storedCard);
      } else {
        const newDeck = shuffleArray(initialCards);
        setDeck(newDeck);
        await AsyncStorage.setItem(
          `deck_${roomCode}`,
          JSON.stringify({ deck: newDeck, currentCard: null })
        );
      }
    };
    loadDeck();
  }, [roomCode]);

  const saveDeck = async (updatedDeck: any[], updatedCard: any) => {
    setDeck(updatedDeck);
    setCurrentCard(updatedCard);
    await AsyncStorage.setItem(
      `deck_${roomCode}`,
      JSON.stringify({ deck: updatedDeck, currentCard: updatedCard })
    );
  };

  // Draw card + start timer
  const drawCard = async () => {
    if (deck.length === 0) {
      await saveDeck([], null);
      return;
    }
    const [nextCard, ...remaining] = deck;
    await saveDeck(remaining, nextCard);
    startTimer(30); // 30 seconds countdown
  };

  // Reset deck
  const resetDeck = async () => {
    const newDeck = shuffleArray(initialCards);
    await saveDeck(newDeck, null);
    stopTimer();
  };

  // Timer functions
  const startTimer = (seconds: number) => {
    stopTimer();
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  return (
    <View style={{ marginVertical: 20, padding: 16, borderWidth: 1, borderRadius: 12 }}>

      {currentCard ? (
        <FlatList
          data={currentCard}
          renderItem={({ item }: { item: string }) => (
            <Item title={item} />
          )}
          keyExtractor={(item: string, index: number) => item + index}
        />
      ) : deck.length === 0 ? (
        <Text style={{ marginVertical: 10 }}>🎉 No more cards! Reset to play again.</Text>
      ) : (
        <Text style={{ marginVertical: 10 }}>Press Draw to get a card</Text>
      )}

      {/* Timer */}
      {timeLeft > 0 && (
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 8 }}>
          ⏱ Time Left: {timeLeft}s
        </Text>
      )}

      {/* Buttons */}
      {deck.length > 0 && timeLeft === 0 ? (
        <Button title="Draw Card" onPress={drawCard} />
      ) : deck.length === 0 ? (
        <Button title="Reset Deck" onPress={resetDeck} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  button: {
    backgroundColor: 'coral',
  },
});