import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMISSION_MODULE_TABS } from "@/modules/admin-portal/constants";
import { useAdmissionFormDefaults, useUpsertAdmission } from "@/modules/admin-portal/hooks";
import {
  admissionFormSchema,
  createEmptyAdmissionForm,
  type AdmissionFormValues,
} from "@/modules/admin-portal/schemas";
import {
  ChildInformationSection,
  EmergencyContactsSection,
  FamilyInformationSection,
  HostelDetailsSection,
  ModulePlaceholder,
  ReferralSection,
  TransportDetailsSection,
} from "@/modules/admin-portal/components/registration-sections";

export function AdmissionRegistrationForm({ studentId }: { studentId?: string }) {
  const navigate = useNavigate();
  const isEdit = Boolean(studentId);
  const { formValues, isLoading, isError } = useAdmissionFormDefaults(studentId);
  const upsert = useUpsertAdmission();
  const [activeTab, setActiveTab] = useState("registration");

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: createEmptyAdmissionForm(),
    mode: "onBlur",
  });

  useEffect(() => {
    if (formValues) {
      form.reset(formValues);
    } else if (!studentId) {
      form.reset(createEmptyAdmissionForm());
    }
  }, [formValues, studentId, form]);

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        const payload = {
          applicationDate: values.applicationDate,
          listStatus: values.listStatus,
          child: values.child,
          family: values.family,
          emergencyContacts: values.emergencyContacts,
          referralSources: values.referralSources,
          transport: values.transport,
          hostel: values.hostel,
          ...(studentId ? { id: studentId } : {}),
        };
        const record = await upsert.mutateAsync(payload);
        toast.success(isEdit ? "Admission updated" : "Admission registered");
        void navigate({
          to: "/admissions/registration/$studentId",
          params: { studentId: record.id },
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save admission");
      }
    },
    () => {
      setActiveTab("registration");
      toast.error("Please fix validation errors in Registration");
    },
  );

  if (isEdit && isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[640px] w-full rounded-lg" />
      </div>
    );
  }

  if (isEdit && isError) {
    return (
      <div className="mx-auto max-w-7xl rounded-lg border border-border p-8 text-sm text-muted-foreground">
        Unable to load student admission record.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary-soft bg-primary-soft text-primary">
              Admissions
            </Badge>
            <Badge variant="outline">{isEdit ? "Edit Admission" : "New Registration"}</Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-normal text-foreground">
            {isEdit ? "Edit Student Admission" : "Student Registration / Admission Form"}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Multi-section admission workspace with registration as the primary editable module. Other
            tabs are scaffolded for future academic workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void navigate({ to: "/admissions/applied" })}>
            Back to Applied
          </Button>
          <Button type="submit" form="admission-registration-form" disabled={upsert.isPending}>
            {upsert.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {upsert.isPending ? "Saving…" : "Save Admission"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form id="admission-registration-form" className="space-y-5" onSubmit={onSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-md bg-muted p-1">
              {ADMISSION_MODULE_TABS.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="registration" className="mt-5 space-y-5">
              <ChildInformationSection />
              <FamilyInformationSection />
              <EmergencyContactsSection />
              <ReferralSection />
              <TransportDetailsSection />
              <HostelDetailsSection />
            </TabsContent>

            <TabsContent value="medical" className="mt-5">
              <ModulePlaceholder title="Medical Form" />
            </TabsContent>
            <TabsContent value="documents" className="mt-5">
              <ModulePlaceholder title="Documents" />
            </TabsContent>
            <TabsContent value="fees" className="mt-5">
              <ModulePlaceholder title="Fees" />
            </TabsContent>
            <TabsContent value="attendance" className="mt-5">
              <ModulePlaceholder title="Attendance" />
            </TabsContent>
            <TabsContent value="marks" className="mt-5">
              <ModulePlaceholder title="Marks" />
            </TabsContent>
            <TabsContent value="lesson_update" className="mt-5">
              <ModulePlaceholder title="Lesson Update" />
            </TabsContent>
            <TabsContent value="assignment" className="mt-5">
              <ModulePlaceholder title="Assignment" />
            </TabsContent>
            <TabsContent value="feedback" className="mt-5">
              <ModulePlaceholder title="Feedback" />
            </TabsContent>
            <TabsContent value="observations" className="mt-5">
              <ModulePlaceholder title="Student Observations" />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
