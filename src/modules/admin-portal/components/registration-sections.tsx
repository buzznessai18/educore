import { useFormContext, useFieldArray, type Control, type FieldPath } from "react-hook-form";
import { Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BLOOD_GROUP_OPTIONS,
  BOARD_OPTIONS,
  CATEGORY_OPTIONS,
  CLASS_OPTIONS,
  FEES_CATEGORY_OPTIONS,
  HOSTEL_OPTIONS,
  QUOTA_OPTIONS,
  REFERRAL_OPTIONS,
  ROOM_SHARING_OPTIONS,
  ROOM_TYPE_OPTIONS,
  SECTION_OPTIONS,
  STATE_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  TRANSPORT_MONTHS,
  TRANSPORT_ROUTE_OPTIONS,
} from "@/modules/admin-portal/constants";
import type { AdmissionFormValues } from "@/modules/admin-portal/schemas";
import { FieldGrid, PortalSection } from "@/modules/admin-portal/components/portal-ui";

function TextInput({
  control,
  name,
  label,
  type = "text",
}: {
  control: Control<AdmissionFormValues>;
  name: FieldPath<AdmissionFormValues>;
  label: string;
  type?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TextSelect({
  control,
  name,
  label,
  options,
  placeholder = "Select",
}: {
  control: Control<AdmissionFormValues>;
  name: FieldPath<AdmissionFormValues>;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={typeof field.value === "string" ? field.value : ""}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function ChildInformationSection() {
  const { control, setValue, watch } = useFormContext<AdmissionFormValues>();
  const photoUrl = watch("child.photoUrl");

  return (
    <PortalSection
      title="Child's Information"
      description="Core identity, academic placement, and student profile fields."
    >
      <FieldGrid cols={4}>
        <TextInput control={control} name="child.registrationDate" label="Registration Date" type="date" />
        <TextInput control={control} name="child.admissionStartDate" label="Admission Start Date" type="date" />
        <TextSelect
          control={control}
          name="child.programTrack"
          label="School / UG / PG"
          options={[
            { value: "school", label: "School" },
            { value: "ug", label: "UG" },
            { value: "pg", label: "PG" },
          ]}
        />
        <TextSelect control={control} name="child.state" label="State" options={STATE_OPTIONS} />
        <TextSelect control={control} name="child.boardUniversity" label="Board / University" options={BOARD_OPTIONS} />
        <TextInput control={control} name="child.syllabusBranch" label="Syllabus / Branch" />
        <TextInput control={control} name="child.levelCombination" label="Level / Combination" />
        <TextSelect control={control} name="child.classId" label="Select Class" options={CLASS_OPTIONS} />
        <TextSelect control={control} name="child.sectionId" label="Sections" options={SECTION_OPTIONS} />
        <TextInput control={control} name="child.admissionNo" label="Admission No" />
        <TextInput control={control} name="child.rollNo" label="Roll No" />
        <TextInput control={control} name="child.firstName" label="Student First Name" />
        <TextInput control={control} name="child.middleName" label="Student Middle Name" />
        <TextInput control={control} name="child.lastName" label="Student Last Name" />
        <TextInput control={control} name="child.dateOfBirth" label="Date of Birth" type="date" />
        <FormField
          control={control}
          name="child.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap gap-4 pt-2"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm text-foreground">
                      <RadioGroupItem value={option.value} />
                      {option.label}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TextSelect control={control} name="child.studentCategory" label="Student Category" options={CATEGORY_OPTIONS} />
        <TextSelect control={control} name="child.feesCategory" label="Fees Category" options={FEES_CATEGORY_OPTIONS} />
        <TextSelect control={control} name="child.quota" label="Quota" options={QUOTA_OPTIONS} />
        <TextInput control={control} name="child.uidNumber" label="UID Number" />
        <TextInput control={control} name="child.satsNumber" label="SATs Number" />
        <TextInput control={control} name="child.penNumber" label="Pen Number" />
        <TextInput control={control} name="child.email" label="Student Email" type="email" />
        <TextInput control={control} name="child.religion" label="Student Religion" />
        <TextInput control={control} name="child.caste" label="Student Caste" />
        <TextInput control={control} name="child.subCaste" label="Sub Caste" />
        <TextSelect control={control} name="child.bloodGroup" label="Blood Group" options={BLOOD_GROUP_OPTIONS} />
        <TextInput control={control} name="child.deviceId" label="Device ID" />
        <TextSelect control={control} name="child.studentStatus" label="Student Status" options={STUDENT_STATUS_OPTIONS} />
        <TextInput control={control} name="child.motherTongue" label="Mother Tongue" />
        <TextInput control={control} name="child.placeOfBirth" label="Place of Birth" />
        <TextInput control={control} name="child.languageI" label="Language I" />
        <TextInput control={control} name="child.languageII" label="Language II" />
        <TextInput control={control} name="child.previousSchool" label="Previous School" />
        <TextInput control={control} name="child.password" label="Password" type="password" />
      </FieldGrid>

      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid size-20 place-items-center overflow-hidden rounded-md border border-border bg-card text-xs text-muted-foreground">
            {photoUrl ? (
              <img src={photoUrl} alt="Student preview" className="size-full object-cover" />
            ) : (
              "Photo"
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Upload Photo</p>
            <p className="text-xs text-muted-foreground">JPG or PNG, max 2 MB. Mock upload stores a local preview URL.</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
              <Upload className="size-4" />
              Choose file
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  setValue("child.photoUrl", url, { shouldDirty: true });
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </PortalSection>
  );
}

function ParentFields({ prefix, title }: { prefix: "family.father" | "family.mother"; title: string }) {
  const { control } = useFormContext<AdmissionFormValues>();
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <FieldGrid cols={3}>
        <TextInput control={control} name={`${prefix}.firstName`} label="First Name" />
        <TextInput control={control} name={`${prefix}.middleName`} label="Middle Name" />
        <TextInput control={control} name={`${prefix}.lastName`} label="Last Name" />
        <TextInput control={control} name={`${prefix}.occupation`} label="Occupation" />
        <TextInput control={control} name={`${prefix}.employer`} label="Employer" />
        <TextInput control={control} name={`${prefix}.mobileNo`} label="Mobile No" />
        <TextInput control={control} name={`${prefix}.workPhone`} label="Work Phone" />
        <TextInput control={control} name={`${prefix}.otherPhone`} label="Other Phone" />
        <TextInput control={control} name={`${prefix}.email`} label="Email" type="email" />
      </FieldGrid>
    </div>
  );
}

export function FamilyInformationSection() {
  const { control } = useFormContext<AdmissionFormValues>();
  const siblings = useFieldArray({ control, name: "family.siblings" });

  return (
    <PortalSection title="Family Information" description="Parents, address, and sibling details.">
      <ParentFields prefix="family.father" title="Father's Details" />
      <ParentFields prefix="family.mother" title="Mother's Details" />
      <FieldGrid cols={1}>
        <FormField
          control={control}
          name="family.homeAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Address</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="family.postalAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Address</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TextInput control={control} name="family.smsNumber" label="SMS Number" />
      </FieldGrid>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">Sibling Details</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              siblings.append({
                id: `sib-${Date.now()}`,
                name: "",
                className: "",
                dateOfBirth: "",
              })
            }
          >
            <Plus className="size-4" />
            Add Sibling
          </Button>
        </div>
        {siblings.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No siblings added.</p>
        ) : (
          siblings.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <TextInput control={control} name={`family.siblings.${index}.name`} label="Sibling Name" />
              <TextInput control={control} name={`family.siblings.${index}.className`} label="Sibling Class" />
              <TextInput control={control} name={`family.siblings.${index}.dateOfBirth`} label="Sibling DOB" type="date" />
              <div className="flex items-end">
                <Button type="button" variant="ghost" size="icon" onClick={() => siblings.remove(index)} aria-label="Remove sibling">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </PortalSection>
  );
}

export function EmergencyContactsSection() {
  const { control } = useFormContext<AdmissionFormValues>();
  const contacts = useFieldArray({ control, name: "emergencyContacts" });

  return (
    <PortalSection title="Emergency Contacts" description="Primary contacts for urgent communication.">
      <div className="space-y-3">
        {contacts.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
            <TextInput control={control} name={`emergencyContacts.${index}.name`} label="Contact Name" />
            <TextInput control={control} name={`emergencyContacts.${index}.phone`} label="Phone Number" />
            <TextInput control={control} name={`emergencyContacts.${index}.relationship`} label="Relationship to Child" />
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={contacts.fields.length <= 1}
                onClick={() => contacts.remove(index)}
                aria-label="Remove emergency contact"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => contacts.append({ id: `ec-${Date.now()}`, name: "", phone: "", relationship: "" })}
        >
          <Plus className="size-4" />
          Add Contact
        </Button>
      </div>
    </PortalSection>
  );
}

export function ReferralSection() {
  const { control } = useFormContext<AdmissionFormValues>();

  return (
    <PortalSection title="How did you hear about us?" description="Capture referral attribution for admissions analytics.">
      <FormField
        control={control}
        name="referralSources"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-wrap gap-4">
              {REFERRAL_OPTIONS.map((option) => {
                const checked = field.value?.includes(option.value);
                return (
                  <label key={option.value} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => {
                        const next = new Set(field.value ?? []);
                        if (value === true) next.add(option.value);
                        else next.delete(option.value);
                        field.onChange([...next]);
                      }}
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </PortalSection>
  );
}

export function TransportDetailsSection() {
  const { control, setValue, watch } = useFormContext<AdmissionFormValues>();
  const months = watch("transport.months") ?? [];

  const toggleAll = (selectAll: boolean) => {
    setValue("transport.months", selectAll ? TRANSPORT_MONTHS.map((month) => month.value) : [], {
      shouldDirty: true,
    });
  };

  return (
    <PortalSection
      title="Transport Details"
      description="Assign route and select months for transport fee billing."
      actions={
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => toggleAll(true)}>
            Select All
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => toggleAll(false)}>
            Deselect All
          </Button>
        </div>
      }
    >
      <FieldGrid cols={2}>
        <TextSelect control={control} name="transport.routeId" label="Route" options={TRANSPORT_ROUTE_OPTIONS} />
      </FieldGrid>
      <FormField
        control={control}
        name="transport.months"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transport Fees Months</FormLabel>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TRANSPORT_MONTHS.map((month) => {
                const checked = months.includes(month.value);
                return (
                  <label key={month.value} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => {
                        const next = new Set(field.value ?? []);
                        if (value === true) next.add(month.value);
                        else next.delete(month.value);
                        field.onChange([...next]);
                      }}
                    />
                    {month.label}
                  </label>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </PortalSection>
  );
}

export function HostelDetailsSection() {
  const { control } = useFormContext<AdmissionFormValues>();

  return (
    <PortalSection title="Hostel Details" description="Optional residential boarding assignment.">
      <FieldGrid cols={3}>
        <TextSelect control={control} name="hostel.hostelId" label="Hostel" options={HOSTEL_OPTIONS} />
        <TextSelect control={control} name="hostel.roomType" label="Room Type" options={ROOM_TYPE_OPTIONS} />
        <TextSelect control={control} name="hostel.roomSharing" label="Room Sharing" options={ROOM_SHARING_OPTIONS} />
      </FieldGrid>
    </PortalSection>
  );
}

export function ModulePlaceholder({ title }: { title: string }) {
  return (
    <PortalSection title={title} description={`${title} module layout is scaffolded for Phase 2 data wiring.`}>
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        Content area for {title}. Connect APIs and workflows in the next iteration.
      </div>
    </PortalSection>
  );
}
