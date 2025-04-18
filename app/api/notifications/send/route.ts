import { NextRequest, NextResponse } from 'next/server';

interface NotificationRequest {
  tokens: string[];
  title: string;
  body: string;
  targetUrl: string;
  notificationId: string;
}

interface NotificationResponse {
  successTokens: string[];
  invalidTokens: string[];
  rateLimitedTokens: string[];
}

export async function POST(req: NextRequest) {
  try {
    // Weryfikacja, czy żądanie jest autoryzowane (np. poprzez API key)
    // W produkcji należy dodać mechanizm autentykacji
    
    // Parsowanie danych z żądania
    const data: NotificationRequest = await req.json();
    console.log('Sending notifications:', data);
    
    // Walidacja danych
    if (!data.tokens || !Array.isArray(data.tokens) || data.tokens.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tokens array' },
        { status: 400 }
      );
    }
    
    if (!data.title || !data.body || !data.targetUrl || !data.notificationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Limitowanie liczby tokenów w jednym żądaniu
    if (data.tokens.length > 100) {
      return NextResponse.json(
        { error: 'Too many tokens in one request (max 100)' },
        { status: 400 }
      );
    }
    
    // W rzeczywistej implementacji, tutaj należy pobrać zapamiętane dane URL-i notyfikacji
    // dla każdego tokenu i wysłać odpowiednie żądania do API Farcastera
    
    // Przykładowa implementacja: (zakomentowana, ponieważ nie mamy jeszcze bazy danych)
    /*
    const notifications = await Promise.allSettled(
      data.tokens.map(async (token) => {
        // Pobranie URL dla danego tokenu z bazy danych
        const tokenData = await getNotificationTokenData(token);
        
        if (!tokenData || !tokenData.url) {
          return { status: 'invalid', token };
        }
        
        // Wysłanie żądania do URL Farcastera
        const response = await fetch(tokenData.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notificationId: data.notificationId,
            title: data.title,
            body: data.body,
            targetUrl: data.targetUrl,
            tokens: [token],
          }),
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
          if (responseData.successTokens?.includes(token)) {
            return { status: 'success', token };
          } else if (responseData.invalidTokens?.includes(token)) {
            return { status: 'invalid', token };
          } else if (responseData.rateLimitedTokens?.includes(token)) {
            return { status: 'rateLimit', token };
          }
        }
        
        return { status: 'error', token };
      })
    );
    
    const result: NotificationResponse = {
      successTokens: notifications
        .filter((n) => n.status === 'fulfilled' && n.value.status === 'success')
        .map((n) => (n.status === 'fulfilled' ? n.value.token : '')),
      invalidTokens: notifications
        .filter((n) => n.status === 'fulfilled' && n.value.status === 'invalid')
        .map((n) => (n.status === 'fulfilled' ? n.value.token : '')),
      rateLimitedTokens: notifications
        .filter((n) => n.status === 'fulfilled' && n.value.status === 'rateLimit')
        .map((n) => (n.status === 'fulfilled' ? n.value.token : '')),
    };
    */
    
    // Zwracamy przykładową odpowiedź do celów demonstracyjnych
    const mockResponse: NotificationResponse = {
      successTokens: data.tokens,
      invalidTokens: [],
      rateLimitedTokens: []
    };
    
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 