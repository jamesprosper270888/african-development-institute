import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Enquiry = {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: Date;
};

export function EnquiryFeed({ enquiries }: { enquiries: Enquiry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Enquiries</CardTitle>
      </CardHeader>
      <CardContent>
        {enquiries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No enquiries yet</p>
        ) : (
          <div className="space-y-3">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{enq.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {enq.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {enq.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
