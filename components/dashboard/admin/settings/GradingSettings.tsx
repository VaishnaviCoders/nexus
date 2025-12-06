"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface GradeScale {
  id: string
  grade: string
  minScore: number
  maxScore: number
}

export function GradingSettings() {
  const [passingGradeEnabled, setPassingGradeEnabled] = useState(true)
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([
    { id: "1", grade: "A+", minScore: 97, maxScore: 100 },
    { id: "2", grade: "A", minScore: 93, maxScore: 96 },
    { id: "3", grade: "A-", minScore: 90, maxScore: 92 },
    { id: "4", grade: "B+", minScore: 87, maxScore: 89 },
    { id: "5", grade: "B", minScore: 83, maxScore: 86 },
    { id: "6", grade: "B-", minScore: 80, maxScore: 82 },
    { id: "7", grade: "C+", minScore: 77, maxScore: 79 },
    { id: "8", grade: "C", minScore: 73, maxScore: 76 },
    { id: "9", grade: "C-", minScore: 70, maxScore: 72 },
    { id: "10", grade: "D", minScore: 60, maxScore: 69 },
    { id: "11", grade: "F", minScore: 0, maxScore: 59 },
  ])

  const removeGrade = (id: string) => {
    setGradeScale(gradeScale.filter((g) => g.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Grading System</h2>
        <p className="text-sm text-muted-foreground">
          Configure grading scales and assessment criteria.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Grading Scale</CardTitle>
          <CardDescription>Select the default grading system for assessments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="letter">
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select grading scale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="letter">Letter Grade (A-F)</SelectItem>
              <SelectItem value="percentage">Percentage (0-100%)</SelectItem>
              <SelectItem value="gpa">GPA (0.0-4.0)</SelectItem>
              <SelectItem value="custom">Custom Scale</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passing Grade Threshold</CardTitle>
          <CardDescription>Enable and set the minimum passing grade requirement.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <Label htmlFor="passing-grade" className="text-sm text-muted-foreground">
                Enable passing grade
              </Label>
              <Switch id="passing-grade" checked={passingGradeEnabled} onCheckedChange={setPassingGradeEnabled} />
            </div>
            {passingGradeEnabled && (
              <div className="flex items-center gap-3">
                <Input type="number" defaultValue="60" className="max-w-32" />
                <span className="text-sm text-muted-foreground">minimum score to pass</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade Scale Configuration</CardTitle>
          <CardDescription>Customize the grade boundaries for your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2 border-b">
              <span>Grade</span>
              <span>Min Score</span>
              <span>Max Score</span>
              <span></span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {gradeScale.map((grade) => (
                <div key={grade.id} className="grid grid-cols-4 gap-3 items-center">
                  <Input defaultValue={grade.grade} className="h-9" />
                  <Input type="number" defaultValue={grade.minScore} className="h-9" />
                  <Input type="number" defaultValue={grade.maxScore} className="h-9" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => removeGrade(grade.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Grade
          </Button>
          <Button size="sm">Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GPA Calculation Method</CardTitle>
          <CardDescription>Choose how GPA should be calculated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="weighted">
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select calculation method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weighted">Weighted Average</SelectItem>
              <SelectItem value="unweighted">Unweighted Average</SelectItem>
              <SelectItem value="credit-hours">Credit Hours Based</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
