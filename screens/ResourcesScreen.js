import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
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
  const handlePhonePress = () => {
    Linking.openURL(`tel:${capsInfo.phone.replace(/\D/g, '')}`);
  };

  const handleAddressPress = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${capsInfo.coordinates.latitude},${capsInfo.coordinates.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.mapCard}>
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
      </Card>

      <ScrollView style={styles.resourcesContainer}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.title}>{capsInfo.name}</Title>
            <Paragraph style={styles.type}>{capsInfo.type}</Paragraph>
            
            <View style={styles.contactItem}>
              <IconButton icon="map-marker" size={24} color="#1976D2" />
              <Paragraph style={styles.info} onPress={handleAddressPress}>
                {capsInfo.address}
              </Paragraph>
            </View>

            <View style={styles.contactItem}>
              <IconButton icon="phone" size={24} color="#1976D2" />
              <Paragraph style={styles.info} onPress={handlePhonePress}>
                {capsInfo.phone}
              </Paragraph>
            </View>

            <View style={styles.contactItem}>
              <IconButton icon="clock-outline" size={24} color="#1976D2" />
              <Paragraph style={styles.info}>{capsInfo.hours}</Paragraph>
            </View>

            <Title style={styles.sectionTitle}>Sobre</Title>
            <Paragraph style={styles.description}>{capsInfo.description}</Paragraph>

            <Button
              mode="contained"
              onPress={handlePhonePress}
              style={styles.button}
              icon="phone"
            >
              Ligar Agora
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  mapCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
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
  map: {
    height: Dimensions.get('window').height * 0.3,
  },
  resourcesContainer: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
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
  title: {
    fontSize: 24,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  info: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: -8,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1976D2',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 8,
  },
});