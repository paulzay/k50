import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Room = {
  key: string;
  players: any[]; // Replace 'any' with a more specific type if possible
};

const Separator = () => <View style={styles.separator} />;

export default function Lobby() {
  const [roomCode, setRoomCode] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [createRoomModalVisible, setCreateRoomModalVisible] = useState(false);

  const createRoom = async () => {
    const code = roomCode.trim();
    if (!code) {
      alert('Please enter a valid room code');
      return;
    }
    const existingRoom = await AsyncStorage.getItem(`room_${code}`);
    if (existingRoom) {
      alert('Room code already exists. Please choose a different code.');
      return;
    }
    await AsyncStorage.setItem(`room_${code}`, JSON.stringify({ players: [] }));
    router.push(`/game/${code}`);
  };

  const joinRoom = async () => {
    const room = await AsyncStorage.getItem(`room_${roomCode}`);
    if (room) {
      router.push(`/game/${roomCode}`);
    } else {
      alert('Room not found');
    }
  };
  const deleteAllRooms = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const roomKeys = keys.filter(key => key.startsWith('room_'));
    await AsyncStorage.multiRemove(roomKeys);
    alert('All rooms deleted');
  };

  const getAllRooms = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const roomKeys = keys.filter(key => key.startsWith('room_'));
    const rooms = await AsyncStorage.multiGet(roomKeys);
    return rooms
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => ({ key, ...JSON.parse(value as string) }));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: '#f0f0f0' }}>
          <Text>Kenya @ 50 - Lobby</Text>
          <Separator />
          <Button color="#841584" title="Create Room" onPress={() => setCreateRoomModalVisible(true)} />
          <Separator />
          <View>
            <TextInput placeholder="Enter Room Code" value={roomCode} onChangeText={setRoomCode} style={styles.input} />
            <Button title="Join Room" onPress={joinRoom} />
          </View>

          <Separator />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <Button
              title="Get All Rooms"
              onPress={async () => {
                const allRooms = await getAllRooms();
                setRooms(allRooms);
              }}
            />
            <Button title="Delete All Rooms" onPress={deleteAllRooms} />
          </View>
          <View>
            {rooms.map((room, index) => (
              <Text key={index}>
                {room.key.replace('room_', '')}: {JSON.stringify(room.players)}
              </Text>
            ))}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text >Hello World!</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={createRoomModalVisible}
            onRequestClose={() => {
              setCreateRoomModalVisible(!createRoomModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput placeholder="Enter Room Code" style={styles.input} value={roomCode} onChangeText={setRoomCode} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                  <Button title="Cancel" onPress={() => setCreateRoomModalVisible(false)} />
                  <Button title="Create" onPress={createRoom} />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
});