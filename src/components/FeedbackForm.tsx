import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ref, push } from "firebase/database";
import { db } from "@/firebase";

import { toast } from "sonner";

interface FeedbackFormData {
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string;
}

export const FeedbackForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    rating: 0,
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    toast.error("Please enter your name");
    return;
  }
  if (!formData.email.trim() || !formData.email.includes("@")) {
    toast.error("Please enter a valid email address");
    return;
  }
  if (formData.rating === 0) {
    toast.error("Please select a rating");
    return;
  }
  if (!formData.category) {
    toast.error("Please select a category");
    return;
  }

  setIsSubmitting(true);

  try {
    const feedbackData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      rating: formData.rating,
      category: formData.category,
      message: formData.message.trim() || null,
      createdAt: new Date().toISOString()
    };

    await push(ref(db, "feedbacks"), feedbackData);

    toast.success("✅ Feedback submitted successfully!");
    setFormData({
      name: "",
      email: "",
      rating: 0,
      category: "",
      message: "",
    });

    onSuccess();
  } catch (error) {
    console.error("Firebase Error:", error);
    toast.error("❌ Failed to submit feedback");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Share Your Feedback</CardTitle>
        <CardDescription className="text-center text-lg">
          We value your opinion and would love to hear from you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= formData.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UI">UI</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="Feature">Feature</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us more about your experience..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
