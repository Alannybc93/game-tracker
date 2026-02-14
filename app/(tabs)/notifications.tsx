// services/notificationService.ts - VERSÃO SIMPLIFICADA (SEM PUSH)
import * as Notifications from 'expo-notifications';

// Configurar como as notificações aparecem
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ✅ APENAS NOTIFICAÇÕES LOCAIS - SEM PUSH!

// Agendar notificação de lembrete para jogar
export async function scheduleGameReminder(gameTitle: string, hours: number) {
  const trigger = new Date();
  trigger.setHours(trigger.getHours() + hours);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎮 Hora de jogar!',
      body: `Não esqueça de jogar ${gameTitle} hoje!`,
      data: { screen: 'games' },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });
}

// Agendar notificação quando jogo for adicionado
export async function scheduleGameAddedNotification(gameTitle: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✅ Jogo adicionado!',
      body: `${gameTitle} foi adicionado à sua biblioteca.`,
      data: { screen: 'games' },
      sound: true,
    },
    trigger: null,
  });
}

// Agendar notificação de jogo completado
export async function scheduleGameCompletedNotification(gameTitle: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Jogo completado!',
      body: `Parabéns! Você completou ${gameTitle}!`,
      data: { screen: 'games' },
      sound: true,
    },
    trigger: null,
  });
}

// Agendar notificação diária
export async function scheduleDailyReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📅 Lembrete diário',
      body: 'Você tem jogos para jogar hoje!',
      data: { screen: 'home' },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 19,
      minute: 0,
      repeats: true,
    },
  });
}

// Cancelar todas as notificações
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Cancelar notificação específica
export async function cancelNotification(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

// Obter todas as notificações agendadas
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}
