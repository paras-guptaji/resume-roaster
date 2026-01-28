import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { InterviewQuestion } from "@/types/resume";

interface InterviewQuestionsProps {
  questions: InterviewQuestion[];
}

export function InterviewQuestions({ questions }: InterviewQuestionsProps) {
  const { toast } = useToast();

  const handleCopy = async (question: InterviewQuestion) => {
    const text = `Q: ${question.question}\n\nContext: ${question.context}\n\nIdeal Answer: ${question.idealAnswer}`;
    await navigator.clipboard.writeText(text);
    toast({
      title: "Question copied! 📋",
      description: "Prepare your answer",
    });
  };

  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          🎤 Interview Questions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Questions interviewers will likely ask based on YOUR resume
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-3">
          {questions.map((question, index) => (
            <AccordionItem
              key={index}
              value={`question-${index}`}
              className="border border-border/50 rounded-lg px-4 bg-card/50"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{question.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="pl-10 space-y-4">
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Why they'll ask this
                    </h5>
                    <p className="text-sm text-foreground">{question.context}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Ideal Answer Framework
                      </h5>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(question)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground bg-accent/30 p-3 rounded-md">
                      {question.idealAnswer}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
