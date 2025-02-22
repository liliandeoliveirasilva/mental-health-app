import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar, Chip, Avatar } from 'react-native-paper';

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

  const specialties = ['Todos', 'Psicólogo', 'Psiquiatra', 'Terapeuta'];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'Todos' || 
                            prof.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleSchedule = (professional) => {
    // TODO: Implement scheduling functionality
    console.log('Agendar com:', professional.name);
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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