import type { EventType } from '@/lib/hub-types';

interface EventTypesTableProps {
  eventTypes: EventType[];
}

export function EventTypesTable({ eventTypes }: EventTypesTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-fd-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-fd-border/50 bg-fd-muted/30">
            <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
              Event ID
            </th>
            <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
              Description
            </th>
            <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
              Frequency
            </th>
            <th className="px-4 py-2.5 text-left font-medium text-fd-muted-foreground">
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {eventTypes.map((event) => (
            <tr
              key={event.id}
              className="border-b border-fd-border/30 last:border-b-0"
            >
              <td className="px-4 py-2 font-mono text-xs text-fd-primary">
                {event.id}
              </td>
              <td className="px-4 py-2 text-fd-foreground">
                {event.description}
              </td>
              <td className="px-4 py-2 text-fd-muted-foreground">
                {event.frequency}
              </td>
              <td className="px-4 py-2">
                <span className="inline-flex rounded-full border border-fd-border/40 px-2 py-0.5 text-xs text-fd-muted-foreground/60">
                  {event.category}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
