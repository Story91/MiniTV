import { NextRequest, NextResponse } from 'next/server';

// Typy zdarzeń Farcaster
type FarcasterEvent = 
  | { event: 'frame_added', notificationDetails?: { url: string, token: string } }
  | { event: 'frame_removed' }
  | { event: 'notifications_disabled' }
  | { event: 'notifications_enabled', notificationDetails: { url: string, token: string } };

// TODO: Dodać faktyczną weryfikację podpisu z Farcaster, np. używając @farcaster/frame-node
const verifySignature = async (req: NextRequest): Promise<boolean> => {
  // W produkcji należy użyć biblioteki @farcaster/frame-node do weryfikacji
  // Dla celów demonstracyjnych zawsze zwracamy true
  return true;
};

export async function POST(req: NextRequest) {
  try {
    // Weryfikacja, czy żądanie pochodzi od Farcastera
    const isValid = await verifySignature(req);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parsowanie danych z żądania
    const data: FarcasterEvent = await req.json();
    console.log('Received Farcaster webhook event:', data);

    // Obsługa różnych zdarzeń
    switch (data.event) {
      case 'frame_added':
        // Użytkownik dodał aplikację
        if (data.notificationDetails) {
          // Zapisz token do bazy danych
          // Przykład: await saveNotificationToken(data.notificationDetails.token, data.notificationDetails.url);
          console.log('Notification token received:', data.notificationDetails);
        }
        break;
        
      case 'frame_removed':
        // Użytkownik usunął aplikację
        // Można oznaczyć wszystkie tokeny dla tego użytkownika jako nieważne
        break;
        
      case 'notifications_disabled':
        // Użytkownik wyłączył powiadomienia
        // Oznacz tokeny jako nieważne
        break;
        
      case 'notifications_enabled':
        // Użytkownik włączył powiadomienia
        // Zapisz nowy token
        console.log('New notification token received:', data.notificationDetails);
        break;
        
      default:
        console.warn('Unknown event type received');
    }
    
    // Zwróć potwierdzenie otrzymania zdarzenia
    return NextResponse.json({ status: 'ok' });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 