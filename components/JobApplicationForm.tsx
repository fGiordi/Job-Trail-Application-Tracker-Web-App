import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { JobApplication } from "@/lib/types";

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: Omit<JobApplication, "id">) => void;
  initialData?: JobApplication;
  mode: "add" | "edit";
}

export function JobApplicationForm({ isOpen, onClose, onSubmit, initialData, mode }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<Omit<JobApplication, "id">>({
    company: initialData?.company || "",
    title: initialData?.title || "",
    dateApplied: initialData?.dateApplied || new Date().toISOString().split("T")[0],
    status: initialData?.status || "applied",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof Omit<JobApplication, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Job Application" : "Edit Job Application"}</DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Fill in the details of your new job application." 
              : "Update the details of your job application."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="e.g., Google"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date Applied *</Label>
              <Input
                id="dateApplied"
                type="date"
                value={formData.dateApplied}
                onChange={(e) => handleChange("dateApplied", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                placeholder="e.g., $120k - $150k"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add any additional notes..."
              className="w-full min-h-24 px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Application" : "Update Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
