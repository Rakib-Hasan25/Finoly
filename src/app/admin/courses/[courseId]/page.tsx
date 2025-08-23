"use client";

import { useState, useEffect } from "react";
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
import { useSupabase } from "@/lib/hooks/useSupabase";
import { useParams } from "next/navigation";
import Link from "next/link";

type Level = {
  id: number;
  title: string;
  level_no: number;
  course_id: number;
  created_at: string;
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const supabase = useSupabase();
  const [course, setCourse] = useState<Course | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [newLevel, setNewLevel] = useState({ title: "", level_no: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supabase && courseId) {
      fetchCourse();
      fetchLevels();
    }
  }, [supabase, courseId]);

  async function fetchCourse() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) {
      console.error("Error fetching course:", error);
      return;
    }

    setCourse(data);
  }

  async function fetchLevels() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("levels")
      .select("*")
      .eq("course_id", courseId)
      .order("level_no", { ascending: true });

    if (error) {
      console.error("Error fetching levels:", error);
      return;
    }

    setLevels(data || []);
    setLoading(false);
  }

  async function createLevel() {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("levels").insert([
      {
        title: newLevel.title,
        level_no: parseInt(newLevel.level_no),
        course_id: parseInt(courseId),
      },
    ]);

    if (error) {
      console.error("Error creating level:", error);
      return;
    }

    setIsOpen(false);
    setNewLevel({ title: "", level_no: "" });
    await fetchLevels();
    setLoading(false);
  }

  async function deleteLevel(id: number) {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from("levels").delete().eq("id", id);

    if (error) {
      console.error("Error deleting level:", error);
      return;
    }

    await fetchLevels();
    setLoading(false);
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-gray-400 mt-1">Difficulty: {course.difficulty}</p>
          {course.description && (
            <p className="text-gray-400 mt-2">{course.description}</p>
          )}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Level</Button>
          </DialogTrigger>
          <DialogContent className="bg-[rgb(25,45,54)] text-white">
            <DialogHeader>
              <DialogTitle>Create New Level</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new level to {course.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Level Title</Label>
                <Input
                  id="title"
                  value={newLevel.title}
                  onChange={(e) =>
                    setNewLevel({ ...newLevel, title: e.target.value })
                  }
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level_no">Level Number</Label>
                <Input
                  id="level_no"
                  type="number"
                  value={newLevel.level_no}
                  onChange={(e) =>
                    setNewLevel({ ...newLevel, level_no: e.target.value })
                  }
                  className="bg-[rgb(35,55,64)] border-white/20"
                />
              </div>
              <Button
                onClick={createLevel}
                className="w-full"
                disabled={loading}
              >
                Create Level
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <Link
              href={`/admin/courses/${courseId}/levels/${level.id}`}
              key={level.id}
            >
              <Card className="p-6 space-y-4 hover:bg-white/5 transition-colors bg-[rgb(35,55,64)] border-white/10 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{level.title}</h3>
                    <p className="text-gray-400">Level {level.level_no}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteLevel(level.id);
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
