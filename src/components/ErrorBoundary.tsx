
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Copy, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  timestamp: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      timestamp: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('ErrorBoundary caught an error:', error);
    return {
      hasError: true,
      error,
      timestamp: new Date().toISOString()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary details:', error, errorInfo);
    
    // Log additional environment info
    console.error('Environment info:', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      online: navigator.onLine,
      connection: (navigator as any).connection?.effectiveType || 'unknown'
    });

    this.setState({
      error,
      errorInfo,
      timestamp: new Date().toISOString()
    });

    // Show toast notification
    toast({
      title: "Anwendungsfehler aufgetreten",
      description: `${error.message} - Siehe Fehlerdetails unten`,
      variant: "destructive",
    });
  }

  copyErrorDetails = () => {
    const { error, errorInfo, timestamp } = this.state;
    const errorDetails = `
FEHLER-REPORT
=============
Zeit: ${timestamp}
URL: ${window.location.href}
Online: ${navigator.onLine}
User Agent: ${navigator.userAgent}
Verbindung: ${(navigator as any).connection?.effectiveType || 'unbekannt'}

FEHLER:
${error?.name}: ${error?.message}

STACK TRACE:
${error?.stack}

COMPONENT STACK:
${errorInfo?.componentStack}

ZUSÄTZLICHE INFO:
${JSON.stringify({
  props: Object.keys(this.props),
  state: this.state,
}, null, 2)}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
      toast({
        title: "Fehlerdetails kopiert",
        description: "Die Fehlerdetails wurden in die Zwischenablage kopiert",
      });
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, timestamp } = this.state;
      
      return (
        <div className="min-h-screen theme-bg p-4">
          <div className="max-w-4xl mx-auto">
            <Alert className="mb-6 border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-destructive">Anwendungsfehler</AlertTitle>
              <AlertDescription>
                Ein unerwarteter Fehler ist aufgetreten. Bitte kopiere die unten stehenden Details.
              </AlertDescription>
            </Alert>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Fehlerdetails
                </CardTitle>
                <CardDescription>
                  Zeit: {new Date(timestamp).toLocaleString('de-DE')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button onClick={this.copyErrorDetails} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Fehlerdetails kopieren
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Seite neu laden
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">Fehlermeldung:</h4>
                    <pre className="bg-muted p-3 rounded text-sm overflow-auto">
                      {error?.name}: {error?.message}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Umgebungsinfo:</h4>
                    <pre className="bg-muted p-3 rounded text-sm overflow-auto">
{`URL: ${window.location.href}
Online: ${navigator.onLine ? 'Ja' : 'Nein'}
Verbindung: ${(navigator as any).connection?.effectiveType || 'unbekannt'}
Browser: ${navigator.userAgent}`}
                    </pre>
                  </div>

                  <details className="space-y-2">
                    <summary className="font-semibold cursor-pointer hover:text-primary">
                      Stack Trace (zum Aufklappen)
                    </summary>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-60">
                      {error?.stack}
                    </pre>
                  </details>

                  <details className="space-y-2">
                    <summary className="font-semibold cursor-pointer hover:text-primary">
                      Component Stack (zum Aufklappen)
                    </summary>
                    <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-60">
                      {errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
