
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center theme-bg">
      <div className="text-center p-6">
        <h1 className="text-6xl font-bold mb-4 theme-text">404</h1>
        <p className="text-xl theme-text-muted mb-6">Seite nicht gefunden</p>
        <p className="theme-text-muted mb-8">
          Die angeforderte Seite konnte nicht gefunden werden.
        </p>
        <Link to="/">
          <Button variant="default" size="lg">
            Zurück zur Startseite
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
