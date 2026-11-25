import { SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={<SearchX />}
        title="We couldn't find that page"
        description="The asset, pool or page you're looking for doesn't exist in this prototype."
        action={<Button href="/dashboard" variant="primary">Back to dashboard</Button>}
      />
    </Card>
  );
}
