import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { onValue, ref } from "firebase/database";
import { db } from "@/firebase";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { onValue, ref } from "firebase/database";
import { db } from "@/firebase";

interface Feedback {
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string | null;
  createdAt: string;
}

export const LatestFeedback = ({ refresh }: { refresh: number }) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const feedbackRef = ref(db, "feedbacks");

    onValue(feedbackRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val();

      if (!data) {
        setFeedback(null);
        return;
      }

      // Convert object to array and get latest
      const feedbackArray: Feedback[] = Object.values(data);
      const latest = feedbackArray.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      setFeedback(latest);
    });
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
            <p className="font-semibold text-lg">{feedback.name}</p>
            <p className="text-sm text-muted-foreground">{feedback.email}</p>
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
          Submitted {new Date(feedback.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};

