"use client";

import { useState, useEffect } from "react";
import { JobApplicationForm } from "../components/JobApplicationForm";
import { JobApplication } from "../lib/types";
import { JobApplicationCard } from "../components/JobApplicationCard";
import { StatsCard } from "../components/StatsCard";
import { ClientOnly } from "../components/ClientOnly";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Plus,
  Search,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

function JobTrackerContent() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<
    JobApplication | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load applications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("jobApplications");
    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("jobApplications", JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (application: Omit<JobApplication, "id">) => {
    const newApplication: JobApplication = {
      ...application,
      id: crypto.randomUUID(),
    };
    setApplications((prev) => [newApplication, ...prev]);
  };

  const handleEditApplication = (application: Omit<JobApplication, "id">) => {
    if (editingApplication) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === editingApplication.id
            ? { ...application, id: app.id }
            : app
        )
      );
      setEditingApplication(undefined);
    }
  };

  const handleDeleteApplication = (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    }
  };

  const openEditForm = (application: JobApplication) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingApplication(undefined);
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: applications.length,
    interviewing: applications.filter((app) => app.status === "interviewing")
      .length,
    offers: applications.filter(
      (app) => app.status === "offer" || app.status === "accepted"
    ).length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h1>Job Tracker</h1>
                <p className="text-muted-foreground text-sm">
                  Manage your job applications
                </p>
              </div>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            icon={Briefcase}
            iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="Interviewing"
            value={stats.interviewing}
            icon={Clock}
            iconColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          />
          <StatsCard
            title="Offers"
            value={stats.offers}
            icon={CheckCircle}
            iconColor="bg-green-500/10 text-green-600 dark:text-green-400"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            iconColor="bg-red-500/10 text-red-600 dark:text-red-400"
          />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, title, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2">No applications yet</h2>
            <p className="text-muted-foreground mb-6">
              Start tracking your job applications by adding your first one.
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Application
            </Button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <Alert>
            <Search className="h-4 w-4" />
            <AlertDescription>
              No applications match your search criteria. Try adjusting your
              filters.
            </AlertDescription>
          </Alert>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-4"
            }
          >
            {filteredApplications.map((application) => (
              <JobApplicationCard
                key={application.id}
                application={application}
                onEdit={openEditForm}
                onDelete={handleDeleteApplication}
              />
            ))}
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <JobApplicationForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={
          editingApplication ? handleEditApplication : handleAddApplication
        }
        initialData={editingApplication}
        mode={editingApplication ? "edit" : "add"}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b border-border bg-card sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h1>Job Tracker</h1>
                    <p className="text-muted-foreground text-sm">
                      Manage your job applications
                    </p>
                  </div>
                </div>
                <Button disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Application
                </Button>
              </div>
            </div>
          </header>

          {/* Loading state */}
          <main className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Briefcase className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mb-2">Loading...</h2>
              <p className="text-muted-foreground">
                Initializing your job application tracker.
              </p>
            </div>
          </main>
        </div>
      }
    >
      <JobTrackerContent />
    </ClientOnly>
  );
}
