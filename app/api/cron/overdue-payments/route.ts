import { NextResponse } from 'next/server';
import { paymentVerificationService } from '../../../matricula/lib/services/payment-verification-service';

export async function GET(request: Request) {
  // Check for API key in headers for security
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Check for overdue payments and send notifications
    const notificationsSent = await paymentVerificationService.checkOverduePayments();
    
    return NextResponse.json({
      success: true,
      notificationsSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in overdue payments cron:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
