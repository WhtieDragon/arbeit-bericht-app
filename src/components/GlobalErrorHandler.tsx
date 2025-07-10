
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const GlobalErrorHandler = () => {
  useEffect(() => {
    // Handle uncaught JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error);
      console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      });

      const errorInfo = `
JAVASCRIPT FEHLER
================
Nachricht: ${event.message}
Datei: ${event.filename}
Zeile: ${event.lineno}:${event.colno}
Zeit: ${new Date().toISOString()}
URL: ${window.location.href}
Online: ${navigator.onLine}
Verbindung: ${(navigator as any).connection?.effectiveType || 'unbekannt'}

Stack Trace:
${event.error?.stack || 'Nicht verfügbar'}
      `.trim();

      toast({
        title: "JavaScript Fehler",
        description: `${event.message} - Drücke F12 für Details`,
        variant: "destructive",
        action: {
          altText: "Kopieren",
          onClick: () => {
            navigator.clipboard.writeText(errorInfo).then(() => {
              toast({
                title: "Fehlerinfo kopiert",
                description: "Die Fehlerdetails wurden kopiert",
              });
            });
          },
        } as any,
      });
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      console.error('Rejection details:', {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      });

      const rejectionInfo = `
PROMISE REJECTION
================
Grund: ${event.reason}
Zeit: ${new Date().toISOString()}
URL: ${window.location.href}
Online: ${navigator.onLine}
Verbindung: ${(navigator as any).connection?.effectiveType || 'unbekannt'}

Details:
${typeof event.reason === 'object' ? JSON.stringify(event.reason, null, 2) : event.reason}
      `.trim();

      toast({
        title: "Promise Rejection",
        description: `${event.reason} - Drücke F12 für Details`,
        variant: "destructive",
        action: {
          altText: "Kopieren",
          onClick: () => {
            navigator.clipboard.writeText(rejectionInfo).then(() => {
              toast({
                title: "Fehlerinfo kopiert",
                description: "Die Fehlerdetails wurden kopiert",
              });
            });
          },
        } as any,
      });
    };

    // Network status monitoring
    const handleOnline = () => {
      console.log('Network: Online');
      toast({
        title: "Verbindung wiederhergestellt",
        description: "Die Internetverbindung ist wieder aktiv",
      });
    };

    const handleOffline = () => {
      console.log('Network: Offline');
      toast({
        title: "Keine Internetverbindung",
        description: "Die App funktioniert offline, aber Daten werden nicht synchronisiert",
        variant: "destructive",
      });
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Log initial state
    console.log('GlobalErrorHandler initialized:', {
      online: navigator.onLine,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
};
