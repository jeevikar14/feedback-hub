import { useState } from "react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { LatestFeedback } from "@/components/LatestFeedback";
import { MessageSquare } from "lucide-react";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeedbackSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12 px-4">
      <div className="container mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="flex justify-center">
            <MessageSquare className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Feedback Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us improve by sharing your thoughts and experiences
          </p>
        </header>

        <FeedbackForm onSuccess={handleFeedbackSuccess} />
        
        <LatestFeedback refresh={refreshKey} />
      </div>
    </div>
  );
};

export default Index;
