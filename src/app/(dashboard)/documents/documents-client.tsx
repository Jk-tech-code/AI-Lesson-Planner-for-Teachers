"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Search,
  MoreVertical,
  Trash2,
  Download,
  FolderOpen,
  Share2,
  Copy,
  CalendarCheck,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  FileSpreadsheet,
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Document, Folder } from "@prisma/client"

const typeIcons: Record<string, React.ElementType> = {
  SCHEME_OF_WORK: CalendarCheck,
  LESSON_PLAN: BookOpen,
  EXAM: GraduationCap,
  ASSESSMENT: ClipboardCheck,
  WORKSHEET: FileSpreadsheet,
  LESSON_NOTE: FileText,
  HOMEWORK: FileText,
  MARKING_SCHEME: ClipboardCheck,
}

export function DocumentsClient({
  documents,
  folders,
}: {
  documents: Document[]
  folders: Folder[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [folderFilter, setFolderFilter] = useState<string>("all")

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    const matchesFolder = folderFilter === "all" || doc.folderId === folderFilter
    return matchesSearch && matchesType && matchesFolder
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage your generated documents
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="SCHEME_OF_WORK">Schemes of Work</SelectItem>
            <SelectItem value="LESSON_PLAN">Lesson Plans</SelectItem>
            <SelectItem value="LESSON_NOTE">Lesson Notes</SelectItem>
            <SelectItem value="WORKSHEET">Worksheets</SelectItem>
            <SelectItem value="HOMEWORK">Homework</SelectItem>
            <SelectItem value="ASSESSMENT">Assessments</SelectItem>
            <SelectItem value="EXAM">Exams</SelectItem>
            <SelectItem value="MARKING_SCHEME">Marking Schemes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={folderFilter} onValueChange={(v) => setFolderFilter(v ?? "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All folders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Folders</SelectItem>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Document Grid */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => {
            const Icon = typeIcons[doc.type] || FileText
            return (
              <Card key={doc.id} className="group cursor-pointer hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium leading-tight">
                          {doc.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {doc.type.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {}}>
                            <Download className="mr-2 h-4 w-4" /> Export
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => {}}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {doc.subject && (
                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                        {doc.subject}
                      </span>
                      {doc.gradeLevel && (
                        <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-950 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                          {doc.gradeLevel.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Created {formatDate(doc.createdAt)}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
