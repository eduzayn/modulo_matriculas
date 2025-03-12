import { NextResponse } from 'next/server';
import { monitoringService } from '../../../matricula/lib/services/monitoring-service';

export async function GET() {
  const metrics = monitoringService.getAllMetrics();
  
  return NextResponse.json({
    metrics,
    timestamp: new Date().toISOString()
  });
}
