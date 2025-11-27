import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackWithUser {
  id: string;
  rating: number;
  category: string;
  message: string | null;
  created_at: string;
  users: {
    name: string;
    email: string;
  };
}

export const LatestFeedback = ({ refresh }: { refresh: number }) => {
  const [feedback, setFeedback] = useState<FeedbackWithUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestFeedback = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select(`
            id,
            rating,
            category,
            message,
            created_at,
            users (
              name,
              email
            )
          `)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching feedback:", error);
          return;
        }

        setFeedback(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestFeedback();
  }, [refresh]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (!feedback) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No feedback yet. Be the first to share!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Most Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">{feedback.users.name}</p>
            <p className="text-sm text-muted-foreground">{feedback.users.email}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {feedback.category}
          </Badge>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= feedback.rating
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>

        {feedback.message && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm italic">&ldquo;{feedback.message}&rdquo;</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Submitted {new Date(feedback.created_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};
