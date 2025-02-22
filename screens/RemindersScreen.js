import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Card, Title, Text, Button, TextInput, Switch, List, IconButton, Divider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    loadReminders();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Permissão Necessária', 'Por favor, permita as notificações para receber lembretes de medicação.');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('medication-reminders', {
          name: 'Lembretes de Medicação',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#1976D2',
          sound: true,
          enableVibrate: true,
          showBadge: true,
        });
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          priority: 'max',
        }),
      });

      return true;
    } catch (error) {
      console.error('Error setting up notifications:', error);
      Alert.alert('Erro', 'Não foi possível configurar as notificações. Por favor, tente novamente.');
      return false;
    }
  };

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem('medicationReminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus lembretes.');
    }
  };

  const [newReminder, setNewReminder] = useState({
    medication: '',
    dosage: '',
    time: '12:00'
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setNewReminder({ ...newReminder, time: `${hours}:${minutes}` });
    }
  };

  const toggleReminder = async (id) => {
    try {
      const updatedReminders = reminders.map(async (reminder) => {
        if (reminder.id === id) {
          const updatedReminder = { ...reminder, enabled: !reminder.enabled };
          
          if (updatedReminder.notificationId) {
            if (!updatedReminder.enabled) {
              await Notifications.cancelScheduledNotificationAsync(updatedReminder.notificationId);
            } else {
              const [hours, minutes] = updatedReminder.time.split(':');
              const schedulingOptions = {
                content: {
                  title: 'Hora do Medicamento',
                  body: `${updatedReminder.medication} - ${updatedReminder.dosage}`,
                  sound: true,
                  priority: 'high',
                  vibrate: [0, 250, 250, 250]
                },
                trigger: {
                  hour: parseInt(hours),
                  minute: parseInt(minutes),
                  repeats: true,
                },
              };
              const newNotificationId = await Notifications.scheduleNotificationAsync(schedulingOptions);
              updatedReminder.notificationId = newNotificationId;
            }
          }
          return updatedReminder;
        }
        return reminder;
      });

      const resolvedReminders = await Promise.all(updatedReminders);
      await AsyncStorage.setItem('medicationReminders', JSON.stringify(resolvedReminders));
      setReminders(resolvedReminders);
    } catch (error) {
      console.error('Error toggling reminder:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o lembrete. Tente novamente.');
    }
  };

  const deleteReminder = async (id) => {
    try {
      const reminderToDelete = reminders.find(r => r.id === id);
      if (reminderToDelete?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(reminderToDelete.notificationId);
      }

      const updatedReminders = reminders.filter(reminder => reminder.id !== id);
      await AsyncStorage.setItem('medicationReminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);

      Alert.alert('Sucesso', 'Lembrete removido com sucesso!');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      Alert.alert('Erro', 'Não foi possível remover o lembrete. Tente novamente.');
    }
  };

  const addReminder = async () => {
    if (newReminder.medication.trim() === '' || newReminder.dosage.trim() === '') {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha o nome do medicamento e a dosagem.');
      return;
    }

    try {
      const notificationsEnabled = await setupNotifications();
      if (!notificationsEnabled) {
        Alert.alert('Erro', 'Não foi possível configurar as notificações. Verifique as permissões do aplicativo.');
        return;
      }

      const newId = String(Date.now());
      const reminder = {
        id: newId,
        ...newReminder,
        enabled: true,
        notificationId: null
      };

      const [hours, minutes] = reminder.time.split(':');
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      // If the scheduled time is earlier than now, set it for tomorrow
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const schedulingOptions = {
        content: {
          title: '⏰ ALARME DE MEDICAMENTO',
          body: `${reminder.medication} - ${reminder.dosage}\n\nTOQUE PARA DESATIVAR O ALARME`,
          sound: true,
          priority: 'max',
          vibrate: [0, 500, 250, 500, 250, 500, 250, 500, 250, 500],
          android: {
            channelId: 'medication-reminders',
            priority: 'max',
            sound: true,
            vibrate: [0, 500, 250, 500, 250, 500, 250, 500, 250, 500],
            importance: Notifications.AndroidImportance.MAX,
            sticky: true,
            ongoing: true,
            autoCancel: false,
            fullScreenIntent: true,
            actions: [
              {
                title: '⏰ DESATIVAR ALARME',
                icon: 'ic_launcher'
              }
            ]
          },
          ios: {
            sound: true,
            presentAlert: true,
            presentBadge: true,
            presentSound: true,
            interruptionLevel: 'critical',
            attachments: null,
            categoryIdentifier: 'medication-alarm'
          }
        },
        trigger: {
          hour: parseInt(hours),
          minute: parseInt(minutes),
          repeats: true,
          seconds: 0
        }
      };

      const notificationId = await Notifications.scheduleNotificationAsync(schedulingOptions);
      if (!notificationId) {
        throw new Error('Failed to schedule notification');
      }

      reminder.notificationId = notificationId;
      const updatedReminders = [...reminders, reminder];
      await AsyncStorage.setItem('medicationReminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
      setNewReminder({ medication: '', dosage: '', time: '12:00' });

      Alert.alert('Sucesso', 'Lembrete de medicação adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding reminder:', error);
      Alert.alert('Erro', `Não foi possível adicionar o lembrete: ${error.message}. Tente novamente.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Adicionar Novo Medicamento</Title>
          <TextInput
            label="Nome do Medicamento"
            value={newReminder.medication}
            onChangeText={(text) => setNewReminder({ ...newReminder, medication: text })}
            style={styles.input}
          />
          <TextInput
            label="Dosagem"
            value={newReminder.dosage}
            onChangeText={(text) => setNewReminder({ ...newReminder, dosage: text })}
            style={styles.input}
            placeholder="Ex: 20mg, 1 comprimido"
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Horário do Medicamento</Text>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={styles.timeButton}
              icon="clock-outline"
              contentStyle={styles.timeButtonContent}
            >
              {newReminder.time}
            </Button>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={onTimeChange}
                textColor="#1976D2"
              />
            )}
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={new Date(new Date().setHours(...newReminder.time.split(':').map(Number)))}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}
          <Button
            mode="contained"
            onPress={addReminder}
            style={styles.button}
            icon="pill"
          >
            Adicionar Medicamento
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Meus Medicamentos</Title>
          {reminders.map((reminder) => (
            <List.Item
              key={reminder.id}
              title={reminder.medication}
              description={`${reminder.dosage} - Horário: ${reminder.time}`}
              left={props => <List.Icon {...props} icon="pill" />}
              right={() => (
                <View style={styles.reminderActions}>
                  <Switch
                    value={reminder.enabled}
                    onValueChange={() => toggleReminder(reminder.id)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => deleteReminder(reminder.id)}
                  />
                </View>
              )}
              style={styles.listItem}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    padding: 16
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    borderColor: '#1976D2',
    borderWidth: 1,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#1976D2',
  },
  timeContainer: {
    marginVertical: 12,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timeButton: {
    borderColor: '#1976D2',
    borderWidth: 1.5,
    borderRadius: 8,
  },
  timeButtonContent: {
    height: 48,
    fontSize: 18,
  },
  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  switchEnabled: {
    marginRight: 8,
  },
  deleteButton: {
    margin: 0,
  },
  cardTitle: {
    color: '#1976D2',
    marginBottom: 16,
  }
});