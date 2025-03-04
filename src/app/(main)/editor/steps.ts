import React from "react";
import SkillsForm from "./forms/SkillsForm";
import { EditorFormProps } from "@/lib/types";
import SummaryForm from "./forms/SummaryForm";
import EducationForm from "./forms/EducationForm";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "Work experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "education",
  },
  {
    title: "Skills",
    component: SkillsForm,
    key: "skill",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
];
