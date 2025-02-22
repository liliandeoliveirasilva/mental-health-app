import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';

const capsInfo = {
  name: 'CAPS Guanhães',
  type: 'Centro de Atenção Psicossocial',
  address: 'Praça Néria Coelho Guimarães - Guanhães, MG, 39740-000',
  phone: '(33) 3421-3345',
  hours: 'Segunda a Sexta-feira, 07:00 às 17:00',
  description: 'O Centro de Atenção Psicossocial (CAPS) de Guanhães é uma unidade especializada em saúde mental que oferece atendimento à população, realizando o acompanhamento clínico e a reinserção social dos usuários pelo acesso ao trabalho, lazer, exercício dos direitos civis e fortalecimento dos laços familiares e comunitários.',
  coordinates: {
    latitude: -18.7771,
    longitude: -42.9311
  }
};

export default function ResourcesScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: capsInfo.coordinates.latitude,
          longitude: capsInfo.coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={capsInfo.coordinates}
          title={capsInfo.name}
          description={capsInfo.type}
        />
      </MapView>

      <ScrollView style={styles.resourcesContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>{capsInfo.name}</Title>
            <Paragraph style={styles.type}>{capsInfo.type}</Paragraph>
            <Paragraph style={styles.info}>Endereço: {capsInfo.address}</Paragraph>
            <Paragraph style={styles.info}>Telefone: {capsInfo.phone}</Paragraph>
            <Paragraph style={styles.info}>Horário: {capsInfo.hours}</Paragraph>
            <Paragraph style={styles.description}>{capsInfo.description}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    borderColor: '#1976D2',
    borderWidth: 1,
  },
  map: {
    height: Dimensions.get('window').height * 0.4,
  },
  resourcesContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 4,
    borderColor: '#1976D2',
    borderWidth: 1,
    borderRadius: 8,
  },
  type: {
    color: '#666',
    marginBottom: 12,
    fontSize: 16,
  },
  info: {
    marginBottom: 8,
    fontSize: 15,
  },
  description: {
    marginTop: 12,
    lineHeight: 20,
  },
});