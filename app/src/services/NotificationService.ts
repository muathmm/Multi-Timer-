
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type ScheduleOptions = {
  title: string;
  body: string;
  date: Date;
};

class NotificationService {
  async requestPermissionsAsync(): Promise<boolean> {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.status !== 'granted') {
      const res = await Notifications.requestPermissionsAsync();
      return res.status === 'granted';
    }
    return true;
  }


  async createAndroidChannel() {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('timers', {
          name: 'Timers',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'default',
        });
      } catch (e) {
        console.warn('createAndroidChannel failed', e);
      }
    }
  }

  async scheduleNotification({ title, body, date }: ScheduleOptions): Promise<string> {
    await this.requestPermissionsAsync();

    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: 'default' },
      trigger: { type: 'date', date },
    });
    return id; 
  }

  async cancelScheduled(identifier: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (e) {
      console.warn('cancelScheduled failed', e);
    }
  }

  async localImmediate(body: string) {
    await this.requestPermissionsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Timer', body, sound: 'default' },
      trigger: null,
    });
  }
}

export default new NotificationService();
