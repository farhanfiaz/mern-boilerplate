import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Users,
  Shield,
  Building2,
  Activity,
  Plus,
  ArrowUpRight,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    icon: Users,
    trend: "+12%",
  },
  {
    title: "Active Roles",
    value: "8",
    icon: Shield,
    trend: "+2",
  },
  {
    title: "Tenants",
    value: "5",
    icon: Building2,
    trend: "+1",
  },
  {
    title: "System Health",
    value: "99.9%",
    icon: Activity,
    trend: "Stable",
  },
];

const recentUsers = [
  { name: "John Admin", email: "john@demo.com", status: "Active" },
  { name: "Sarah Khan", email: "sarah@demo.com", status: "Active" },
  { name: "Mike Lee", email: "mike@demo.com", status: "Inactive" },
];

const activities = [
  "New user registered",
  "Role updated: Moderator",
  "Tenant created: Acme Corp",
  "User permission changed",
];

/* ---------------- DASHBOARD ---------------- */

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your system performance
          </p>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Quick Action
        </Button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <Card key={i} className="rounded-xl border bg-white">

              <CardContent className="p-5 space-y-3">

                <div className="flex items-center justify-between">

                  <Icon className="h-5 w-5 text-gray-500" />

                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>

                </div>

                <div>
                  <div className="text-2xl font-bold">
                    {stat.value}
                  </div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>
                </div>

              </CardContent>

            </Card>
          );
        })}

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* USERS TABLE */}
        <Card className="lg:col-span-2 rounded-xl">

          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>

          <CardContent>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentUsers.map((u, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {u.name}
                    </TableCell>

                    <TableCell>{u.email}</TableCell>

                    <TableCell>
                      <Badge>
                        {u.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </CardContent>
        </Card>

        {/* ACTIVITY PANEL */}
        <Card className="rounded-xl">

          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {activities.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{a}</span>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}

          </CardContent>

        </Card>

      </div>

      {/* CHART PLACEHOLDER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="rounded-xl h-64 flex items-center justify-center">
          <p className="text-gray-400">📊 Revenue Chart (Add Recharts here)</p>
        </Card>

        <Card className="rounded-xl h-64 flex items-center justify-center">
          <p className="text-gray-400">📈 User Growth Chart</p>
        </Card>

      </div>

    </div>
  );
}