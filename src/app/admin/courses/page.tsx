"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Course = {
  id: number;
  name: string;
  difficulty: string;
  description: string;
  image_url: string;
  created_at: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({
    name: "",
    difficulty: "low",
    description: "",
    image_url: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = useSupabase();

  useEffect(() => {
    if (supabase) {
      fetchCourses();
    }
  }, [supabase]);

  async function fetchCourses() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
      return;
    }

    setCourses(data || []);
    setLoading(false);
  }

  async function createCourse() {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("courses").insert([newCourse]);

    if (error) {
      console.error("Error creating course:", error);
      return;
    }

    setIsOpen(false);
    setNewCourse({
      name: "",
      difficulty: "low",
      description: "",
      image_url: "",
    });
    await fetchCourses();
    setLoading(false);
  }

  async function deleteCourse(id: number) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting course:", error);
      return;
    }

    await fetchCourses();
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Course</Button>
          </DialogTrigger>
          <DialogContent className="bg-[rgb(25,45,54)] text-white">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={newCourse.difficulty}
                  onValueChange={(value) =>
                    setNewCourse({ ...newCourse, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              <Button
                onClick={createCourse}
                className="w-full"
                disabled={loading}
              >
                Create Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link href={`/admin/courses/${course.id}`} key={course.id}>
              <Card className="p-6 space-y-4 hover:bg-white/5 transition-colors bg-[rgb(35,55,64)] border-white/10 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{course.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">
                      Difficulty: {course.difficulty}
                    </p>
                    {course.description && (
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteCourse(course.id);
                    }}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
