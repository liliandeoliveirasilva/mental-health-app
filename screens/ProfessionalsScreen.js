import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, Chip, Avatar, Portal, Dialog, ActivityIndicator } from 'react-native-paper';

const professionals = [
  {
    id: '1',
    name: 'Dra. Maria Silva',
    specialty: 'Psicóloga',
    rating: 4.8,
    experience: '15 anos',
    description: 'Especialista em terapia cognitivo-comportamental e ansiedade.',
    available: true
  },
  {
    id: '2',
    name: 'Dr. João Santos',
    specialty: 'Psiquiatra',
    rating: 4.9,
    experience: '20 anos',
    description: 'Especializado em tratamento de depressão e transtornos do humor.',
    available: true
  },
  {
    id: '3',
    name: 'Dra. Ana Oliveira',
    specialty: 'Psicóloga',
    rating: 4.7,
    experience: '10 anos',
    description: 'Foco em relacionamentos e terapia familiar.',
    available: false
  }
];

export default function ProfessionalsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const specialties = ['Todos', 'Psicólogo', 'Psiquiatra', 'Terapeuta'];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'Todos' || 
                            prof.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleSchedule = (professional) => {
    if (!professional.available) {
      Alert.alert('Profissional Indisponível', 'Este profissional não está disponível no momento. Por favor, escolha outro profissional.');
      return;
    }
    setSelectedProfessional(professional);
    setDialogVisible(true);
  };

  const confirmScheduling = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setDialogVisible(false);
      Alert.alert(
        'Agendamento Realizado',
        `Sua consulta com ${selectedProfessional.name} foi agendada com sucesso! Entraremos em contato para confirmar o horário.`
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <Searchbar
        placeholder="Buscar profissionais"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.specialtiesContainer}
      >
        {specialties.map((specialty) => (
          <Chip
            key={specialty}
            selected={selectedSpecialty === specialty}
            onPress={() => setSelectedSpecialty(specialty)}
            style={styles.chip}
            mode="outlined"
          >
            {specialty}
          </Chip>
        ))}
      </ScrollView>

      {filteredProfessionals.map((professional) => (
        <Card key={professional.id} style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Avatar.Text
                size={50}
                label={professional.name.split(' ').map(n => n[0]).join('')}
              />
              <View style={styles.headerInfo}>
                <Title>{professional.name}</Title>
                <Paragraph>{professional.specialty}</Paragraph>
              </View>
            </View>
            <View style={styles.details}>
              <Paragraph>Experiência: {professional.experience}</Paragraph>
              <Paragraph>Avaliação: {professional.rating} ⭐</Paragraph>
            </View>
            <Paragraph style={styles.description}>{professional.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => handleSchedule(professional)}
              disabled={!professional.available}
            >
              {professional.available ? 'Agendar Consulta' : 'Indisponível'}
            </Button>
          </Card.Actions>
        </Card>
      ))}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Confirmar Agendamento</Dialog.Title>
          <Dialog.Content>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1976D2" />
                <Paragraph style={styles.loadingText}>Processando agendamento...</Paragraph>
              </View>
            ) : (
              <Paragraph>
                Você está prestes a agendar uma consulta com {selectedProfessional?.name}.
                Confirma o agendamento?
              </Paragraph>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} disabled={loading}>Cancelar</Button>
            <Button mode="contained" onPress={confirmScheduling} disabled={loading}>
              {loading ? 'Agendando...' : 'Confirmar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
  searchbar: {
    marginBottom: 16,
    elevation: 2,
  },
  specialtiesContainer: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  description: {
    marginTop: 8,
  },
});