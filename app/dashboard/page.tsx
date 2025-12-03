import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/crm-data-table"
import { SectionCards } from "@/components/section-cards"
import { AuthGuard } from "@/components/auth-guard"

import data from "./data.json"
import type { CampaignData } from "@/components/crm-data-table"

// Type assertion for the imported JSON data
const campaignData = data as CampaignData[]

function DashboardContent() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={campaignData} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
