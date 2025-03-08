import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, Card, Title, Chip, IconButton, Portal, Dialog, Snackbar } from 'react-native-paper';
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const savedEntries = await AsyncStorage.getItem('diaryEntries');
      if (savedEntries !== null) {
        setEntries(JSON.parse(savedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      showSnackbar('Erro ao carregar os registros');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) {
      showSnackbar('Por favor, selecione uma emoção');
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
      setSaving(true);
      const updatedEntries = [newEntry, ...entries];
      await AsyncStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      
      // Reset form
      setSelectedEmotion('');
      setIntensity('3');
      setNotes('');
      
      showSnackbar('Registro salvo com sucesso!');
    } catch (error) {
      console.error('Error saving entry:', error);
      showSnackbar('Erro ao salvar o registro. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Carregando registros...</Text>
        </View>
      )}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Como você está se sentindo hoje?</Title>
          
          <View style={styles.emotionsContainer}>
            {emotions.map((emotion) => (
              <Chip
                key={emotion}
                selected={selectedEmotion === emotion}
                onPress={() => setSelectedEmotion(emotion)}
                style={[styles.chip, selectedEmotion === emotion && styles.selectedChip]}
                textStyle={[styles.chipText, selectedEmotion === emotion && styles.selectedChipText]}
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
            style={styles.textArea}
            placeholder="Como foi seu dia? O que aconteceu?"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={saving}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Registro'}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Registros Anteriores</Title>
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
                                showSnackbar('Registro excluído com sucesso');
                              } catch (error) {
                                console.error('Error deleting entry:', error);
                                showSnackbar('Erro ao apagar o registro');
                              }
                            },
                            style: 'destructive'
                          }
                        ]
                      );
                    }}
                  />
                </View>
                <View style={styles.emotionContainer}>
                  <Chip style={styles.emotionChip}>
                    {entry.emotion} (Intensidade: {entry.intensity})
                  </Chip>
                </View>
                {entry.notes && <Text style={styles.entryNotes}>{entry.notes}</Text>}
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    padding: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    color: '#1976D2',
    marginBottom: 16,
    fontWeight: '600',
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  chip: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#1976D2',
  },
  selectedChip: {
    backgroundColor: '#1976D2',
  },
  chipText: {
    color: '#1976D2',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#1976D2',
  },
  textArea: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#1976D2',
    minHeight: 100,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 8,
  },
  entryCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  emotionContainer: {
    marginBottom: 8,
  },
  emotionChip: {
    backgroundColor: '#E3F2FD',
  },
  entryNotes: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  snackbar: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#323232',
  },
});