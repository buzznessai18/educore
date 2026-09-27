import { useMemo, useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type QuestionRow = {
  id: string;
  question: string;
  className: string;
};

const CLASS_OPTIONS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "LKG", "UKG", "NURSERY"];

export function FeedbackQuestionnaireSettingsPage() {
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [className, setClassName] = useState("none");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.question, row.className].join(" ").toLowerCase().includes(q),
    );
  }, [rows, query]);

  const openNew = () => {
    setEditingId(null);
    setQuestion("");
    setClassName("none");
    setDialogOpen(true);
  };

  const openEdit = (row: QuestionRow) => {
    setEditingId(row.id);
    setQuestion(row.question);
    setClassName(row.className);
    setDialogOpen(true);
  };

  const handleFind = () => {
    setQuery(search);
  };

  const handleSave = () => {
    const trimmed = question.trim();
    if (!trimmed) {
      toast.error("Question is required");
      return;
    }
    if (className === "none") {
      toast.error("Class is required");
      return;
    }

    if (editingId) {
      setRows((current) =>
        current.map((row) =>
          row.id === editingId ? { ...row, question: trimmed, className } : row,
        ),
      );
      toast.success("Question updated");
    } else {
      setRows((current) => [
        { id: `fq-${Date.now()}`, question: trimmed, className },
        ...current,
      ]);
      toast.success("Question saved");
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Question deleted");
  };

  return (
    <div className="relative mx-auto max-w-[1400px] space-y-4 pb-16">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <span>Search :</span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleFind();
            }}
            className="h-9 w-64 bg-card"
            aria-label="Search feedback questions"
          />
        </label>
        <Button
          type="button"
          className="h-9 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          onClick={handleFind}
        >
          Find
        </Button>
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-enterprise-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">FeedBack Questionairre</h2>
          <Button
            type="button"
            className="h-9 gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            onClick={openNew}
          >
            <Plus className="size-4" />
            New
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-20 text-xs font-bold">SLNo</TableHead>
                  <TableHead className="text-xs font-bold">Question</TableHead>
                  <TableHead className="w-36 text-xs font-bold">Class</TableHead>
                  <TableHead className="w-36 text-center text-xs font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center text-sm text-muted-foreground">
                      No data available in table
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(index % 2 === 1 ? "bg-info-soft/50" : "bg-card")}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{row.question}</TableCell>
                      <TableCell>{row.className}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-info text-white hover:bg-info/90"
                            aria-label={`Edit question ${index + 1}`}
                            onClick={() => openEdit(row)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            className="size-8 rounded-full bg-danger text-white hover:bg-danger/90"
                            aria-label={`Delete question ${index + 1}`}
                            onClick={() => handleDelete(row.id)}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Question" : "New Question"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <label className="space-y-1.5 text-sm">
              <span>Question</span>
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                aria-label="Question"
              />
            </label>
            <label className="space-y-1.5 text-sm">
              <span>Class</span>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger aria-label="Class">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">--Select--</SelectItem>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
