import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { PlaybookRow } from "@/lib/owner-dashboard.functions";

export function QuickScriptsWidget({ playbooks }: { playbooks: PlaybookRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick playbooks</CardTitle>
      </CardHeader>
      <CardContent>
        {playbooks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No playbooks pinned for owner yet.</p>
        ) : (
          <Accordion type="single" collapsible>
            {playbooks.map((p) => (
              <AccordionItem key={p.id} value={p.id}>
                <AccordionTrigger className="text-sm font-medium">
                  {p.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {p.body}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
