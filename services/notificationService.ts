import * as Notifications from 'expo-notifications';

// Configurar como as notificações aparecem - CORRIGIDO!
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ✅ NOTIFICAÇÕES LOCAIS APENAS

// Jogo adicionado
export async function scheduleGameAddedNotification(gameTitle: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✅ Jogo adicionado!',
      body: `${gameTitle} foi adicionado à sua coleção.`,
      sound: true,
      data: { screen: 'games' },
    },
    trigger: null, // Imediato
  });
}

// Lembrete para jogar - CORRIGIDO!
export async function scheduleGameReminder(gameTitle: string, hours: number) {
  const triggerDate = new Date();
  triggerDate.setHours(triggerDate.getHours() + hours);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎮 Hora de jogar!',
      body: `Não esqueça de jogar ${gameTitle}!`,
      sound: true,
      data: { screen: 'games' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    } as Notifications.NotificationTriggerInput,
  });
}

// Jogo completado
export async function scheduleGameCompletedNotification(gameTitle: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Jogo completado!',
      body: `Parabéns! Você completou ${gameTitle}!`,
      sound: true,
      data: { screen: 'games' },
    },
    trigger: null,
  });
}

// Lembrete diário - CORRIGIDO!
export async function scheduleDailyReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📅 Lembrete diário',
      body: 'Que tal jogar um pouco hoje?',
      sound: true,
      data: { screen: 'home' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 19,
      minute: 0,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });
}

// Notificação de teste
export async function scheduleTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Teste',
      body: 'Notificação funcionando!',
      sound: true,
    },
    trigger: null,
  });
}

// Cancelar todas
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Listar agendadas
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}