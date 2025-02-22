import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Title, Chip, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const emotions = [
  'Feliz', 'Triste', 'Ansioso', 'Calmo',
  'Irritado', 'Esperançoso', 'Cansado', 'Energético'
];

export default function DiaryScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState('3');
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem('diaryEntries');
      if (savedEntries !== null) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      alert('Por favor, selecione uma emoção');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      intensity: parseInt(intensity),
      notes,
      date: new Date().toISOString()
    };

    try {
      const updatedEntries = [newEntry, ...entries];
      await AsyncStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      
      // Reset form
      setSelectedEmotion('');
      setIntensity('3');
      setNotes('');
      
      alert('Registro salvo com sucesso!');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Erro ao salvar o registro. Tente novamente.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Como você está se sentindo hoje?</Title>
          
          <View style={styles.emotionsContainer}>
            {emotions.map((emotion) => (
              <Chip
                key={emotion}
                selected={selectedEmotion === emotion}
                onPress={() => setSelectedEmotion(emotion)}
                style={styles.chip}
                mode="outlined"
              >
                {emotion}
              </Chip>
            ))}
          </View>

          <Text style={styles.label}>Intensidade do Sentimento (1-5)</Text>
          <TextInput
            keyboardType="numeric"
            value={intensity}
            onChangeText={(text) => {
              if (text === '') {
                setIntensity('');
              } else {
                const num = parseInt(text);
                if (!isNaN(num) && num >= 1 && num <= 5) {
                  setIntensity(text);
                }
              }
            }}
            style={styles.input}
            maxLength={1}
          />

          <Text style={styles.label}>Notas do Dia</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            placeholder="Como foi seu dia? O que aconteceu?"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
          >
            Salvar Registro
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Registros Anteriores</Title>
          {entries.map((entry) => (
            <Card key={entry.id} style={styles.entryCard}>
              <Card.Content>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </Text>
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => {
                      Alert.alert(
                        'Confirmar exclusão',
                        'Tem certeza que deseja apagar este registro?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: 'Apagar', 
                            onPress: async () => {
                              const updatedEntries = entries.filter(e => e.id !== entry.id);
                              try {
                                await AsyncStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
                                setEntries(updatedEntries);
                              } catch (error) {
                                console.error('Error deleting entry:', error);
                                alert('Erro ao apagar o registro. Tente novamente.');
                              }
                            },
                            style: 'destructive'
                          }
                        ]
                      );
                    }}
                  />
                </View>
                <Text style={styles.entryEmotion}>
                  Emoção: {entry.emotion} (Intensidade: {entry.intensity})
                </Text>
                {entry.notes && <Text style={styles.entryNotes}>{entry.notes}</Text>}
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
    borderColor: '#1976D2',
    borderWidth: 1,
  },
  card: {
    marginBottom: 16,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 8,
    elevation: 4,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  chip: {
    margin: 4,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  entryCard: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    color: '#666',
  },
  entryEmotion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entryNotes: {
    fontSize: 14,
    color: '#333',
  },
});