export interface CreateExerciseDto {
  title: string;
  body_part_id: string;
  discomfort_type_id: string;
  description: string;
  duration_minutes?: number | null;
  video_url?: string | null;
  safety_notes?: string | null;
  difficulty_level?: string | null;
}

export interface UpdateExerciseDto {
  title?: string;
  body_part_id?: string;
  discomfort_type_id?: string;
  description?: string;
  duration_minutes?: number | null;
  video_url?: string | null;
  safety_notes?: string | null;
  difficulty_level?: string | null;
}
