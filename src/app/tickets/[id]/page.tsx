import TicketDetailContainer from "@/container/ticket-detail";
import { use } from "react";

export default function TicketsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TicketDetailContainer params={{ id }} />;
}
